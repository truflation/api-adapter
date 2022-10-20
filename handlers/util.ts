import { TfiRequest, ApiAdapter, extractData } from '../api_adapter'
import { Response } from 'express'

const nerdamer = require('nerdamer')
require('nerdamer/Algebra')
require('nerdamer/Calculus')
require('nerdamer/Solve')
require('nerdamer/Extra')

async function UtilMathNerdamerFunc (body: TfiRequest, res: Response):
Promise<void> {
  const data = body.data ?? {}
  let args: object | string
  let r: any
  if (typeof data === 'string' || data instanceof String) {
    args = JSON.parse(data.toString())
  } else {
    args = data
  }
  if (Array.isArray(args)) {
    r = nerdamer(...args).evaluate()
  } else {
    r = nerdamer(args).evaluate()
  }
  const [retval, json] = extractData(
    r, body
  )
  if (json) {
    res.json(retval)
  } else {
    res.write(retval)
    res.end(undefined, 'binary')
  }
}

export function registerUtil (app: ApiAdapter): void {
  app.register_function(
    'util/math/nerdamer',
    UtilMathNerdamerFunc
  )
}
