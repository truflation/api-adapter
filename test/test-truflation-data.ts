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
  it('truflation/data/test', testPacket({
    service: 'truflation/data/test',
    data: { id: 805000 },
    abi: 'uint256',
    keypath: 'value',
    multiplier: '1000000000000000000'
  })).timeout(20000)
})
