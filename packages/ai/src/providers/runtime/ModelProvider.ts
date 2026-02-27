/**
 * Payload sent to a model provider.
 */
export type ProviderRequest = {
	prompt: string
	context?: string
	metadata?: Record<string, unknown>
}

/**
 * Response emitted by a model provider.
 */
export type ProviderResponse = {
	output: string
	tokens?: {
		prompt: number
		completion: number
	}
	costUsd?: number
	metadata?: Record<string, unknown>
}

/**
 * Minimal interface providers must satisfy so they can be swapped at runtime.
 */
export interface ModelProvider {
	readonly name: string
	generate(request: ProviderRequest): Promise<ProviderResponse>
}

/**
 * Deterministic provider useful for tests and docs; just echoes the prompt back.
 */
export class EchoProvider implements ModelProvider {
	readonly name = 'echo'

	async generate(request: ProviderRequest): Promise<ProviderResponse> {
		return {
			output: request.prompt,
			tokens: {
				prompt: request.prompt.length,
				completion: request.prompt.length,
			},
			costUsd: 0,
		}
	}
}
