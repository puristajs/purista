import type { HttpExposedServiceMeta, Service, ServiceClassTypes } from '@purista/core'
import type { HttpServerServiceV1ConfigRaw } from '../httpServerServiceConfig.js'

export type IHttpService = Service<ServiceClassTypes<HttpServerServiceV1ConfigRaw>> & {
	routeDefinitions: HttpExposedServiceMeta<Record<string, unknown>>[]
}
