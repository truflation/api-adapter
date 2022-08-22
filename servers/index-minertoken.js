// Spdx-License-Identifier: MIT
// Copyright 2022 - Laguna Labs
//
// This is a simple chainlab adapter that processes incoming json
// packages and outputs json.

const { ApiAdapter } = require('../api_adapter')

require('dotenv').config()

let services = {
  urlGet: {
    'minertoken': 'http://api.truflation.io:2222/mt'
  },
  urlEncodeData: {
    'minertoken': true
  }
}

// note that the api endpoints are for testing purposes onlu and are
// subject to change

const app = new ApiAdapter(services)

module.exports = {
  app
}

if (require.main === module) {
  app.listen(process.env.EA_PORT || 8081)
}
