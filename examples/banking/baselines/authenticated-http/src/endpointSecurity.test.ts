import { isHttpExposedServiceMeta } from '@purista/core'
import { describe, expect, test } from 'vitest'
import { getProfileCommandBuilder } from './service/bankProfile/v1/command/getProfile/getProfileCommandBuilder.js'
import { getTransactionCommandBuilder } from './service/transaction/v1/command/getTransaction/getTransactionCommandBuilder.js'
import { recordTransactionCommandBuilder } from './service/transaction/v1/command/recordTransaction/recordTransactionCommandBuilder.js'

describe('generated endpoint security metadata', () => {
	test('keeps the profile public and transaction commands protected', async () => {
		const profile = await getProfileCommandBuilder.getDefinition()
		const getTransaction = await getTransactionCommandBuilder.getDefinition()
		const recordTransaction = await recordTransactionCommandBuilder.getDefinition()

		if (
			!isHttpExposedServiceMeta(profile.metadata)
			|| !isHttpExposedServiceMeta(getTransaction.metadata)
			|| !isHttpExposedServiceMeta(recordTransaction.metadata)
		) {
			throw new Error('Expected generated HTTP endpoint metadata')
		}

		expect(profile.metadata.expose.http.openApi?.isSecure).toBe(false)
		expect(getTransaction.metadata.expose.http.openApi?.isSecure).toBe(true)
		expect(recordTransaction.metadata.expose.http.openApi?.isSecure).toBe(true)
	})
})
