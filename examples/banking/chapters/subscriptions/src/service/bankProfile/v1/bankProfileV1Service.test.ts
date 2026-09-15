import { describe, test } from 'vitest'
import { bankProfileV1Service as service } from './bankProfileV1Service.js'

describe('service bank-profile version 1', () => {
	test('has valid configuration', () => {
		service.testServiceSetup()
	}
	)
}
)