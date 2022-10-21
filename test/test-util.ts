#!/usr/bin/env node
import { ApiAdapter } from '../api_adapter'
import { registerUtil } from '../handlers/util'
import { testPacket } from './utils'

const app = new ApiAdapter({})
registerUtil(app)

describe('Test', () => {
  before(() => {
    app.listen(process.env.EA_PORT ?? 8081)
  })
  after(() => {
    app.close()
  })

  it('connect', testPacket({
    service: 'util/math/nerdamer',
    abi: 'uint256',
    multiplier: '1000000000000000000',
    data: { expr: '2+2' }
  }, {
    equal: '0x0000000000000000000000000000000000000000000000003782dace9d900000'
  })).timeout(20000)

  it('connect', testPacket({
    service: 'util/math/nerdamer',
    abi: 'uint256',
    multiplier: '1000000000000000000',
    data: { expr: 'x^2', eval: { x: 3 } }
  }, {
    equal: '0x0000000000000000000000000000000000000000000000007ce66c50e2840000'
  })).timeout(20000)

  it('connect', testPacket({
    service: 'util/math/nerdamer',
    abi: 'uint256',
    multiplier: '1000000000000000000',
    data: { expr: 'x^2', eval: { x: 3.5 } }
  }, {
    equal: '0x000000000000000000000000000000000000000000000000aa00be18c2890000'
  })).timeout(20000)

  it('connect', testPacket({
    service: 'util/math/nerdamer',
    data: { expr: 'diff(x^2, x)', eval: { x: 3.5 } }
  }, {
    equal: '7'
  })).timeout(20000)

  it('connect', testPacket({
    service: 'util/math/nerdamer',
    data: { expr: 'diff(y*x^2, x)', eval: { x: 3.5, y: 2 } }
  }, {
    equal: '14'
  })).timeout(20000)

  it('connect', testPacket({
    service: 'util/math/nerdamer',
    data: { expr: '10*20' }
  }, {
    equal: '200'
  })).timeout(20000)
})
