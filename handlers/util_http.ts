// Spdx-License-Identifier: MIT
// Copyright 2022 - Laguna Labs
//

import { serialize } from '../api_adapter'

interface HttpData {
  url: string
  extPath?: string
  queryParams?: object
}
export class UtilHttpAdapter {
  handle (service: string, data: HttpData): object | undefined {
    if (service === 'util/http-get') {
      return {
        url: `${data?.url ?? ''}${data?.extPath ?? ''}${serialize(data?.queryParams ?? {})}`,
        data: undefined,
        method: 'get'
      }
    }
    if (service === 'util/http-post') {
      return {
        url: `${data?.url ?? ''}${data?.extPath ?? ''}`,
        data: data?.queryParams ?? {},
        method: 'post'
      }
    }
    return undefined
  }
}
