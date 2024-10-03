// Spdx-License-Identifier: MIT
// Copyright 2022 - Laguna Labs
//
// This is a simple chainlab adapter that processes incoming json
// packages and outputs json.

const Sentry = require('@sentry/node')
const { nodeProfilingIntegration } = require('@sentry/profiling-node')
const { ApiAdapter } = require('../api_adapter')

require('dotenv').config()

// initialize Sentry for monitoring and logging
const isSentryEnabled = !!process.env.SENTRY_DSN
if (isSentryEnabled) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [
      nodeProfilingIntegration()
    ],
    tracesSampleRate: 0.2,
    profilesSampleRate: 0.2
  })
}

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
