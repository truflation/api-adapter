// Spdx-License-Identifier: MIT
// Copyright 2022 - Laguna Labs
//
// This is a simple chainlab adapter that processes incoming json
// packages and outputs json.

const { Sentry, isSentryEnabled } = require('./sentry')
const { ApiAdapter } = require('../api_adapter')
const { DefiLamaAdapter } = require('../handlers/defilama')
const { UtilHttpAdapter } = require('../handlers/util_http')
const { registerUtil } = require('../handlers/util')
const { randomizedServices } = require('../services')

require('dotenv').config()

// note that the api endpoints are for testing purposes onlu and are
// subject to change

const app = new ApiAdapter(randomizedServices, isSentryEnabled, Sentry)
app.register_handler(new DefiLamaAdapter())
app.register_handler(new UtilHttpAdapter())
registerUtil(app)

if (process.argv.slice(2).includes('--compile-only')) {
  console.log('compile successful')
} else if (require.main === module) {
  app.listen(process.env.EA_PORT || 8081)
}
