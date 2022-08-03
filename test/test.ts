#!/usr/bin/env node
import { ApiAdapter } from '../api_adapter'
process.env.TRUFLATION_API_HOST='https://truflation-api.hydrogenx.tk'
import { services, randomized_services } from '../services'
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
  currentInflationIndex: 136.8755398909316,
  date: '2021-10-10',
  yearAgoDate: '2020-10-10',
  yearAgoInflationIndex: 127.34693009740337,
  yearOverYearInflation: 7.482402431091287
}
))
  it('echo 1', test_packet({
    "service": "echo",
    "data": {"foo": 1024},
    "keypath": "foo",
    "abi": "uint256"
  }, 0x0000000000000000000000000000000000000000000000000000000000000400))
  it('echo 2', test_packet(
    {
      "service": "echo",
      "data": {"foo": [1024, 2048]},
      "keypath": "foo",
      "abi": "uint256[]"
    }, 0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000800
  ))
  it('echo 3', test_packet(
    {
      "service": "echo",
      "data": {"foo": [30, 10530, "string"]},
      "keypath": "foo",
      "abi": "(uint256, uint256, string)"
    }, 0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000001e000000000000000000000000000000000000000000000000000000000000292200000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000006737472696e670000000000000000000000000000000000000000000000000000
  ))
  it('echo 4', test_packet(
    {
      "service": "echo",
      "data": {"foo": [30, 10530, "string"]},
      "keypath": "foo",
      "abi": "cbor"
    },
    undefined
  ))
})


