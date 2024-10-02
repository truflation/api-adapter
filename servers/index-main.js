// Spdx-License-Identifier: MIT
// Copyright 2022 - Laguna Labs
//
// This is a simple chainlab adapter that processes incoming json
// packages and outputs json.

const { ApiAdapter } = require('../api_adapter')
const { DefiLlamaAdapter } = require('../handlers/defillama')
const { UtilHttpAdapter } = require('../handlers/util_http')
const { registerUtil } = require('../handlers/util')
const { services, randomizedServices } = require('../services')

require('dotenv').config()

// initialize Sentry for monitoring and logging
if (process.env.SENTRY_DSN) {
  const Sentry = require('@sentry/node')
  const { nodeProfilingIntegration } = require('@sentry/profiling-node')
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [
      nodeProfilingIntegration()
    ],
    tracesSampleRate: 0.2,
    profilesSampleRate: 0.2
  })
}

// note that the api endpoints are for testing purposes only and are
// subject to change

const app = new ApiAdapter(services)
app.register_handler(new DefiLlamaAdapter())
app.register_handler(new UtilHttpAdapter())
registerUtil(app)

const randomizedApp = new ApiAdapter(randomizedServices)
randomizedApp.register_handler(new DefiLlamaAdapter())
randomizedApp.register_handler(new UtilHttpAdapter())
registerUtil(app)

module.exports = {
  app, randomizedApp
}

if (process.argv.slice(2).includes('--compile-only')) {
  console.log('compile successful')
} else if (require.main === module) {
  app.listen(process.env.EA_PORT || 8081)
  randomizedApp.listen(process.env.EA_FUZZ_PORT || 8082)
}
