#!/usr/bin/env node
import { app } from '../servers/index-main'
import { testPacket } from './utils'

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
