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
  it('connect', testPacket({
    service: 'truflation/current',
    abi: 'json',
    data: { location: 'uk' }
  }, undefined)).timeout(20000)
  it('connect', testPacket({
    service: 'truflation/current',
    abi: 'json',
    data: { location: 'us' }
  }, undefined)).timeout(20000)

  after(() => {
    app.close()
  })
})
