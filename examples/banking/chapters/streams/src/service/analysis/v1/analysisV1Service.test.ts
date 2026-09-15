import { describe, test } from 'vitest'
import { analysisV1Service as service } from './analysisV1Service.js'

describe('service analysis version 1', () => {
	test('has valid configuration', () => {
		service.testServiceSetup()
	}
	)
}
)