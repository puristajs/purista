import { describe, test } from 'vitest'
import { knowledgeV1Service as service } from './knowledgeV1Service.js'

describe('service knowledge version 1', () => {
	test('has valid configuration', () => {
		service.testServiceSetup()
	}
	)
}
)