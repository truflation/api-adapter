// Spdx-License-Identifier: MIT
// Copyright 2022 - Laguna Labs
//
// This is a simple chainlab adapter that processes incoming json
// packages and outputs json.

const { ApiAdapter } = require('../api_adapter')

require('dotenv').config()

const services = {
  urlGet: {
    'nuon/price': 'https://api.truflation.io/nuon/price'
  },
  urlEncodeData: {
    'nuon/price': true
  }
}

// note that the api endpoints are for testing purposes onlu and are
// subject to change

const app = new ApiAdapter(services, [])

module.exports = {
  app
}

if (process.argv.slice(2).includes('--compile-only')) {
  console.log('compile successful')
} else if (require.main === module) {
  app.listen(process.env.EA_PORT || 8081)
}
