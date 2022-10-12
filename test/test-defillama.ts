#!/usr/bin/env node
import { ApiAdapter } from '../api_adapter'
import { DefiLlamaAdapter } from '../defillama'
import { testPacket } from './utils'

const app = new ApiAdapter({})
app.register_handler(new DefiLlamaAdapter())

describe('Test', () => {
  before(() => {
    app.listen(process.env.EA_PORT ?? 8081)
  })
  after(() => {
    app.close()
  })
  it('chains', testPacket({
    service: 'defillama/tvl/chains',
    abi: 'json'
  }, undefined)).timeout(20000)
  it('connect', testPacket({
    service: 'defillama/stablecoins/stablecoins',
    abi: 'uint256',
    multiplier: '1000000000000000000',
    keypath: 'peggedAssets.symbol=USDT.circulating.peggedUSD'
  }, {
    regexp: '^0x[0-9a-fA-F]+$'
  })).timeout(20000)
  it('connect', testPacket({
    service: 'defillama/stablecoins/stablecoincharts/all',
    abi: 'uint256',
    multiplier: '1000000000000000000',
    data: { id: 1 },
    keypath: 'date=1652313600.totalCirculating.peggedUSD'
  }, {
    regexp: '^0x[0-9a-fA-F]{64}$'
  })).timeout(20000)
})
