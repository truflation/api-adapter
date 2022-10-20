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
  try {
    if (typeof data === 'string' || data instanceof String) {
      console.log(data)
      args = JSON.parse(data.toString())
      console.log(args)
    } else {
      args = data
    }
    if (Array.isArray(args)) {
      r = nerdamer(args[0]).evaluate(args[1]).text()
    } else {
      r = nerdamer(args).evaluate().text()
    }
    const [retval, json] = await extractData(
      r, body
    )
    if (json) {
      res.json(retval)
    } else {
      res.write(retval)
      res.end(undefined, 'binary')
    }
  } catch (err) {
    res.status(200).send(err)
  }
}

export function registerUtil (app: ApiAdapter): void {
  app.register_function(
    'util/math/nerdamer',
    UtilMathNerdamerFunc
  )
}
