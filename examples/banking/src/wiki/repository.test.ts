import { describe, expect, it } from 'vitest'

import { PolicyWikiStore } from './repository.js'

describe('policy wiki revision boundary', () => {
	it('publishes only the exact approved source and target revisions, then indexes separately', () => {
		const store = new PolicyWikiStore()
		const sourceRevision = store.ingestSourceChange()
		const proposal = store.propose()
		store.decide('approved')

		expect(store.publish(sourceRevision, proposal.targetRevision)).toMatchObject({
			status: 'published',
			indexedRevision: null,
		})
		expect(store.markIndexed(store.getPage().revision)).toMatchObject({ indexedRevision: store.getPage().revision })
	})

	it('rejects a stale source revision after review instead of overwriting the wiki', () => {
		const store = new PolicyWikiStore()
		const sourceRevision = store.ingestSourceChange()
		const proposal = store.propose()
		store.decide('approved')
		store.ingestSourceChange()

		expect(() => store.publish(sourceRevision, proposal.targetRevision)).toThrow('source or wiki page changed')
		expect(store.getPage()).toMatchObject({ revision: 1, text: 'Fee notices are reviewed before publication.' })
	})
})
