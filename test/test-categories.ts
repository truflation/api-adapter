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
    data: { location: 'uk', categories: 'true' }
  }, { okFunc: (r) => { return r?.categories !== undefined } })).timeout(20000)
  it('connect', testPacket({
    service: 'truflation/at-date',
    abi: 'json',
    data: { location: 'us', date: '2022-01-01', categories: 'true' }
  }, { okFunc: (r) => { return r?.categories !== undefined } })).timeout(20000)
  it('connect string', testPacket({
    service: 'truflation/at-date',
    abi: 'json',
    data: '{ "location": "us", "date": "2022-01-01", "categories": "true" }'
  }, { okFunc: (r) => { return r?.categories !== undefined } })).timeout(20000)
  it('keypath', testPacket({
    service: 'truflation/at-date',
    abi: 'json',
    data: { location: 'us', date: '2022-01-01', categories: 'true' },
    keypath: 'categories.Personal Care products and services.yearOverYearInflation'
  }, 3.559280755395548)).timeout(20000)
  it('keypath', testPacket({
    service: 'truflation/at-date',
    abi: 'int256',
    multiplier: '1000000000000000000',
    data: { location: 'us', date: '2022-01-01', categories: 'true' },
    keypath: 'categories.Personal Care products and services.yearOverYearInflation'
  }, '0x00000000000000000000000000000000000000000000000031651afd393c5360')).timeout(20000)
  after(() => {
    app.close()
  })
})
