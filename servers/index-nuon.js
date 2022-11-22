// Spdx-License-Identifier: MIT
// Copyright 2022 - Laguna Labs
//
// This is a simple chainlab adapter that processes incoming json
// packages and outputs json.

const { PermissionedApiAdapter } = require('../api_adapter')

require('dotenv').config()

let services = {
  urlGet: {
    'nuon/dynamic-index': 'https://truflation-api-test.hydrogenx.live/nuon/dynamic-index',
    'nuon/static-index': 'https://truflation-api-test.hydrogenx.live/nuon/static-index'
  },
  urlEncodeData: {
    'nuon/dynamic-index': true,
    'nuon/static-index': true
  }
}

// note that the api endpoints are for testing purposes onlu and are
// subject to change

const app = new PermissionedApiAdapter(services, [])

module.exports = {
  app
}

if (process.argv.slice(2).includes('--compile-only')) {
  console.log('compile successful')
} else if (require.main === module) {
  app.listen(process.env.EA_PORT || 8081)
}
