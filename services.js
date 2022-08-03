// Spdx-License-Identifier: MIT
// Copyright 2022 - Laguna Labs
//
// This is a simple chainlab adapter that processes incoming json
// packages and outputs json.

const { echoFunc, stub1Func, fuzzFunc } =
      require('./api_adapter')

function add_location(url, data) {
  if (data?.location === undefined) {
    return [url, data]
  }
  if (data.location === 'us') {
    delete data.location
    return [url, data]
  }
  if (data.location.match(/^[a-z]+$/)) {
    url += "/"
    url += data.location
    delete data.location
  }
  return [url, data]
}

const truflation_api_host =
      process.env.TRUFLATION_API_HOST ||
      'https://api.truflation.com'
const truflation_nft_host =
      process.env.TRUFLATION_NFT_HOST ||
      'https://truflation-dev-8080.hydrogenx.live'

let services = {
  urlPost: {
    'nft-index': `${truflation_nft_host}/nft-calc/index-value`
  },
  urlGet: {
    'truflation/current': `${truflation_api_host}/current`,
    'truflation/at-date': `${truflation_api_host}/at-date`,
    'truflation/range': `${truflation_api_host}/range`,
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
  urlTransform: {
    'truflation/at-date': add_location
  },
  func: {
    echo: echoFunc,
    stub1: stub1Func,
    fuzz: fuzzFunc
  }
}

const fuzz = {
  'fuzz' : {
    'nft-index': true,
    'truflation/at-date': true,
    'truflation/current': true,
    'truflation/range': true
  }
}

const randomized_services = {...services, ...fuzz}

module.exports = {
  services,
  randomized_services
}
