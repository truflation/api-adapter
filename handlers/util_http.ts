// Spdx-License-Identifier: MIT
// Copyright 2022 - Laguna Labs
//

import { serialize } from '../api_adapter'

interface HttpData {
  url: string
  extPath?: string
  queryParams?: object
  method?: string
}
export class UtilHttpAdapter {
  handle (service: string, data: HttpData): object | undefined {
    if (service !== 'util/http') {
      return undefined
    }
    if (data?.method === 'get' || data?.method === undefined) {
      return {
        url: `${data?.url ?? ''}${data?.extPath ?? ''}${serialize(data?.queryParams ?? {})}`,
        data: undefined,
        method: 'get'
      }
    }
    if (data?.method === 'post') {
      return {
        url: `${data?.url ?? ''}${data?.extPath ?? ''}`,
        data: data?.queryParams ?? {},
        method: 'post'
      }
    }
    return undefined
  }
}
