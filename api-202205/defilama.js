// Spdx-License-Identifier: MIT
// Copyright 2022 - Laguna Labs
//

const _ = require('lodash');

function defilama_transform(url, data) {
  let method = "get"
  if (data?.service === undefined) {
    return [url, data]
  }
  if (data.service === "prices") {
    method = "post"
  }
  url += "/" + data.service
  delete data.service
  console.log(url, data, method)
  return [url, data, method]
}

const defilama_services = {
  urlGet: {
    'defilama/tvl': 'https://api.llama.fi',
    'defilama/coins': 'https://coins.llama.fi',
    'defilama/stablecoins': 'https//stablecoins.llama.fi',
    'defilama/yields': 'https://yields.llama.fi'
  },
  urlTransform: {
    'defilama/tvl':  defilama_transform,
    'defilama/coins': defilama_transform,
    'defilama/stablecoins': defilama_transform,
    'defilama/yields': defilama_transform    
  },
  urlEncodeData: {
    'defilama/tvl': true,
    'defilama/coins': true,
    'defilama/stablecoins': true,
    'defilama/yields': true
  }
}

function add_defilama(services) {
  return _.merge(services, defilama_services)
}

module.exports = {
  add_defilama
}
