// Spdx-License-Identifier: MIT
// Copyright 2022 - Laguna Labs
//

import { serialize, HandlerData } from '../api_adapter'

const endpoints = {
  tvl: 'https://api.llama.fi',
  coins: 'https://coins.llama.fi',
  stablecoins: 'https://stablecoins.llama.fi',
  yields: 'https://yields.llama.fi'
}

class DefiLlamaAdapter {
  handle (service: string, data?: object): HandlerData | undefined {
    let method = 'get'
    if (typeof service !== 'string') {
      return undefined
    }
    const s = service.split('/')
    if (s?.[0] !== 'defillama') {
      return undefined
    }
    let url: string | undefined = endpoints[s?.[1]]
    if (url === undefined) {
      return undefined
    }
    const subservice = s.slice(2).join('/')
    if (subservice === 'prices') {
      url += '/' + subservice
      method = 'post'
    } else {
      url += '/' + subservice
      url += '?' + serialize(data ?? {})
      data = undefined
    }
    return {
      url,
      data,
      method
    }
  }
}

module.exports = {
  DefiLlamaAdapter
}
