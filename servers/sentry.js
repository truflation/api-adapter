const Sentry = require('@sentry/node')
const { nodeProfilingIntegration } = require('@sentry/profiling-node')

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

module.exports = { Sentry, isSentryEnabled }
