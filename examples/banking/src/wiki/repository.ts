import { HandledError, StatusCode } from '@purista/core'

export type WikiProposal = {
	proposalId: string
	pageId: 'fee-notices'
	sourceRevision: number
	targetRevision: number
	proposedText: string
	status: 'proposed' | 'approved' | 'rejected' | 'published'
	indexedRevision: number | null
}

/**
 * A small revisioned wiki projection. Source changes propose an edit; only the
 * application can publish the exact reviewed source and target revision.
 */
export class PolicyWikiStore {
	private sourceRevision = 2
	private page = { revision: 1, text: 'Fee notices are reviewed before publication.' }
	private proposal: WikiProposal | undefined

	getPage() {
		return { pageId: 'fee-notices' as const, ...this.page }
	}

	getSourceRevision() {
		return this.sourceRevision
	}

	ingestSourceChange() {
		this.sourceRevision += 1
		return this.sourceRevision
	}

	propose() {
		this.proposal = {
			proposalId: `wiki-fee-notices-source-${this.sourceRevision}`,
			pageId: 'fee-notices',
			sourceRevision: this.sourceRevision,
			targetRevision: this.page.revision,
			proposedText: 'Fee notices require a reviewed policy revision before publication.',
			status: 'proposed',
			indexedRevision: null,
		}
		return this.proposal
	}

	getProposal() {
		return this.proposal
	}

	decide(decision: 'approved' | 'rejected') {
		const proposal = this.requireProposal()
		if (proposal.status !== 'proposed')
			throw new HandledError(StatusCode.Conflict, 'This wiki proposal already has a decision')
		proposal.status = decision
		return proposal
	}

	publish(expectedSourceRevision: number, expectedTargetRevision: number) {
		const proposal = this.requireProposal()
		if (proposal.status !== 'approved')
			throw new HandledError(StatusCode.Conflict, 'Only an approved wiki proposal may publish')
		if (expectedSourceRevision !== this.sourceRevision || expectedTargetRevision !== this.page.revision) {
			throw new HandledError(StatusCode.Conflict, 'The source or wiki page changed; review the current revisions again')
		}
		this.page = { revision: this.page.revision + 1, text: proposal.proposedText }
		proposal.status = 'published'
		return proposal
	}

	markIndexed(revision: number) {
		const proposal = this.requireProposal()
		if (proposal.status !== 'published' || revision !== this.page.revision) {
			throw new HandledError(StatusCode.Conflict, 'Only the published current revision may be indexed')
		}
		proposal.indexedRevision = revision
		return proposal
	}

	private requireProposal() {
		if (!this.proposal) throw new HandledError(StatusCode.NotFound, 'No wiki proposal exists')
		return this.proposal
	}
}
