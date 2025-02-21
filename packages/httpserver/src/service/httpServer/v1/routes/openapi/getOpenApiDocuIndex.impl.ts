import type { RouteHandlerMethod, RouteOptions } from 'fastify'

import type { IHttpService } from '../../types/IHttpService.js'
import { getIndexHtml } from './getIndexHtml.impl.js'

export const getOpenApiDocuIndex = function (this: IHttpService): RouteOptions {
	const path = (this.config.openApi?.path ? this.config.openApi.path : this.config.apiMountPath) as string
	const url = `${path}`

	const handler: RouteHandlerMethod = (_reqest, reply) => {
		reply.header('content-type', 'text/html; charset=utf-8')

		return getIndexHtml(path)
	}

	return {
		method: 'GET',
		url,
		handler,
	}
}
