import { describe, test } from 'vitest'
import { monitoringV1Service as service } from './monitoringV1Service.js'

describe('service monitoring version 1', () => {
	test('has valid configuration', () => {
		service.testServiceSetup()
	}
	)
}
)