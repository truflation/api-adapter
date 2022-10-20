// Spdx-License-Identifier: MIT
// Copyright 2022 - Laguna Labs
//
// This is a simple chainlab adapter that processes incoming json
// packages and outputs json.

const { ApiAdapter } = require('../api_adapter')
const { DefiLamaAdapter } = require('../handlers/defilama')
const { registerUtil } = require('../handlers/util')
const { randomized_services } = require('../services')

require('dotenv').config()

// note that the api endpoints are for testing purposes onlu and are
// subject to change

const app = new ApiAdapter(randomized_services)
app.register_handler(new DefiLamaAdapter())
app.register_handler(new UtilHttpAdapter())
registerUtil(app)

if (require.main === module) {
  app.listen(process.env.EA_PORT || 8081)
}
