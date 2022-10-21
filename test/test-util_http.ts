#!/usr/bin/env node
import { ApiAdapter } from '../api_adapter'
import { UtilHttpAdapter } from '../handlers/util_http'
import { testPacket } from './utils'

const app = new ApiAdapter({})
app.register_handler(new UtilHttpAdapter())

describe('Test', () => {
  before(() => {
    app.listen(process.env.EA_PORT ?? 8081)
  })
  after(() => {
    app.close()
  })

  it('connect', testPacket({
    service: 'util/http',
    abi: 'uint256',
    multiplier: '1000000000000000000',
    data: { url: 'https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/2020-11-24/currencies/eur.json' },
    keypath: 'eur.aed'
  }, {
    regexp: '^0x[0-9a-fA-F]{64}$'
  })).timeout(20000)
})
