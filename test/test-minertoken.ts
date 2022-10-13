#!/usr/bin/env node
import { app } from '../servers/index-minertoken'
import dotenv from 'dotenv'
dotenv.config()

const url = process.env.URL_ADAPTER ?? 'http://localhost:8081/'

describe('Test', () => {
  before(() => {
    app.listen(process.env.EA_PORT ?? 8081)
  })
  after(() => {
    app.close()
  })
})
