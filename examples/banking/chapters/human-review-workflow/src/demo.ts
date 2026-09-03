import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { DefaultEventBridge, getCommandMessageMock, initLogger } from '@purista/core'
import { createReviewApplication } from './createReviewApplication.js'

async function main() {
	const dataDirectory = await mkdtemp(join(tmpdir(), 'purista-human-review-'))
	const logger = initLogger('fatal')
	const eventBridge = new DefaultEventBridge({ logger })
	await eventBridge.start()
	const effects: string[] = []
	const application = await createReviewApplication(
		eventBridge,
		logger,
		{
			canRequest: async ({ tenantId, principalId, cardId }) =>
				tenantId === 'tenant-example' && principalId === 'principal-alex' && cardId === 'card-1',
			canReview: async ({ tenantId, principalId, requestId }) =>
				tenantId === 'tenant-example' && principalId === 'principal-reviewer' && requestId === 'review-1',
		},
		{
			canFreeze: async ({ tenantId, principalId, cardId, approvalId }) =>
				tenantId === 'tenant-example' &&
				principalId === 'principal-reviewer' &&
				cardId === 'card-1' &&
				approvalId.startsWith('support-review-run:'),
		},
		{
			freeze: async ({ cardId, idempotencyKey }) => {
				effects.push(idempotencyKey)
				return { status: 'frozen', cardId }
			},
		},
		dataDirectory,
	)

	try {
		const waiting = await eventBridge.invoke(
			getCommandMessageMock({
				tenantId: 'tenant-example',
				principalId: 'principal-alex',
				receiver: { serviceName: 'Support', serviceVersion: '1', serviceTarget: 'requestCardFreeze' },
				payload: {
					payload: { requestId: 'review-1', cardId: 'card-1', reason: 'Card is missing' },
					parameter: {},
				},
			}),
		)
		const decided = await eventBridge.invoke(
			getCommandMessageMock({
				tenantId: 'tenant-example',
				principalId: 'principal-reviewer',
				receiver: { serviceName: 'Support', serviceVersion: '1', serviceTarget: 'decideCardFreeze' },
				payload: {
					payload: {
						requestId: 'review-1',
						expectedRevision: 1,
						eventId: 'decision-1',
						outcome: 'approved',
					},
					parameter: {},
				},
			}),
		)
		process.stdout.write(`${JSON.stringify({ waiting, decided, effectCount: effects.length }, null, 2)}\n`)
	} finally {
		await application.destroy()
		await eventBridge.destroy()
		await rm(dataDirectory, { recursive: true, force: true })
	}
}

main().catch((error: unknown) => {
	process.stderr.write(`${error instanceof Error ? error.message : 'The human review demo failed.'}\n`)
	process.exit(1)
})
