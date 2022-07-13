// Spdx-License-Identifier: MIT
// Copyright 2022 - Laguna Labs
//
// This is a simple chainlab adapter that processes incoming json
// packages and outputs json.

const { ApiAdapter, echoFunc, stub1Func, fuzzFunc } =
      require('./api_adapter')

const services = {
  urlPost: {
    'nft-index': 'https://truflation-dev-8080.hydrogenx.live/nft-calc/index-value'
  },
  urlGet: {
    'truflation/current': 'https://api.truflation.com/current',
    'truflation/at-date': 'https://api.truflation.com/at-date',
    'truflation/range': 'https://api.truflation.com/range',
    'nuon/dynamic-index': 'https://truflation-api-test.hydrogenx.live/nuon/dynamic-index',
    'nuon/static-index': 'https://truflation-api-test.hydrogenx.live/nuon/static-index'
  },
  urlEncodeData: {
    'truflation/current': true,
    'truflation/at-date': true,
    'truflation/range': true,
    'nuon/dynamic-index': true,
    'nuon/static-index': true
  },
  func: {
    echo: echoFunc,
    stub1: stub1Func,
    fuzz: fuzzFunc
  }
}
// note that the api endpoints are for testing purposes onlu and are
// subject to change
const app = new ApiAdapter(services)
app.listen(process.env.EA_PORT || 8081)
const fuzz = {
  'fuzz' : {
    'nft-index': true,
    'truflation/at-date': true,
    'truflation/current': true,
    'truflation/range': true
  }
}

const fuzzed_services = {...services, ...fuzz}
const fuzzed_app = new ApiAdapter(fuzzed_services)
fuzzed_app.listen(process.env.EA_FUZZ_PORT || 8082)

