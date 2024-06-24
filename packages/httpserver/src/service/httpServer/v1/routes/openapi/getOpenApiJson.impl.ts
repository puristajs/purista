import { posix } from 'node:path'

import { StatusCode } from '@purista/core'
import type { RouteHandlerMethod, RouteOptions } from 'fastify'
import type { OpenAPIObject, ParameterObject, RequestBodyObject, SchemaObject } from 'openapi3-ts/oas31'
import { isReferenceObject } from 'openapi3-ts/oas31'

import type { HttpServerClass } from '../../HttpServerClass.impl.js'
import type { HttpServerServiceV1ConfigRaw } from '../../httpServerServiceConfig.js'
import { OPENAPI_DEFAULT_INFO } from '../../httpServerServiceConfig.js'

/**
 * It creates a route handler that returns the OpenAPI JSON for all routes that are exposed via the
 * `expose.http` property
 * @param {HttpServerService}  - `this.config.openApi?.path`: The path where the OpenAPI JSON will be
 * available. Defaults to `/api`
 * @returns A route definition for the openApi.json file
 */
export const getOpenApiJson = function (this: HttpServerClass<HttpServerServiceV1ConfigRaw>): RouteOptions {
	const paths: Record<string, Record<string, unknown>> = this.config.openApi?.paths ?? {}

	const p = (this.config.openApi?.path ? this.config.openApi.path : this.config.apiMountPath) as string
	const url = posix.join(p, '/openapi.json')

	const info = { ...OPENAPI_DEFAULT_INFO, ...this.config.openApi?.info }
	const servers = this.config.openApi?.servers ?? [
		{ url: `${this.config.fastify?.https ? 'https' : 'http'}://${this.config.domain}:${this.config.port}` },
	]
	const components = this.config.openApi?.components
	const security = this.config.openApi?.security
	const externalDocs = this.config.openApi?.externalDocs
	const tags = this.config.openApi?.tags
	const isHealthzEnabled = this.config.enableHealthz

	const logger = this.logger.getChildLogger({
		serviceName: this.info.serviceName,
		serviceVersion: this.info.serviceVersion,
		serviceTarget: 'openApiJson',
	})

	const handler: RouteHandlerMethod = (_request, reply) => {
		const json: OpenAPIObject = {
			openapi: '3.0.3',
			info,
			servers,
			paths,
			components,
			security,
			tags,
			externalDocs,
		}

		let securitySchema: unknown[] = []

		if (components?.securitySchemes) {
			securitySchema = Object.keys(components.securitySchemes).map(name => ({ [name]: [] }))
		}

		const getErrorName = (code: StatusCode) =>
			StatusCode[code]
				.replace(/[A-Z]/g, letter => ` ${letter}`)
				.replace(/^./, str => {
					return str.toUpperCase()
				})
				.trim()
				.replace(/^O K$/g, 'OK')

		const getErrorResponseSchema = (code: StatusCode, message: string, schema?: SchemaObject) => {
			return {
				type: 'object',

				properties: {
					status: {
						type: 'number',
						min: 100,
						title: 'the error status code',
						example: code,
					},
					message: {
						type: 'string',
						title: 'the error message',
						example: message,
					},
					data: schema,
					traceparent: {
						type: 'string',
						title: 'w3c compliant unique traceparent for this request',
						example: 'd5dbb17eec16e3c9fce9cf8adc766999',
						externalDocs: 'https://www.w3.org/TR/trace-context/#traceparent-header-field-values',
					},
				},
				required: ['status', 'message'],
			}
		}

		const findPathParamsRegex = /:[^:/]+/gm
		for (const entry of this.routeDefinitions) {
			const expose = entry.expose
			const definition = expose.http

			let m: RegExpExecArray | null

			const routeParams: string[] = []
			while (true) {
				m = findPathParamsRegex.exec(definition.path)
				if (m === null) {
					break
				}
				if (m.index === findPathParamsRegex.lastIndex) {
					findPathParamsRegex.lastIndex++
				}
				routeParams.push(...m.map(name => name))
			}

			const pathParams: ParameterObject[] = routeParams.map((pathParamName): ParameterObject => {
				const name = pathParamName.replace('?', '').replace(':', '')
				const required = !pathParamName.endsWith('?')

				const schema = expose.parameter?.properties?.[name]

				if (!schema) {
					logger.warn(
						`${definition.method} ${definition.path}: Path parameter ${name} is not in parameter schema and will not be available in service function`,
					)
				}

				if (!!schema && isReferenceObject(schema)) {
					return {
						in: 'path',
						name,
						required,
						...schema,
					}
				}

				return {
					in: 'path',
					name,
					required,
					schema,
					description: schema?.description ?? schema?.title,
				}
			})

			const queryParams =
				definition.openApi?.query?.map((queryParam): ParameterObject => {
					const name = queryParam.name
					const schema = expose.parameter?.properties?.[name]
					const required = queryParam.required

					if (!schema) {
						logger.warn(
							`${definition.method} ${definition.path}: Query parameter ${name} is not in parameter schema and will not be available in service function`,
						)
					}

					if (!!schema && isReferenceObject(schema)) {
						return {
							in: 'query',
							name,
							required,
							...schema,
						}
					}

					return {
						in: 'query',
						name,
						required,
						schema,
						description: schema?.description ?? schema?.title,
					}
				}) ?? []

			let path = definition.path
			for (const pathParamName of routeParams) {
				const name = pathParamName.replace('?', '').replace(':', '')
				path = path.replace(pathParamName, `{${name}}`)
			}

			let requestBody: RequestBodyObject | undefined

			if (['POST', 'PATCH', 'PUT'].includes(definition.method)) {
				requestBody = {
					content: {
						[expose.contentTypeRequest ?? 'application/json']: {
							schema: expose.inputPayload,
						},
					},
				}
			}

			const inputValidationFailed: SchemaObject = {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						validation: {
							type: 'string',
							example: 'invalid_string',
						},
						code: {
							type: 'string',
							example: 'invalid_string',
						},
						message: {
							type: 'string',
							example: 'String must contain at least 3 character(s)',
						},
						expected: {
							type: 'string',
							example: 'string',
						},
						received: {
							type: 'string',
							example: 'object',
						},
						keys: {
							type: 'array',
							items: {
								type: 'string',
							},
						},
						minimum: {
							type: 'number',
							example: 3,
						},
						maximum: {
							type: 'number',
							example: 32,
						},
						path: {
							type: 'array',
							items: {
								type: 'string',
								example: 'username',
							},
						},
					},
					required: ['message', 'code'],
				},
			}

			const errorResponses: Record<number, unknown> = {}

			if (expose.inputPayload) {
				errorResponses[400] = {
					description: getErrorName(400),
					content: {
						'application/json': {
							schema: getErrorResponseSchema(400, 'input validation failed', inputValidationFailed),
						},
					},
				}
			}

			if (expose.parameter && pathParams.length > 0) {
				errorResponses[404] = {
					description: getErrorName(404),
					content: {
						'application/json': {
							schema: getErrorResponseSchema(404, 'ressource for given id does not exist'),
						},
					},
				}
			}

			if (securitySchema.length > 0 && definition.openApi?.isSecure) {
				errorResponses[401] = {
					description: getErrorName(401),
					content: {
						'application/json': {
							schema: getErrorResponseSchema(401, 'authentication required'),
						},
					},
				}
			}

			definition.openApi?.additionalStatusCodes
				?.filter(code => !Object.keys(errorResponses).includes(code.toString()))
				.forEach(code => {
					errorResponses[code] = {
						description: getErrorName(code),
						content: {
							'application/json': {
								schema: getErrorResponseSchema(code, getErrorName(code)),
							},
						},
					}
				})

			const traceIdParameter: ParameterObject = {
				in: 'header',
				required: false,
				name: this.config.traceHeaderField ?? 'x-trace-id',
				schema: { type: 'string' },
				example: '022bcd32-0a7c-4635-90ce-7940d0b9793f',
				description: 'TraceID which can be used by business logic',
			}

			const traceParent: ParameterObject = {
				in: 'header',
				required: false,
				name: 'traceparent',
				schema: { type: 'string' },
				description: 'see: https://www.w3.org/TR/trace-context/#traceparent-header-field-values',
			}

			paths[path] = {
				...paths[path],
				[definition.method.toLowerCase()]: {
					deprecated: expose.deprecated,
					security: securitySchema.length > 0 && definition.openApi?.isSecure ? securitySchema : [],
					description: definition.openApi?.description,
					summary: definition.openApi?.summary,
					parameters: [...pathParams, ...queryParams, traceIdParameter, traceParent],
					tags: definition.openApi?.tags,
					operationId: definition.openApi?.operationId,
					requestBody,
					responses: {
						[expose.outputPayload ? 200 : 204]: {
							description: definition.openApi?.description,
							content: {
								[expose.contentTypeResponse ?? 'application/json']: {
									schema: expose.outputPayload,
								},
							},
						},
						...errorResponses,
					},
				},
			}
		}

		if (isHealthzEnabled) {
			if (!json.paths) {
				json.paths = {}
			}
			json.paths['/healthz'] = {
				get: {
					description: 'indicates if the http server service is healthy',
					responses: {
						200: {
							description: 'http server service is up and running and successfully connected to event bridge',
							content: {
								'application/json': {
									schema: getErrorResponseSchema(200, getErrorName(200)),
								},
							},
						},
						500: {
							description: 'http server service is not up and running or not successfully connected to event bridge',
							content: {
								'application/json': {
									schema: getErrorResponseSchema(500, getErrorName(500)),
								},
							},
						},
					},
				},
			}
		}

		reply.header('content-type', 'application/json; charset=utf-8')
		return json
	}

	return {
		method: 'GET',
		url,
		handler,
	}
}
