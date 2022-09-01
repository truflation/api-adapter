// Spdx-License-Identifier: MIT
// Copyright 2022 - Laguna Labs
//
// This is a simple chainlab adapter that processes incoming json
// packages and outputs json.

const { ApiAdapter } = require('../api_adapter')
const { DefiLamaAdapter } = require('../defilama')
const { services, randomized_services } = require('../services')

require('dotenv').config()

// note that the api endpoints are for testing purposes onlu and are
// subject to change

const app = new ApiAdapter(services)
app.register_handler(new DefiLamaAdapter())
const randomized_app = new ApiAdapter(randomized_services)
randomized_app.register_handler(new DefiLamaAdapter())

module.exports = {
  app, randomized_app
}

if (require.main === module) {
  app.listen(process.env.EA_PORT || 8081)
  randomized_app.listen(process.env.EA_FUZZ_PORT || 8082)
}
