#!/usr/bin/env node
import { app } from '../servers/index-main'
import { testPacket } from './utils'
import dotenv from 'dotenv'
dotenv.config()

describe('Test', () => {
  before(() => {
    app.listen(process.env.EA_PORT ?? 8081)
  })
  after(() => {
    app.close()
  })
  it('connect', testPacket({
    service: 'truflation/ticker',
      data: { symbol: "com.truflation.flatcoin.price" },
      keypath: "com.truflation.flatcoin.price,value", 
      abi: "int256",
      multiplier: '1000000000000000000'
  }, {
      verbose: true,
    regexp: '^0x[0-9a-fA-F]{64}$'
  })).timeout(200000)
})
