import type {
	ModelProvider,
	ProviderGenerateTextRequest,
	ProviderJsonRequest,
	ProviderJsonResponse,
	ProviderRequest,
	ProviderResponse,
	ProviderStream,
} from '../providers/runtime/ModelProvider.js'

export type ScriptedTextReply = string | ((request: ProviderRequest) => string | Promise<string>)
export type ScriptedJsonReply = unknown | ((request: ProviderJsonRequest) => unknown | Promise<unknown>)
export type ScriptedErrorReply = Error | ((request: ProviderRequest | ProviderJsonRequest) => Error | Promise<Error>)
export type ScriptedChunksReply = string[] | ((request: ProviderRequest) => string[] | Promise<string[]>)
export type ScriptedReasoningReply = string[] | ((request: ProviderRequest) => string[] | Promise<string[]>)

type TextStep = {
	kind: 'text'
	reply: ScriptedTextReply
	chunks?: ScriptedChunksReply
	reasoning?: ScriptedReasoningReply
}

type JsonStep = {
	kind: 'json'
	reply: ScriptedJsonReply
}

type ErrorStep = {
	kind: 'error'
	error: ScriptedErrorReply
}

type ScriptedStep = TextStep | JsonStep | ErrorStep

export class ScriptedModel implements ModelProvider {
	readonly name = 'scripted-model'
	readonly capabilities = {
		text: true,
		stream: true,
		json: true,
	}
	readonly calls: Array<
		| { method: 'generate' | 'stream' | 'generateText'; request: ProviderRequest }
		| { method: 'generateJson'; request: ProviderJsonRequest }
	> = []

	private readonly steps: ScriptedStep[] = []
	private cursor = 0

	nextText(reply: ScriptedTextReply, options?: { chunks?: ScriptedChunksReply; reasoning?: ScriptedReasoningReply }) {
		this.steps.push({ kind: 'text', reply, chunks: options?.chunks, reasoning: options?.reasoning })
		return this
	}

	nextStream(chunks: ScriptedChunksReply, options?: { final?: ScriptedTextReply; reasoning?: ScriptedReasoningReply }) {
		this.steps.push({
			kind: 'text',
			reply: options?.final ?? (async request => (await resolveChunks(chunks, request)).join('')),
			chunks,
			reasoning: options?.reasoning,
		})
		return this
	}

	nextJson(reply: ScriptedJsonReply) {
		this.steps.push({ kind: 'json', reply })
		return this
	}

	nextError(error: ScriptedErrorReply) {
		this.steps.push({ kind: 'error', error })
		return this
	}

	reset() {
		this.cursor = 0
		this.calls.splice(0)
		return this
	}

	private shiftStep(expected: ScriptedStep['kind']) {
		const step = this.steps[this.cursor]
		if (!step) {
			throw new Error(`ScriptedModel: no ${expected} step configured for call ${this.cursor + 1}`)
		}
		this.cursor += 1
		return step
	}

	private async resolveTextStep(request: ProviderRequest): Promise<TextStep> {
		const step = this.shiftStep('text')
		if (step.kind === 'error') {
			throw await resolveError(step.error, request)
		}
		if (step.kind !== 'text') {
			throw new Error(`ScriptedModel: expected text step but found ${step.kind}`)
		}
		return step
	}

	private async resolveJsonStep(request: ProviderJsonRequest): Promise<JsonStep> {
		const step = this.shiftStep('json')
		if (step.kind === 'error') {
			throw await resolveError(step.error, request)
		}
		if (step.kind !== 'json') {
			throw new Error(`ScriptedModel: expected json step but found ${step.kind}`)
		}
		return step
	}

	async generate(request: ProviderRequest): Promise<ProviderResponse> {
		this.calls.push({ method: 'generate', request })
		const step = await this.resolveTextStep(request)
		const output = await resolveText(step.reply, request)
		return toProviderResponse(output)
	}

	stream(request: ProviderRequest): ProviderStream {
		this.calls.push({ method: 'stream', request })
		let resolved:
			| {
					output: string
					chunks: string[]
					reasoning: string[]
			  }
			| undefined

		const resolveStep = async () => {
			if (resolved) {
				return resolved
			}
			const step = await this.resolveTextStep(request)
			const output = await resolveText(step.reply, request)
			resolved = {
				output,
				chunks: step.chunks ? await resolveChunks(step.chunks, request) : output.length > 0 ? [output] : [],
				reasoning: step.reasoning ? await resolveReasoning(step.reasoning, request) : [],
			}
			return resolved
		}

		return {
			async final() {
				const { output } = await resolveStep()
				return toProviderResponse(output)
			},
			async *[Symbol.asyncIterator]() {
				const { chunks, reasoning } = await resolveStep()
				for (const item of reasoning) {
					yield {
						type: 'reasoning-delta' as const,
						reasoningDelta: item,
					}
				}
				for (const chunk of chunks) {
					yield {
						type: 'text-delta' as const,
						textDelta: chunk,
					}
				}
			},
		}
	}

	async generateText(request: ProviderGenerateTextRequest): Promise<string> {
		this.calls.push({ method: 'generateText', request })
		const step = await this.resolveTextStep(request)
		const reasoning = step.reasoning ? await resolveReasoning(step.reasoning, request) : []
		for (const item of reasoning) {
			await request.onReasoning?.(item)
		}
		const output = await resolveText(step.reply, request)
		const chunks = step.chunks ? await resolveChunks(step.chunks, request) : output.length > 0 ? [output] : []
		for (const chunk of chunks) {
			await request.onTextDelta?.(chunk)
		}
		return output
	}

	async generateJson<T = unknown>(request: ProviderJsonRequest): Promise<ProviderJsonResponse<T>> {
		this.calls.push({ method: 'generateJson', request })
		const step = await this.resolveJsonStep(request)
		const data = (await resolveJson(step.reply, request)) as T
		return {
			data,
			text: JSON.stringify(data),
			tokens: {
				prompt: 0,
				completion: 0,
			},
		}
	}
}

const toProviderResponse = (output: string): ProviderResponse => ({
	output,
	tokens: {
		prompt: 0,
		completion: 0,
	},
})

const resolveText = async (reply: ScriptedTextReply, request: ProviderRequest) =>
	typeof reply === 'function' ? await reply(request) : reply

const resolveJson = async (reply: ScriptedJsonReply, request: ProviderJsonRequest) =>
	typeof reply === 'function' ? await reply(request) : reply

const resolveError = async (reply: ScriptedErrorReply, request: ProviderRequest | ProviderJsonRequest) =>
	typeof reply === 'function' ? await reply(request) : reply

const resolveChunks = async (reply: ScriptedChunksReply, request: ProviderRequest) =>
	typeof reply === 'function' ? await reply(request) : reply

const resolveReasoning = async (reply: ScriptedReasoningReply, request: ProviderRequest) =>
	typeof reply === 'function' ? await reply(request) : reply
