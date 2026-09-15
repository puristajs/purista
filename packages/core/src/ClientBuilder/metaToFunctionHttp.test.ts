import type { HttpExposedServiceMeta } from '../core/HttpServer/types/HttpExposedServiceMeta.js'
import { metaToFunctionHttp } from './metaToFunctionHttp.impl.js'

const metadata = (overrides: Partial<HttpExposedServiceMeta['expose']['http']> = {}): HttpExposedServiceMeta =>
	({
		expose: {
			contentTypeRequest: 'application/json',
			contentEncodingRequest: 'utf-8',
			contentTypeResponse: 'application/json',
			contentEncodingResponse: 'utf-8',
			inputPayload: { type: 'object', properties: { value: { type: 'string' } }, required: ['value'] },
			outputPayload: { type: 'object', properties: { accepted: { type: 'boolean' } }, required: ['accepted'] },
			http: {
				method: 'POST',
				path: 'jobs',
				mode: 'sync',
				openApi: { isSecure: true, description: '', summary: '' },
				...overrides,
			},
		},
	}) as HttpExposedServiceMeta

describe('metaToFunctionHttp', () => {
	it('uses queue acceptance metadata as the return type for async endpoints', () => {
		const generated = metaToFunctionHttp('Jobs', '1', 'startJob', metadata({ mode: 'async' }))

		expect(generated.typeString).toContain('jobId: string')
		expect(generated.typeString).toContain('queueName: string')
		expect(generated.typeString).toContain('scheduledAt?: number')
		expect(generated.typeString).not.toContain('accepted: boolean')
	})

	it('does not generate a request body for a DELETE endpoint', () => {
		const withoutPayload = metadata({ method: 'DELETE' })
		withoutPayload.expose.inputPayload = undefined

		const generated = metaToFunctionHttp('Jobs', '1', 'deleteJob', withoutPayload)

		expect(generated.functionString).toContain("__execute__('delete'")
		expect(generated.functionString).toContain('options, undefined')
		expect(generated.functionString).not.toContain('async (payload:')
	})

	it('rejects a DELETE endpoint whose payload cannot be sent by Hono', () => {
		expect(() => metaToFunctionHttp('Jobs', '1', 'deleteJob', metadata({ method: 'DELETE' }))).toThrow(
			'Move input to path or query parameters',
		)
	})
})
