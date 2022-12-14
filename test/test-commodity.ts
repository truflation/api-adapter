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
    service: 'truflation/series',
    data: { ids: '603', types: '114', date: '2022-10-04' },
    keypath: 'result.0.1.0',
  })).timeout(20000)
  it('connect', testPacket({
    service: 'truflation/series',
    data: { ids: '603', types: '114' },
    keypath: 'result.0.1.0',
  })).timeout(20000)
})
