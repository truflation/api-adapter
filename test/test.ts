#!/usr/bin/env node
import { app } from '../servers/index-main'
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
  it('bad service', testPacket({
    service: 'bad service',
    data: { foo: [30, 10530, 'string'] },
    abi: 'ipfs'
  }, 'no service'))
  /*  it('connect', testPacket({
      service: "echo",
      data: {"foo": [30, 10530, "string"]},
      abi: "ipfs"
  }, "QmPuQCKrxf6CUwdB4mUghgR9qKZ89DV5Frrjg5ZPAYyvQF")) */
  it('inflation', testPacket({
    service: 'truflation/at-date',
    data: { date: '2021-10-10' },
    abi: 'json'
  }, undefined)).timeout(20000)

  it('nft', testPacket({
    service: 'nft-index',
    data: { index: 'nft/top11', date: '2021-10-10' },
    abi: 'json'
  }, {
    timestamp: '2021-10-10T00:00:00.000Z',
    index: 104.6402453102453,
    aDayChange: 0.24229362591431586,
    aMonthChange: 25.03669682169257
  })).timeout(20000)

  it('echo 1', testPacket({
    service: 'echo',
    data: { foo: 1024 },
    keypath: 'foo',
    abi: 'uint256'
  }, 0x0000000000000000000000000000000000000000000000000000000000000400))
  it('echo 2', testPacket(
    {
      service: 'echo',
      data: { foo: [1024, 2048] },
      keypath: 'foo',
      abi: 'uint256[]'
    }, 0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000800
  ))
  it('echo 3', testPacket(
    {
      service: 'echo',
      data: { foo: [30, 10530, 'string'] },
      keypath: 'foo',
      abi: '(uint256, uint256, string)'
    }, 0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000001e000000000000000000000000000000000000000000000000000000000000292200000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000006737472696e670000000000000000000000000000000000000000000000000000
  ))
  it('echo 4', testPacket(
    {
      service: 'echo',
      data: { foo: [30, 10530, 'string'] },
      keypath: 'foo',
      abi: 'cbor'
    },
    undefined
  ))
  it('minertoken', testPacket(
    {
      service: 'minertoken'
    },
    undefined
  )).timeout(20000)
})
