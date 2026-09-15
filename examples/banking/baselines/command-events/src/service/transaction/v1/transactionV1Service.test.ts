import { describe, test } from 'vitest'
import { transactionV1Service as service } from './transactionV1Service.js'

describe('service transaction version 1', () => {
	test('has valid configuration', () => {
		service.testServiceSetup()
	}
	)
}
)