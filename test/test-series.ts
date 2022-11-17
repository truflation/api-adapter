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
    data: { ids: '301', types: '121', start_date: '2022-08-01', end_date: '2022-08-01' },
    keypath: 'result.0.1.0',
    abi: 'int256',
    multiplier: '100000000000000'
  }, { verbose: true })).timeout(20000)
})
