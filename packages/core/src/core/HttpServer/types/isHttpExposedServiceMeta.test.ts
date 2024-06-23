import type { HttpExposedServiceMeta } from './HttpExposedServiceMeta.js'
import { isHttpExposedServiceMeta } from './isHttpExposedServiceMeta.impl.js'

describe('isHttpExposedServiceMeta', () => {
	it('returns true if given input is type of HttpExposedServiceMeta', () => {
		const meta: HttpExposedServiceMeta = {
			expose: {
				http: {
					method: 'GET',
					path: '/test',
				},
			},
		}

		const result = isHttpExposedServiceMeta(meta)
		expect(result).toBeTruthy()
	})

	it('returns false if given input is type of string', () => {
		const result = isHttpExposedServiceMeta('some string')
		expect(result).toBeFalsy()
	})

	it('returns false if given input is type of object', () => {
		const result = isHttpExposedServiceMeta({ some: { object: 'thing' } })
		expect(result).toBeFalsy()
	})

	it('returns false if given input is type of array', () => {
		const result = isHttpExposedServiceMeta(['a', 'b'])
		expect(result).toBeFalsy()
	})

	it('returns false if given input is type of number', () => {
		const result = isHttpExposedServiceMeta(1)
		expect(result).toBeFalsy()
	})

	it('returns false if given input is type of null', () => {
		const result = isHttpExposedServiceMeta(null)
		expect(result).toBeFalsy()
	})

	it('returns false if given input is type of undefined', () => {
		const result = isHttpExposedServiceMeta(undefined)
		expect(result).toBeFalsy()
	})
})
