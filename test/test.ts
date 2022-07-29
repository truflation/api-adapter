#!/usr/bin/env node
import { ApiAdapter } from '../api_adapter'
import { services, randomized_services } from '../index'
require('dotenv').config()

const app = new ApiAdapter(services)

describe('Test', () => {
  before(async () => {
    app.listen(process.env.EA_PORT || 8081)
  })
  after(async () => {
    app.close()
  })
})
