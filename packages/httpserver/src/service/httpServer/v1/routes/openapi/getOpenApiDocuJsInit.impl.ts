import { RouteHandlerMethod, RouteOptions } from 'fastify'
import { posix } from 'path'

import { HttpServerClass } from '../../HttpServerClass.impl'
import { HttpServerServiceV1ConfigRaw } from '../../httpServerServiceConfig'
import { getJsInit } from './getJsInit.imp'

export const getOpenApiDocuJsInit = function (this: HttpServerClass<HttpServerServiceV1ConfigRaw>): RouteOptions {
  const path = (this.config.openApi?.path ? this.config.openApi.path : this.config.apiMountPath) as string
  const url = posix.join(path, '/initializer.js')

  const handler: RouteHandlerMethod = (_request, reply) => {
    reply.header('content-type', 'text/javascript; charset=utf-8')

    return getJsInit(path)
  }

  return {
    method: 'GET',
    url,
    handler,
  }
}
