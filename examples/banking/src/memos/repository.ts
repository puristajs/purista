import type { DecisionMemo } from './contracts.js'

/** Local, in-memory memo artifacts for this runnable tutorial checkpoint. */
export class DecisionMemoStore {
	private nextMemoNumber = 1
	private readonly byRequestKey = new Map<string, DecisionMemo>()

	get(requestKey: string) {
		return this.byRequestKey.get(requestKey)
	}

	save(memo: Omit<DecisionMemo, 'memoId'>) {
		const existing = this.byRequestKey.get(memo.requestKey)
		if (existing) return existing
		const created = { ...memo, memoId: `memo-${this.nextMemoNumber++}` } as DecisionMemo
		this.byRequestKey.set(created.requestKey, created)
		return created
	}
}
