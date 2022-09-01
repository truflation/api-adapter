#!/usr/bin/env node
import { ApiAdapter } from '../api_adapter'
import { app } from '../servers/index-minertoken'
import axios from 'axios'
import assert from 'assert'

require('dotenv').config()
const url = process.env.URL_ADAPTER || 'http://localhost:8081/'

function test_packet (packet, response) {
  return async () => {
    const { data, status } = await axios.post(
      url,
      packet,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      })
    if (response !== undefined) {
      assert.deepEqual(data, response)
    }
  }
}

describe('Test', () => {
  before(async () => {
    app.listen(process.env.EA_PORT || 8081)
  })
  after(async () => {
    app.close()
  })
})
