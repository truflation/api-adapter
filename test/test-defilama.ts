#!/usr/bin/env node
import { ApiAdapter } from '../api_adapter'
import { DefiLamaAdapter } from '../defilama'
import axios from 'axios'
import assert from 'assert'
import dotenv from 'dotenv'
dotenv.config()

const app = new ApiAdapter({})
app.register_handler(new DefiLamaAdapter())
const url = process.env.URL_ADAPTER || 'http://localhost:8081/'

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
    app.listen(process.env.EA_PORT || 8081)
  })
  after(() => {
    app.close()
  })
  it('chains', testPacket({
    service: 'defilama/tvl/chains',
    abi: 'json'
  }, undefined)).timeout(20000)
  it('connect', testPacket({
    service: 'defilama/stablecoins/stablecoins',
    abi: 'uint256',
    multiplier: '1000000000000000000',
    keypath: 'peggedAssets.symbol=USDT.circulating.peggedUSD'
  }, undefined)).timeout(20000)
  it('connect', testPacket({
    service: 'defilama/stablecoins/stablecoincharts/all',
    abi: 'uint256',
    multiplier: '1000000000000000000',
    data: { id: 1 },
    keypath: 'date=1652313600.totalCirculating.peggedUSD'
  }, undefined)).timeout(20000)
})
