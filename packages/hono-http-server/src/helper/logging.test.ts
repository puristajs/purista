import type { SpanContext } from '@opentelemetry/api'
import { describe, expect, it } from 'vitest'

import { createHttpLogFields } from './logging.js'

describe('createHttpLogFields', () => {
	it('uses PURISTA core OpenTelemetry log field names and keeps the transport trace id separate', () => {
		const spanContext: SpanContext = {
			traceId: '0af7651916cd43dd8448eb211c80319c',
			spanId: 'b7ad6b7169203331',
			traceFlags: 1,
			isRemote: false,
		}

		expect(createHttpLogFields({ path: '/missing' }, spanContext, 'transport-trace-1')).toEqual({
			path: '/missing',
			traceId: '0af7651916cd43dd8448eb211c80319c',
			spanId: 'b7ad6b7169203331',
			traceFlags: 1,
			customTraceId: 'transport-trace-1',
		})
	})
})
