// Spdx-License-Identifier: MIT
// Copyright 2022 - Laguna Labs
//
// This is a simple chainlab adapter that processes incoming json
// packages and outputs json.

const { Sentry, isSentryEnabled } = require('./sentry')
const { ApiAdapter } = require('../api_adapter')

require('dotenv').config()

const services = {
  urlGet: {
    minertoken: 'http://api.truflation.io:2222/mt'
  },
  urlEncodeData: {
    minertoken: true
  }
}

// note that the api endpoints are for testing purposes onlu and are
// subject to change

const app = new ApiAdapter(services, isSentryEnabled, Sentry)

module.exports = {
  app
}

if (process.argv.slice(2).includes('--compile-only')) {
  console.log('compile successful')
} else if (require.main === module) {
  app.listen(process.env.EA_PORT || 8081)
}
