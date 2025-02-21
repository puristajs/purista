import { posix } from 'node:path'

import type { RouteHandlerMethod, RouteOptions } from 'fastify'
import type { IHttpService } from '../../types/IHttpService.js'
import { getJsInit } from './getJsInit.impl.js'

export const getOpenApiDocuJsInit = function (this: IHttpService): RouteOptions {
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
