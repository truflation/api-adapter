// Spdx-License-Identifier: MIT
// Copyright 2022 - Laguna Labs
//
// This is a simple chainlab adapter that processes incoming json
// packages and outputs json.

const express = require('express')
const bodyParser = require('body-parser')
const { Requester } = require('@chainlink/external-adapter')
const Web3EthAbi = require('web3-eth-abi')
const cbor = require('cbor')
const { create } = require('ipfs-http-client')
const client = create('https://ipfs.infura.io:5001/api/v0')

function isNumeric (val) {
  // parseFloat NaNs numeric-cast false positives (null|true|false|"")
  // ...but misinterprets leading-number strings, particularly hex literals ("0x...")
  // subtraction forces infinities to NaN
  // adding 1 corrects loss of precision from parseFloat (#15100)
  return !Array.isArray(val) && (val - parseFloat(val) + 1) >= 0
}

function getValue (object, key, strict) {
  if (object instanceof Object && typeof key === 'string') {
    const a = key.split('.')
    for (let i = 0; i < a.length; i++) {
      const k = a[i]

      if (k.includes('=')) {
        const s = k.split('=', 2)
        for (const i of object) {
          if (i[s[0]] === s[1]) {
            object = i
            break
          }
        }
      } else if (k in object) {
        object = object[k]
      } else {
        if (strict === true) {
          throw new Error('Invalid path')
        } else {
          return undefined
        }
      }
    }
    return object
  }
}

async function extractData (data, header, fuzz = false) {
  const keypath = header.keypath
  const multiplier = header.multiplier
  let abi = header.abi
  console.log(header)

  let json = true
  if (keypath !== undefined &&
      keypath !== '') {
    data = getValue(
      data, keypath
    )
  }
  console.log('starting fuzz', fuzz)
  if (fuzz) {
    console.log('fuzzing')
    const iterate = (obj) => {
      const r = {}
      Object.keys(obj).forEach(key => {
        r[key] = obj[key]
        if (isNumeric(obj[key])) {
          const n = +obj[key]
          r[key] = n * (1.0 + (0.1 * (0.5 - Math.random())))
        } else {
          r[key] = obj[key]
        }
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          r[key] = iterate(obj[key])
        }
      })
      return r
    }
    if (typeof data === 'object') {
      data = iterate(data)
      console.log('data', data)
    }
  }

  console.log(multiplier)
  if (multiplier !== undefined &&
      multiplier !== '') {
    if (Array.isArray(data)) {
      data = data.map((x) => BigInt(x * multiplier))
    } else {
      data = BigInt(data * multiplier)
    }
  }

  if (abi === undefined || abi === '') {
    abi = 'json'
  }
  if (abi === 'ipfs' || abi === 'ipfs/json') {
    const r = await client.add(JSON.stringify(data))
    data = r.path
    json = false
  } else if (abi === 'ipfs/cbor') {
    const r = await client.add(cbor.encode(data))
    data = r.path
    json = false
  } else if (abi === 'cbor') {
    data = cbor.encode(data)
    json = false
  } else if (abi !== 'json') {
    data = Web3EthAbi.encodeParameter(abi, data)
    json = false
  }
  console.log(data, json)
  return [data, json]
}

function serialize (obj) {
  const str = []
  for (const p in obj) {
    if (p in obj) {
      str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]))
    }
  }
  return str.join('&')
}

class ApiAdapter {
  constructor (services) {
    if (services?.fuzz === undefined) {
      services.fuzz = {}
    }
    if (services?.func === undefined) {
      services.func = {}
    }
    if (services?.urlPost === undefined) {
      services.urlPost = {}
    }
    if (services?.urlGet === undefined) {
      services.urlGet = {}
    }

    this.services = services
    this.services.handlers = []
    this.app = express()
    this.app.use(bodyParser.json())
    this.app.post('/', (req, res) => {
      this.process(req, res)
    })
  }

  getPermission (body) {
    return true
  }

  register_handler (h) {
    this.services.handlers.push(h)
  }

