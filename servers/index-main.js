// Spdx-License-Identifier: MIT
// Copyright 2022 - Laguna Labs
//
// This is a simple chainlab adapter that processes incoming json
// packages and outputs json.

const { ApiAdapter } = require('../api_adapter')
const { DefiLlamaAdapter } = require('../defillama')
const { services, randomizedServices } = require('../services')

require('dotenv').config()

// note that the api endpoints are for testing purposes onlu and are
// subject to change

const app = new ApiAdapter(services)
app.register_handler(new DefiLlamaAdapter())
const randomizedApp = new ApiAdapter(randomizedServices)
randomizedApp.register_handler(new DefiLlamaAdapter())

module.exports = {
  app, randomizedApp
}

if (require.main === module) {
  app.listen(process.env.EA_PORT || 8081)
  randomizedApp.listen(process.env.EA_FUZZ_PORT || 8082)
}
