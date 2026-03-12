import type {
	ModelProvider,
	ProviderGenerateTextRequest,
	ProviderJsonRequest,
	ProviderJsonResponse,
	ProviderRequest,
	ProviderResponse,
	ProviderStream,
} from '../providers/runtime/ModelProvider.js'

type TextMatcher = string | RegExp | ((request: ProviderRequest) => boolean)
type JsonMatcher =
	| string
	| RegExp
	| ((request: ProviderJsonRequest) => boolean)
	| Record<string, unknown>
	| Array<unknown>

type TextReply = string | ((request: ProviderRequest) => string | Promise<string>)
type JsonReply = unknown | ((request: ProviderJsonRequest) => unknown | Promise<unknown>)

const matchesText = (matcher: TextMatcher, request: ProviderRequest): boolean => {
	if (typeof matcher === 'string') {
		return request.prompt.includes(matcher)
	}
	if (matcher instanceof RegExp) {
		return matcher.test(request.prompt)
	}
	return matcher(request)
}

const matchesJson = (matcher: JsonMatcher, request: ProviderJsonRequest): boolean => {
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

	private readonly textRules: Array<{ matcher: TextMatcher; reply: TextReply }> = []
	private readonly jsonRules: Array<{ matcher: JsonMatcher; reply: JsonReply }> = []

	on(matcher: TextMatcher): { reply: (reply: TextReply) => MockModel } {
		return {
			reply: (reply: TextReply) => {
				this.textRules.push({ matcher, reply })
				return this
			},
		}
	}

	onJson(matcher: JsonMatcher): { reply: (reply: JsonReply) => MockModel } {
		return {
			reply: (reply: JsonReply) => {
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
