import type {
	ModelProvider,
	ProviderGenerateTextRequest,
	ProviderJsonRequest,
	ProviderJsonResponse,
	ProviderRequest,
	ProviderResponse,
	ProviderStream,
} from '../providers/runtime/ModelProvider.js'

export type MockTextMatcher = string | RegExp | ((request: ProviderRequest) => boolean)
export type MockJsonMatcher =
	| string
	| RegExp
	| ((request: ProviderJsonRequest) => boolean)
	| Record<string, unknown>
	| Array<unknown>

export type MockTextReply = string | ((request: ProviderRequest) => string | Promise<string>)
export type MockJsonReply = unknown | ((request: ProviderJsonRequest) => unknown | Promise<unknown>)

const matchesText = (matcher: MockTextMatcher, request: ProviderRequest): boolean => {
	if (typeof matcher === 'string') {
		return request.prompt.includes(matcher)
	}
	if (matcher instanceof RegExp) {
		return matcher.test(request.prompt)
	}
	return matcher(request)
}

const matchesJson = (matcher: MockJsonMatcher, request: ProviderJsonRequest): boolean => {
	if (typeof matcher === 'function') {
		return matcher(request)
	}
	if (typeof matcher === 'string') {
		return request.prompt.includes(matcher)
	}
	if (matcher instanceof RegExp) {
		return matcher.test(request.prompt)
	}
	return JSON.stringify(request.schema ?? null) === JSON.stringify(matcher)
}

const toProviderResponse = (output: string): ProviderResponse => ({
	output,
	tokens: {
		prompt: 0,
		completion: 0,
	},
})

export class MockModel implements ModelProvider {
	readonly name = 'mock-model'
	readonly capabilities = {
		text: true,
		stream: true,
		json: true,
	}

	private readonly textRules: Array<{ matcher: MockTextMatcher; reply: MockTextReply }> = []
	private readonly jsonRules: Array<{ matcher: MockJsonMatcher; reply: MockJsonReply }> = []

	on(matcher: MockTextMatcher): { reply: (reply: MockTextReply) => MockModel } {
		return {
			reply: (reply: MockTextReply) => {
				this.textRules.push({ matcher, reply })
				return this
			},
		}
	}

	onJson(matcher: MockJsonMatcher): { reply: (reply: MockJsonReply) => MockModel } {
		return {
			reply: (reply: MockJsonReply) => {
				this.jsonRules.push({ matcher, reply })
				return this
			},
		}
	}

	private async resolveText(request: ProviderRequest): Promise<string> {
		const rule = this.textRules.find(candidate => matchesText(candidate.matcher, request))
		if (!rule) {
			throw new Error(`MockModel: no text rule matched prompt "${request.prompt}"`)
		}
		return typeof rule.reply === 'function' ? await rule.reply(request) : rule.reply
	}

	private async resolveJson(request: ProviderJsonRequest): Promise<unknown> {
		const rule = this.jsonRules.find(candidate => matchesJson(candidate.matcher, request))
		if (!rule) {
			throw new Error(`MockModel: no JSON rule matched prompt "${request.prompt}"`)
		}
		return typeof rule.reply === 'function' ? await rule.reply(request) : rule.reply
	}

	async generate(request: ProviderRequest): Promise<ProviderResponse> {
		return toProviderResponse(await this.resolveText(request))
	}

	stream(request: ProviderRequest): ProviderStream {
		let outputPromise: Promise<string> | undefined
		const resolveOutput = async () => {
			outputPromise ??= this.resolveText(request)
			return await outputPromise
		}
		return {
			async final() {
				return toProviderResponse(await resolveOutput())
			},
			async *[Symbol.asyncIterator]() {
				const output = await resolveOutput()
				if (output.length > 0) {
					yield {
						type: 'text-delta',
						textDelta: output,
					} as const
				}
			},
		}
	}

	async generateText(request: ProviderGenerateTextRequest): Promise<string> {
		const output = await this.resolveText(request)
		if (output.length > 0) {
			await request.onTextDelta?.(output)
		}
		return output
	}

	async generateJson<T = unknown>(request: ProviderJsonRequest): Promise<ProviderJsonResponse<T>> {
		const data = (await this.resolveJson(request)) as T
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
