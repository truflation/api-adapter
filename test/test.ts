#!/usr/bin/env node
import { ApiAdapter } from '../api_adapter'
process.env.TRUFLATION_API_HOST='https://truflation-api.hydrogenx.tk'
import { services, randomized_services } from '../index'
import axios from 'axios'
import assert from 'assert'

require('dotenv').config()

const app = new ApiAdapter(services)
const url = process.env.URL_ADAPTER || 'http://localhost:8081/'

function test_packet(packet, response) {
  return async() => {
    const {data, status} = await axios.post(
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
  it('bad service', test_packet({
    "service": "bad service",
    "data": {"foo": [30, 10530, "string"]},
    "abi": "ipfs"
  }, "no service"))
  it('connect', test_packet({
      service: "echo",
      data: {"foo": [30, 10530, "string"]},
      abi: "ipfs"
  }, "QmPuQCKrxf6CUwdB4mUghgR9qKZ89DV5Frrjg5ZPAYyvQF"))
  it('inflation', test_packet({
    "service": "truflation/at-date",
    "data": {"date" : "2021-10-10"},
    "abi": "json"
  }, {
  currentInflationIndex: 136.82006247089433,
  date: '2021-10-10',
  yearAgoDate: '2020-10-10',
  yearAgoInflationIndex: 127.2394421757194,
  yearOverYearInflation: 7.529599416149551
  }))
})
