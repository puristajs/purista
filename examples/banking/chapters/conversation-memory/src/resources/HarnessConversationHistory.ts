import type { HarnessStorage } from '@purista/harness'
import type { SupportConversationHistory } from '../service/support/v1/SupportConversationHistory.js'

export class HarnessConversationHistory implements SupportConversationHistory {
	public constructor(private readonly storage: HarnessStorage) {}

	public async list(sessionId: string) {
		return (await this.storage.listMessages(sessionId)).map(({ role, content, timestamp }) => ({
			role,
			content,
			timestamp,
		}))
	}

	public async clear(sessionId: string) {
		await this.storage.clearMessages(sessionId)
	}
}
