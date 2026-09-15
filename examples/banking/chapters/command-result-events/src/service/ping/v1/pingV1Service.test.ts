import { describe, test } from 'vitest'
import { pingV1Service as service } from './pingV1Service.js'

describe('service ping version 1', () => {
	test('has valid configuration', () => {
		service.testServiceSetup()
	}
	)
}
)