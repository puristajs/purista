import { DefaultEventBridge, getCommandMessageMock, initLogger } from '@purista/core'
import { inMemoryHarnessStorage } from '@purista/harness'
import { FakeModelProvider, objectReply } from '@purista/harness/testing'
import { createSupportService } from './createSupportService.js'

const provider = new FakeModelProvider({ strict: true })
const usage = { inputTokens: 8, outputTokens: 6, totalTokens: 14 }
provider.enqueueObject(
	objectReply({ answer: 'A transfer can remain pending for two business days.' }, { usage, finishReason: 'stop' }),
)
provider.enqueueObject(
	objectReply(
		{ answer: 'Yes. The same transfer is still inside that two-day window.' },
		{ usage, finishReason: 'stop' },
	),
)

const eventBridge = new DefaultEventBridge({ logger: initLogger('error') })
await eventBridge.start()
const storage = inMemoryHarnessStorage()
const support = await createSupportService(eventBridge, initLogger('error'), {
	policy: { canAccess: async () => true },
	answeringModel: { provider, model: 'fake-support' },
	storage,
})
await support.start()

const identity = { tenantId: 'tenant-example', principalId: 'principal-alex' }
const invoke = (serviceTarget: string, payload: unknown) =>
	eventBridge.invoke(
		getCommandMessageMock({
			...identity,
			receiver: { serviceName: 'Support', serviceVersion: '1', serviceTarget },
			payload: { payload, parameter: {} },
		}),
	)

try {
	const first = await invoke('continueSupportConversation', {
		conversationId: 'case-demo',
		question: 'How long can a transfer remain pending?',
	})
	const second = await invoke('continueSupportConversation', {
		conversationId: 'case-demo',
		question: 'Is the same transfer still inside that window?',
	})
	const history = await invoke('getConversationHistory', { conversationId: 'case-demo' })

	process.stdout.write(`${JSON.stringify({ first, second, history }, null, 2)}\n`)
	provider.assertExhausted()
} finally {
	await support.destroy()
	await eventBridge.destroy()
	await storage.close()
}
