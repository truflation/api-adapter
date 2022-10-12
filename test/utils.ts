import axios from 'axios'
import assert from 'assert'
import dotenv from 'dotenv'
dotenv.config()

const url = process.env.URL_ADAPTER ?? 'http://localhost:8081/'

export function toBytes (hex: string): string {
  if (typeof hex !== 'string') {
    throw new TypeError(
      `The \`hex\` argument must be of type 'string', but it is of type '${typeof hex}'`
    )
  }
  if (hex.slice(0, 2) === '0x') {
    hex = hex.slice(2)
  }
  const result = []
  for (let i = 0; i < hex.length; i += 2) {
    result.push(String.fromCharCode(parseInt(hex.substr(i, 2), 16)))
  }
  return result.join('')
}

interface Response {
  equal: any
  regexp: any
  verbose: boolean | undefined
}

interface Packet {
  service: string | undefined
  abi: string | undefined
  data: any | undefined
  multiplier: string | number | undefined
  keypath: string | undefined
}

export function testPacket (packet: Packet, response: Response): void {
  return async () => {
    const { data } = await axios.post(
      url,
      packet,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      })
    if (response?.verbose === true) {
      console.log(data)
    }
    if (response?.equal !== undefined) {
      assert.deepEqual(data, response.equal)
    } else if (response?.regexp !== undefined) {
      console.log(data)
      assert.ok(data?.match(response.regexp))
    } else if (response !== undefined && response?.verbose === undefined) {
      assert.deepEqual(data, response)
    }
  }
}
