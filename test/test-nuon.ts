#!/usr/bin/env node
import { app } from '../servers/index-nuon'
import dotenv from 'dotenv'
import { testPacket } from './utils'
dotenv.config()

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
  it('connect', testPacket({
    service: 'nuon/price',
    abi: 'uint256',
    multiplier: '1000000000000000000',
    keypath: 'price'
  }, {
    regexp: '^0x[0-9a-fA-F]{64}$'
  })).timeout(20000)
})
