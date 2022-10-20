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
    data: '["2+2"]'
  }, {
    equal: '0x0000000000000000000000000000000000000000000000003782dace9d900000'
  })).timeout(20000)

  it('connect', testPacket({
    service: 'util/math/nerdamer',
    abi: 'uint256',
    multiplier: '1000000000000000000',
    data: '["x^2", {"x":3}]'
  }, {
    equal: '0x0000000000000000000000000000000000000000000000007ce66c50e2840000'
  })).timeout(20000)

  it('connect', testPacket({
    service: 'util/math/nerdamer',
    abi: 'uint256',
    multiplier: '1000000000000000000',
    data: '["x^2", {"x":3.5}]'
  }, {
    equal: '0x000000000000000000000000000000000000000000000000aa00be18c2890000'
  })).timeout(20000)

})
