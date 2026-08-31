import { createCommandContextMock } from '@purista/core'
import { describe, expect, it } from 'vitest'

import { PolicyWikiStore } from './repository.js'
import {
	decidePolicyWikiEdit,
	ingestPolicySourceChange,
	proposePolicyWikiEdit,
	publishPolicyWikiEdit,
} from './service.js'

const contextFor = <T>(definition: T, store: PolicyWikiStore, actor: 'dana' | 'erin') => {
	const mock = createCommandContextMock(
		definition as any,
		{
			payload: undefined,
			parameter: {},
			resources: { policyWikiStore: store },
		} as any,
	)
	return { ...mock.context, message: { ...mock.context.message, principalId: actor, tenantId: 'tenant-north' } }
}

describe('policy wiki PURISTA commands', () => {
	it('keeps proposal, review, publication, and indexing as separate authorized actions', async () => {
		const store = new PolicyWikiStore()
		const sourceContext = contextFor(ingestPolicySourceChange, store, 'dana')
		const source = await ingestPolicySourceChange
			.getCommandFunction()
			.call({} as never, sourceContext as never, undefined, {})
		const proposalContext = contextFor(proposePolicyWikiEdit, store, 'dana')
		const proposal = await proposePolicyWikiEdit
			.getCommandFunction()
			.call({} as never, proposalContext as never, undefined, {})
		const reviewerContext = contextFor(decidePolicyWikiEdit, store, 'erin')
		await decidePolicyWikiEdit
			.getCommandFunction()
			.call({} as never, reviewerContext as never, { decision: 'approved' }, {})
		const publishContext = contextFor(publishPolicyWikiEdit, store, 'dana')

		await expect(
			publishPolicyWikiEdit
				.getCommandFunction()
				.call(
					{} as never,
					publishContext as never,
					{ expectedSourceRevision: source.sourceRevision, expectedTargetRevision: proposal.targetRevision },
					{},
				),
		).resolves.toMatchObject({ status: 'published' })
	})

	it('denies publication by the reviewer even after that reviewer approved the proposal', async () => {
		const store = new PolicyWikiStore()
		const guard = publishPolicyWikiEdit.getBeforeGuardHook('curator')
		const context = contextFor(publishPolicyWikiEdit, store, 'erin')

		await expect(
			guard.call({} as never, context as never, { expectedSourceRevision: 1, expectedTargetRevision: 1 }, {}),
		).rejects.toMatchObject({ errorCode: 403 })
	})
})
