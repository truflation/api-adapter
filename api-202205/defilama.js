// Spdx-License-Identifier: MIT
// Copyright 2022 - Laguna Labs
//

const { serialize } = require('./api_adapter')

const endpoints = {
  'tvl': 'https://api.llama.fi',
  'coins': 'https://coins.llama.fi',
  'stablecoins': 'https://stablecoins.llama.fi',
  'yields': 'https://yields.llama.fi'
}

class DefiLamaAdapter {
  handle(service, data, method) {
    method = 'get'
    if (typeof service !== 'string') {
      return undefined;
    }
    const s = service.split('/', 3)
    if (s?.[0] !== 'defilama') {
      return undefined
    }
    let url = endpoints[s?.[1]]
    if ( url === undefined) {
      return undefined
    }
    const subservice = s?.[2]
    if (subservice === 'prices') {
      url += '/' + subservice
      method = 'post'
    } else {
      url += '/' + subservice
      url += "?" + serialize(data)
      data = undefined
    }
    return [ url, data, method ]
  }
}

module.exports = {
  DefiLamaAdapter
}
