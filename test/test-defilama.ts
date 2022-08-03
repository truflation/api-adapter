#!/usr/bin/env node
import { ApiAdapter } from '../api_adapter'
process.env.TRUFLATION_API_HOST='https://truflation-api.hydrogenx.tk'
import { DefiLamaAdapter } from '../defilama'
import axios from 'axios'
import assert from 'assert'

require('dotenv').config()

const app = new ApiAdapter({})
app.register_handler(new DefiLamaAdapter())
const url = process.env.URL_ADAPTER || 'http://localhost:8081/'

function test_packet(packet, response) {
  return async() => {
    const {data, status} = await axios.post(
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
  before(async () => {
    app.listen(process.env.EA_PORT || 8081)
  })
  after(async () => {
    app.close()
  })
  it('chains', test_packet({
    "service": "defilama/tvl/chains",
    "abi": "json"
  }, undefined))
  it('connect', test_packet({
    "service": "defilama/stablecoins/stablecoins",
    "abi": "uint256",
    "multiplier": "1000000000000000000",
    "keypath": "peggedAssets.symbol=USDT.circulating.peggedUSD"
  }, undefined)).timeout(20000)
  it('connect', test_packet({
    "service": "defilama/stablecoins/stablecoincharts/all",
    "abi": "uint256",
    "multiplier": "1000000000000000000",
    "data": {"id": 1},
    "keypath": "date=1652313600.totalCirculating.peggedUSD"
  }, 0x000000000000000000000000000000000000000232084682cb6d600000000000)).timeout(20000)
})
