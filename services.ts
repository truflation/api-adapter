// Spdx-License-Identifier: MIT
// Copyright 2022 - Laguna Labs
//
// This is a simple chainlab adapter that processes incoming json
// packages and outputs json.

import nodecallspython from 'node-calls-python'
import {
  echoFunc, stub1Func, fuzzFunc, echoPythonFunc, TfiRequest
} from './api_adapter'
import path = require('node:path')

const py = nodecallspython.interpreter
const cpiCategories = py.importSync(
  path.join(__dirname, 'cpi_categories.py')
)

require('dotenv').config()

const truflationApiHost =
      process.env.TRUFLATION_API_HOST ??
      'https://api.truflation.io'
const truflationNftHost =
      process.env.TRUFLATION_NFT_HOST ??
  'http://nft.truflation.io:8080'
const truflationSeriesHost =
  process.env.TRUFLATION_SERIES_HOST ??
  'https://api.truflation.io/tfi/series/v1'
const truflationTickerHost =
  process.env.TRUFLATION_TICKER_HOST ??
  'https://api.truflation.com/api/v1/ticker'

interface Location {
  location: string | undefined
  categories: string | undefined
  derivation: string | undefined
}

interface SeriesData {
  ids: string
  types: string
  date: string | undefined
  start_date: string | undefined
  end_date: string | undefined
}

function processSeries (url: string, data: SeriesData): [string, object] {
  console.log(data)
  if (data.types == undefined) {
    data.types = '114'
  }
  url = url + '/' + path.join(
    data.ids, data.types
  )
  if (data.date !== undefined) {
    url = url + '/' + data.date
  } else {
    if (data.start_date !== undefined) {
      url = url + '/' + data.start_date
    }
    if (data.end_date !== undefined) {
      url = url + '/' + data.end_date
    }
  }
  return [url, {}]
}

function addTicker(url: string, data: object): [string, object] {
  const apiKey = process.env.API_KEY;
  console.log(data)
  if (apiKey) {
    const separator = url.includes('?') ? '&' : '?';
    return [url, {...data, 'apikey': apiKey}];
  }

  return [url, data];
}


function addLocation (url: string, datain: Location): [string, Location] {
  const data = Object.assign({}, datain)
  const apiKey = process.env.API_KEY;
  if (apiKey) {
    data['apikey'] = apiKey
  }
  if (data?.categories === 'true') {
    data['show-derivation'] = 'true'
  }
  if (data?.location === undefined) {
    data['index-id'] = '4'
    delete data.location
    return [url, data]
  }
  if (data.location === 'us') {
    data['index-id'] = '4'
    delete data.location
    return [url, data]
  }
  if (data.location === 'uk') {
    data['index-id'] = '2'
    delete data.location
  }
  return [url, data]
}

interface TruflationData {
  categories?: string
  location?: string
  date?: string
}

async function truflationPostProcess (body: TfiRequest, result: object): Promise<object> {
  let data: TruflationData
  if ((typeof body.data === 'string' ||
    body.data instanceof String) &&
    body.data.replace(/\s/g, '').length !== 0) {
    data = JSON.parse(body.data.toString()) as TruflationData
  } else {
    data = (body.data as object ?? {}) as TruflationData
  }

  if (data?.categories !== 'true') {
    return result
  }
  const location = data?.location ?? 'us'
  return py.callSync(
    cpiCategories, 'postprocess_categories',
    location, result
  ) as object
}

function first_value(x: any) {
  return Object.values(x)[0]
}

async function truflationSeriesPostProcess (body: TfiRequest, result: object): Promise<object> {
  if (body?.keypath === undefined ||
    JSON.stringify(body).replace(/\s/g, '').length !== 0) {
    return first_value(first_value(first_value(result))) as object
  }
  return result
}

const services = {
  urlPost: {
    'nft-index': `${truflationNftHost}/nft-calc/index-value`
  },
  urlGet: {
    'truflation/current': `${truflationApiHost}/current`,
    'truflation/at-date': `${truflationApiHost}/at-date`,
    'truflation/range': `${truflationApiHost}/range`,
    'truflation/series': `${truflationSeriesHost}`,
    'truflation/ticker': `${truflationTickerHost}`,
    'nuon/price': 'https://api.truflation.io/nuon/price',
    minertoken: 'https://api.truflation.io/mt'
  },
  urlEncodeData: {
    'truflation/current': true,
    'truflation/at-date': true,
    'truflation/range': true,
    'truflation/ticker': true,
    'nuon/price': true,
    minertoken: true
  },
  urlTransform: {
    'truflation/current': addLocation,
    'truflation/at-date': addLocation,
    'truflation/range': addLocation,
    'truflation/series': processSeries,
    'truflation/ticker': addTicker
  },
  urlPostProcess: {
    'truflation/current': truflationPostProcess,
    'truflation/at-date': truflationPostProcess,
    'truflation/range': truflationPostProcess,
    'truflation/series': truflationSeriesPostProcess
  },
  func: {
    echo: echoFunc,
    'echo/python': echoPythonFunc,
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
