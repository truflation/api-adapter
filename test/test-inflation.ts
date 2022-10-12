#!/usr/bin/env node
import { app } from '../servers/index-main'
import { testPacket } from './utils'

describe('Inflation', () => {
  before(() => {
    app.listen(process.env.EA_PORT ?? 8081)
  })
  after(() => {
    app.close()
  })
  it('keypath', testPacket({
    service: 'truflation/at-date',
    keypath: 'yearOverYearInflation',
    data: { location: 'us', date: '2022-10-01' },
    abi: 'json',
    multiplier: '1000000000000000000'
  }, undefined)).timeout(10000)
})