  async process (req, res) {
    const body = req.body
    if (!this.getPermission(body)) {
      res.status(200).json({ error: 'permission denied' })
      return
    }

    const service = body?.service
    if (service === undefined) {
      res.status(200).json({ error: 'No service' })
      return
    }

    if (this?.services?.func?.[service] !== undefined) {
      this.services.func[service](body, res)
      return
    }

    this.createRequest(body, (status, result) => {
      console.log('Result: ', result[0])
      console.log(typeof result[0])
      try {
        if (result[1]) {
          res.status(status).json(result[0])
        } else {
          res.status(status).write(result[0])
          res.end(undefined, 'binary')
        }
      } catch (err) {
        res.status(200).send(err)
      }
    })
  }

  async createRequest (input, callback) {
    const service = input.service
    let data = input.data
    if ((typeof data === 'string' ||
         data instanceof String) &&
        data.replace(/\s/g, '').length) {
      data = JSON.parse(data)
    }
    if (data === undefined) {
      data = {}
    }

    let url = this.services?.urlPost?.[service]
    let method = 'post'
    if (url === undefined) {
      method = 'get'
      url = this.services?.urlGet?.[service]
    }
    if (this.services?.urlTransform?.[service] !== undefined) {
      const r = this.services?.urlTransform?.[service](url, data)
      url = r?.[0]
      data = r?.[1]
      method = r?.[2]
    }

    if (this.services?.urlEncodeData?.[service] === true) {
      console.log('urlencode')
      url = url + '?' + serialize(data)
      console.log(url)
      data = undefined
    }

    for (const i of this.services.handlers) {
      const r = i.handle(service, data)
      console.log(r)
      if (r !== undefined) {
        url = r?.[0]
        data = r?.[1]
        method = r?.[2]
        break
      }
    }

    if (url === undefined) {
      callback(200, ['"no service"', false])
      return
    }

    console.log('Url: ', url)
    console.log('Data: ', data)
    console.log('Method: ', method)
    Requester.request(
      {
        method,
        url,
        data,
        timeout: 300000
      }
    )
      .then(async response => {
        console.log(response.data, input)
        const [retval, json] = await extractData(
          response.data, input,
          this.services?.fuzz[service] === true
        )
        console.log(retval)
        callback(response.status, [retval, json])
      })
      .catch(error => {
        callback(200, [Requester.errored(0, error), false])
      })
  }

  listen (port) {
    this.listener =
      this.app.listen(port, () => console.log(`Listening on port ${port}!`))
  }

  close () {
    this.listener.close()
  }
}

async function echoFunc (body, res) {
  let data = body.data === undefined ? {} : body.data
  if (typeof data === 'string' || data instanceof String) {
    data = JSON.parse(data)
  }
  const [retval, json] = await extractData(
    data, body
  )
  if (json) {
    res.json(retval)
  } else {
    res.write(retval)
    res.end(undefined, 'binary')
  }
}

async function fuzzFunc (body, res) {
  let data = body.data === undefined ? {} : body.data
  if (typeof data === 'string' || data instanceof String) {
    data = JSON.parse(data)
  }
  const [retval, json] = await extractData(
    data, body, true
  )
  if (json) {
    res.json(retval)
  } else {
    res.write(retval)
    res.end(undefined, 'binary')
  }
}

async function stub1Func (body, res) {
  let data = body.data === undefined ? {} : body.data
  if (typeof data === 'string' || data instanceof String) {
    data = JSON.parse(data)
  }
  const range = data.range !== undefined ? data.range : [0.0, 1.0]
  const indexes = data.indexes !== undefined ? data.indexes : ['index']
  data = {}
  indexes.forEach(x => {
    data[x] = Math.random() * (range[1] - range[0]) + range[0]
  })
  const [retval, json] = await extractData(
    data, body, false
  )
  if (json) {
    res.json(retval)
  } else {
    res.write(retval)
    res.end(undefined, 'binary')
  }
}

class PermissionedApiAdapter extends ApiAdapter {
  constructor (services, whiteList) {
    super(services)
    this.whiteList = whiteList
  }

  getPermission (body) {
    return this.whiteList.includes(this.body?.meta?.sender)
  }
}

module.exports = {
  PermissionedApiAdapter,
  ApiAdapter,
  extractData,
  echoFunc,
  stub1Func,
  fuzzFunc,
  serialize
}
