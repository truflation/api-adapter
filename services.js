// Spdx-License-Identifier: MIT
// Copyright 2022 - Laguna Labs
//
// This is a simple chainlab adapter that processes incoming json
// packages and outputs json.

const { echoFunc, stub1Func, fuzzFunc } =
      require('./api_adapter')

const truflationApiHost =
      process.env.TRUFLATION_API_HOST ||
      'https://api.truflation.io'
const truflationApiHostUk =
      process.env.TRUFLATION_API_HOST_UK ||
      'http://api.truflation.io:1066'
const truflationNftHost =
      process.env.TRUFLATION_NFT_HOST ||
      'http://nft.truflation.io:8080'

function addLocation (url, data) {
  if (data?.location === undefined) {
    return [url, data]
  }
  if (data.location === 'us') {
    delete data.location
    return [url, data]
  }
  if (data.location === 'uk') {
    url = url.replace(truflationApiHost,
      truflationApiHostUk)
    delete data.location
  }
  return [url, data]
}

const services = {
  urlPost: {
    'nft-index': `${truflationNftHost}/nft-calc/index-value`
  },
  urlGet: {
    'truflation/current': `${truflationApiHost}/current`,
    'truflation/at-date': `${truflationApiHost}/at-date`,
    'truflation/range': `${truflationApiHost}/range`,
    'nuon/dynamic-index': 'https://truflation-api-test.hydrogenx.live/nuon/dynamic-index',
    'nuon/static-index': 'https://truflation-api-test.hydrogenx.live/nuon/static-index',
    minertoken: 'http://api.truflation.io:2222/mt'
  },
  urlEncodeData: {
    'truflation/current': true,
    'truflation/at-date': true,
    'truflation/range': true,
    'nuon/dynamic-index': true,
    'nuon/static-index': true,
    minertoken: true
  },
  urlTransform: {
    'truflation/current': addLocation,
    'truflation/at-date': addLocation,
    'truflation/range': addLocation
  },
  func: {
    echo: echoFunc,
    stub1: stub1Func,
    fuzz: fuzzFunc
  }
}

const fuzz = {
  fuzz: {
    'nft-index': true,
    'truflation/at-date': true,
    'truflation/current': true,
    'truflation/range': true
  }
}

const randomizedServices = { ...services, ...fuzz }

module.exports = {
  services,
  randomizedServices
}
