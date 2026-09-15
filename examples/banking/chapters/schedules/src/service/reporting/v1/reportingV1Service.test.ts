import { describe, test } from 'vitest'
import { reportingV1Service as service } from './reportingV1Service.js'

describe('service reporting version 1', () => {
	test('has valid configuration', () => {
		service.testServiceSetup()
	}
	)
}
)