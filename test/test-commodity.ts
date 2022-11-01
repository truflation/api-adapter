#!/usr/bin/env node
import { app } from '../servers/index-main'
import { testPacket } from './utils'

describe('Test', () => {
  before(() => {
    app.listen(process.env.EA_PORT ?? 8081)
  })
  after(() => {
    app.close()
  })

  it('connect', testPacket({
    service: 'truflation/data',
    data: { id: '8001010', date: '2022-10-04' }
  })).timeout(20000)
  it('connect', testPacket({
    service: 'truflation/data',
    data: { id: '8001010' }
  })).timeout(20000)
})
