// Spdx-License-Identifier: MIT
// Copyright 2022 - Laguna Labs
//
// This is a simple chainlab adapter that processes incoming json
// packages and outputs json.

import express from 'express'
import bodyParser from 'body-parser'
import cbor from 'cbor'
import nodecallspython from 'node-calls-python'
import BigNumber from 'bignumber.js'
import { Requester } from '@chainlink/external-adapter'
import { create } from 'ipfs-http-client'
import path = require('node:path')

BigNumber.config({ EXPONENTIAL_AT: 1e+9 })
const Web3EthAbi = require('web3-eth-abi')
const client = create({
  url: process.env.IPFS_HOST ?? 'http://ipfs:5001/api/v0'
})
const py = nodecallspython.interpreter
const echo = py.importSync(path.join(__dirname, 'echo.py'))

function isNumeric (val): boolean {
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

export interface TfiRequest {
  keypath?: string
  multiplier?: string
  abi?: string
  service: string
  data?: object | string
  meta?: {
    sender?: string
  }
}

export interface HandlerData {
  url: string
  data?: object
  method: string
}

function iterate (obj): object {
  const r = {}
  Object.keys(obj).forEach((key: string) => {
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

export async function extractData (data, header: TfiRequest, fuzz = false): Promise<[any, boolean]> {
  const keypath = header.keypath
  const multiplier = header.multiplier
  let abi = header.abi

  let json = true
  if (keypath !== undefined &&
    keypath !== '') {
    console.log(`keypath=${keypath}`)
    data = getValue(
      data, keypath, false
    )
    console.log(`keypath/data=${data}`)
  }
  console.log('starting fuzz', fuzz)
  if (fuzz) {
    console.log('fuzzing')
    if (typeof data === 'object') {
      data = iterate(data)
      console.log('data', data)
    }
  }

  if (multiplier !== undefined &&
    multiplier !== '') {
    console.log(`multiplier=${multiplier}`)
    console.log(`data=${data}`)
    if (Array.isArray(data)) {
      data = data.map((x) =>
        BigNumber(multiplier).times(x).integerValue().toString())
    } else {
      data = BigNumber(multiplier).times(data).integerValue().toString()
    }
    console.log(data)
  }

  if (abi === undefined || abi === '') {
    abi = 'json'
  }
  if (abi === 'ipfs' || abi === 'ipfs/json') {
    console.log('ipfs')
    const r = await client.add(JSON.stringify(data))
    data = r.path
    json = false
  } else if (abi === 'ipfs/cbor') {
    console.log('ipfs')
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

export function serialize (obj: object): string {
  const str: string[] = []
  for (const p in obj) {
    if (p in obj) {
      str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]))
    }
  }
  return str.join('&') ?? ''
}

interface Services {
  urlPost?: object
  urlGet?: object
  urlEncodeData?: object
  urlTransform?: object
  urlPostProcess?: object
  func?: object
  fuzz?: boolean
  handlers: any
}

export class ApiAdapter {
  services: Services
  app: any
  listener: any
  constructor (services: Services) {
    services.fuzz = services?.fuzz ?? false
    services.func = services?.func ?? {}
    services.urlPost = services?.urlPost ?? {}
    services.urlGet = services?.urlGet ?? {}
    services.urlTransform = services?.urlTransform ?? {}
    services.urlPostProcess = services?.urlPostProcess ?? {}
    services.urlEncodeData = services?.urlEncodeData ?? {}

    this.services = services
    this.services.handlers = []
    this.app = express()
    this.app.use(bodyParser.json())
    this.app.post('/', (req, res) => {
      this.process(req, res)
    })
  }

  getPermission (body: TfiRequest): boolean {
    return true
  }

  register_handler (h): void {
    this.services.handlers.push(h)
  }

  register_function (service: string, func): void {
    this.services.func![service] = func
  }

  process (req, res): void {
    const body = req.body as TfiRequest
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
      console.log(`service=${service}`)
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

  createRequest (input: TfiRequest, callback): void {
    const service = input.service
    let data = input.data ?? {}
    if ((typeof data === 'string' ||
         data instanceof String) &&
      data.replace(/\s/g, '').length) {
      data = JSON.parse(data.toString())
    }
    if (data === undefined) {
      data = {}
    }
    console.log(service)
    console.log(`data=${data}`)
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
      console.log('urlEncode')
      console.log(data)
      url = url + '?' + serialize(data as object)
      data = {}
    }

    for (const i of this.services.handlers) {
      const r = i.handle(service, data)
      console.log(r)
      if (r !== undefined) {
        url = r.url
        data = r.data
        method = r.method
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
        let result = response.data
        if (this.services.urlPostProcess?.[service] !== undefined) {
          result = await this.services.urlPostProcess?.[service](input, result)
        }
        const [retval, json] = await extractData(
          result, input,
          this.services.fuzz?.[service] === true
        )
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

  close (): void {
    this.listener.close()
  }
}

export async function echoFunc (body: TfiRequest, res): Promise<void> {
  let data = body.data ?? {}
  if (typeof data === 'string' || data instanceof String) {
    data = JSON.parse(data.toString())
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

export async function dataTestFunc (body: TfiRequest, res): Promise<void> {
  let data = 120.0 + Math.random() * 20.0 - 10.0
  const [retval, json] = await extractData(
    data.toString(), body
  )
  console.log(retval)
  if (json) {
    res.json(retval)
  } else {
    res.write(retval)
    res.end(undefined, 'binary')
  }
}

export async function echoPythonFunc (body: TfiRequest, res): Promise<void> {
  let data: any = body.data ?? {}
  if (typeof data === 'string' || data instanceof String) {
    data = JSON.parse(data.toString())
  }
  data = py.callSync(echo, 'echo', data)
  console.log(`data = ${data}`)
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

export async function fuzzFunc (body: TfiRequest, res): Promise<void> {
  let data = body.data ?? {}
  if (typeof data === 'string' || data instanceof String) {
    data = JSON.parse(data.toString())
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

export async function stub1Func (body, res): Promise<void> {
  let data = body.data ?? {}
  if (typeof data === 'string' || data instanceof String) {
    data = JSON.parse(data.toString())
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
  whiteList: string[]
  constructor (services, whiteList: string[]) {
    super(services)
    this.whiteList = whiteList
  }

  getPermission (body: TfiRequest): boolean {
    return this.whiteList.includes(body?.meta?.sender ?? '')
  }
}

module.exports = {
  PermissionedApiAdapter,
  ApiAdapter,
  extractData,
  echoFunc,
  stub1Func,
  echoPythonFunc,
  fuzzFunc,
  dataTestFunc,
  serialize
}
