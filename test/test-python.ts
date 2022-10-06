#!/usr/bin/env node
import { app } from '../servers/index-main'
import { toBytes } from './utils'
import axios from 'axios'
import assert from 'assert'
import dotenv from 'dotenv'
dotenv.config()
const url = process.env.URL_ADAPTER ?? 'http://localhost:8081/'

function testPacket (packet, response) {
  return async () => {
    const { data } = await axios.post(
      url,
      packet,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      })
    if (response !== undefined) {
      assert.deepEqual(data, response)
    }
  }
}

describe('Test', () => {
  before(() => {
    app.listen(process.env.EA_PORT ?? 8081)
  })
  after(() => {
    app.close()
  })
  it('echo 1', testPacket({
    service: 'echo/python',
    data: { foo: 1024 },
    keypath: 'foo',
    abi: 'uint256'
  }, toBytes('0x0000000000000000000000000000000000000000000000000000000000000400'))).timeout(10000)
  it('echo 2', testPacket(
    {
      service: 'echo/python',
      data: { foo: [1024, 2048] },
      keypath: 'foo',
      abi: 'uint256[]'
    }, toBytes('0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000800')
  ))
  it('echo 3', testPacket(
    {
      service: 'echo/python',
      data: { foo: [30, 10530, 'string'] },
      keypath: 'foo',
      abi: '(uint256, uint256, string)'
    }, toBytes('0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000001e000000000000000000000000000000000000000000000000000000000000292200000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000006737472696e670000000000000000000000000000000000000000000000000000')
  ))
  it('echo 4', testPacket(
    {
      service: 'echo/python',
      data: { foo: [30, 10530, 'string'] },
      keypath: 'foo',
      abi: 'cbor'
    },
    undefined
  ))
})
