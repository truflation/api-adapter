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

if (require.main === module) {
  app.listen(process.env.EA_PORT || 8081)
  randomizedApp.listen(process.env.EA_FUZZ_PORT || 8082)
}
