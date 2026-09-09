import { defineHarness, type JsonValue, type ObjectRequest, type ObjectResponse } from '@purista/harness'
import { FakeModelProvider } from '@purista/harness/testing'
import { describe, expect, it } from 'vitest'
import { analyzeSupportCaseWorkflow } from './analyzeSupportCaseWorkflow.js'

const usage = { inputTokens: 8, outputTokens: 5, totalTokens: 13 }

class CoordinatedFakeModelProvider extends FakeModelProvider {
	public constructor(
		private readonly beforeObject: () => Promise<void>,
		private readonly afterObject: () => void,
	) {
		super({ strict: true })
	}

	public override async object<T extends JsonValue = JsonValue>(request: ObjectRequest<T>): Promise<ObjectResponse<T>> {
		await this.beforeObject()
		const response = await super.object(request)
		this.afterObject()
		return response
	}
}

describe('analyzeSupportCaseWorkflow', () => {
	it('runs both specialists within the declared budget and merges their results', async () => {
		let starts = 0
		let releaseBoth: () => void = () => {}
		let releaseRisk: () => void = () => {}
		const bothStarted = new Promise<void>((resolve) => {
			releaseBoth = resolve
		})
		const riskMayFinish = new Promise<void>((resolve) => {
			releaseRisk = resolve
		})
		const reachBarrier = async () => {
			starts += 1
			if (starts === 2) releaseBoth()
			await Promise.race([
				bothStarted,
				new Promise<void>((_resolve, reject) => {
					setTimeout(() => reject(new Error('Specialists did not start concurrently.')), 500)
				}),
			])
		}
		const completionOrder: string[] = []
		const riskProvider = new CoordinatedFakeModelProvider(
			async () => {
				await reachBarrier()
				await riskMayFinish
			},
			() => completionOrder.push('risk'),
		)
		const responseProvider = new CoordinatedFakeModelProvider(reachBarrier, () => {
			completionOrder.push('response')
			releaseRisk()
		})
		riskProvider.enqueueObject({
			object: { level: 'high', evidence: ['The customer reports a missing card.'] },
			usage,
			finishReason: 'stop',
		})
		responseProvider.enqueueObject({
			object: { customerReply: 'We can help secure the card.', nextAction: 'freeze_card' },
			usage,
			finishReason: 'stop',
		})
		const runtime = await defineHarness({ name: 'parallelWorkflowTest' })
			.addWorkflow(analyzeSupportCaseWorkflow)
			.getInstance({
				models: {
					riskModel: { provider: riskProvider, model: 'risk-fake' },
					responseModel: { provider: responseProvider, model: 'response-fake' },
				},
			})
		const session = await runtime.getSession('parallel-case-1')

		try {
			const outcome = await session.workflows.analyzeSupportCase.run({
				caseId: 'case-1',
				message: 'My card is missing.',
			})
			expect(outcome.status).toBe('completed')
			if (outcome.status !== 'completed') throw new Error('Expected a completed parallel workflow.')
			expect(outcome.output).toEqual({
				caseId: 'case-1',
				risk: { level: 'high', evidence: ['The customer reports a missing card.'] },
				response: { customerReply: 'We can help secure the card.', nextAction: 'freeze_card' },
			})
			expect(starts).toBe(2)
			expect(completionOrder).toEqual(['response', 'risk'])
			expect(riskProvider.requests).toHaveLength(1)
			expect(responseProvider.requests).toHaveLength(1)
			riskProvider.assertExhausted()
			responseProvider.assertExhausted()
		} finally {
			await session.release()
			await runtime.close()
		}
	})
})
