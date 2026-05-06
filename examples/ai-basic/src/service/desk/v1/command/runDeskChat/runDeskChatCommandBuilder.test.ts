import { DefaultEventBridge, DefaultQueueBridge, initLogger } from '@purista/core'
import { describe, expect, it } from 'vitest'
import { deterministicModelProvider } from '../../../../../test/deterministicModelProvider.js'
import { resetExampleConversationStore } from '../../exampleConversationStore.js'
import { deskV1Service } from '../../index.js'

const waitForRegistration = async () => {
	await new Promise(resolve => setTimeout(resolve, 25))
}

describe('runDeskChatCommandBuilder', () => {
	it('registers service with the runDeskChat command', async () => {
		const logger = initLogger('error')
		const eventBridge = new DefaultEventBridge({ logger })
		await eventBridge.start()
		const queueBridge = new DefaultQueueBridge()
		const conversationStore = resetExampleConversationStore()

		const deskService = await deskV1Service.getInstance(eventBridge, {
			logger,
			queueBridge,
			ai: {
				conversationStore,
				model: {
					'openai:gpt-4o-mini': deterministicModelProvider,
				},
			},
		})

		await deskService.start()
		await waitForRegistration()

		try {
			expect(deskService).toBeDefined()
		} finally {
			await deskService.destroy()
			await queueBridge.destroy()
			await eventBridge.destroy()
		}
	})
})
