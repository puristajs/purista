import type { Options } from 'code-block-writer'
import CodeBlockWriter from 'code-block-writer'
import { camelCase, kebabCase, pascalCase } from '../../change-case.js'
import { convertToProjectFileCasing } from '../../convertToProjectFileCasing.js'
import type { PuristaConfig } from '../../loadPuristaConfig.js'
import { getHarnessAgentIdentifier } from './getHarnessAgentFileContent.js'

export type AgentHttpProjection = 'none' | 'command' | 'stream'

const singleQuoted = (value: string) => `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`

export const getAgentHttpProjectionNames = (input: {
	agentName: string
	http: Exclude<AgentHttpProjection, 'none'>
	puristaConfig: PuristaConfig
}) => {
	const targetName = camelCase(`${input.http === 'command' ? 'run' : 'stream'} ${input.agentName}`)
	const kind: 'command' | 'stream' = input.http === 'command' ? 'command' : 'stream'
	const builderIdentifier = camelCase(`${targetName} ${kind} builder`)
	return {
		targetName,
		kind,
		builderIdentifier,
		directoryName: convertToProjectFileCasing(targetName, input.puristaConfig),
		builderFileName: convertToProjectFileCasing(`${targetName} ${kind} builder`, input.puristaConfig),
		route: `ai/${kebabCase(input.agentName)}`,
	}
}

/** Generate the protected PURISTA command or stream that projects one mounted agent. */
export const getAgentHttpProjectionFileContent = (input: {
	serviceName: string
	serviceVersion: string
	agentName: string
	agentDescription: string
	http: Exclude<AgentHttpProjection, 'none'>
	puristaConfig: PuristaConfig
	agentImport: string
	codeWriterOptions?: Partial<Options>
}) => {
	const writer = new CodeBlockWriter(input.codeWriterOptions)
	const names = getAgentHttpProjectionNames(input)
	const agentIdentifier = getHarnessAgentIdentifier(input.agentName)
	const serviceBuilderIdentifier = camelCase(`${input.serviceName} v${input.serviceVersion} service builder`)
	const serviceBuilderFile = convertToProjectFileCasing(
		`${input.serviceName} v${input.serviceVersion} service builder`,
		input.puristaConfig,
	)
	const serviceName = pascalCase(input.serviceName)
	const serviceAddress = /^[A-Za-z_$][\w$]*$/.test(serviceName) ? `.${serviceName}` : `[${singleQuoted(serviceName)}]`

	writer.writeLine("import { z } from 'zod'")
	if (input.http === 'command') writer.writeLine("import type { HarnessTargetRunOutcome } from '@purista/harness'")
	if (input.http === 'stream') {
		writer.writeLine(
			"import { createHarnessUIMessageSseEvents, parseHarnessUIMessageRequest } from '@purista/harness-ai-sdk-ui/v1'",
		)
	}
	writer.writeLine(`import { ${serviceBuilderIdentifier} } from '../../${serviceBuilderFile}.js'`)
	writer.writeLine(`import { ${agentIdentifier} } from '${input.agentImport}'`).blankLine()

	if (input.http === 'command') {
		const outputType = `${pascalCase(names.targetName)}CommandOutput`
		writer.writeLine(`type AgentOutcome = HarnessTargetRunOutcome<typeof ${agentIdentifier}.contract>`)
		writer.writeLine('type AgentResult = { sessionId: string; outcome: AgentOutcome }')
		writer.writeLine("type AgentInterrupt = Extract<AgentOutcome, { status: 'interrupted' }>['interrupt']")
		writer.writeLine('const interruptSchema = z.json() as unknown as z.ZodType<AgentInterrupt, AgentInterrupt>')
		writer.writeLine('const inputSchema = z.object({ input: z.string(), sessionId: z.string().min(1).optional() })')
		writer.writeLine('const parameterSchema = z.object({})')
		writer.writeLine('const outputSchema = z.object({')
		writer.indent(() => {
			writer.writeLine('sessionId: z.string().min(1),')
			writer.writeLine("outcome: z.discriminatedUnion('status', [")
			writer.indent(() => {
				writer.writeLine(
					`z.object({ status: z.literal('completed'), runId: z.string().min(1), output: ${agentIdentifier}.contract.output }),`,
				)
				writer.writeLine(
					"z.object({ status: z.literal('interrupted'), runId: z.string().min(1), interrupt: interruptSchema }),",
				)
			})
			writer.writeLine(']),')
		})
		writer.writeLine('}) as unknown as z.ZodType<AgentResult, AgentResult>').blankLine()
		writer.writeLine(`export type ${outputType} = z.infer<typeof outputSchema>`).blankLine()
		writer.writeLine(`export const ${names.builderIdentifier} = ${serviceBuilderIdentifier}`)
		writer.indent(() => {
			writer.writeLine(`.getCommandBuilder('${names.targetName}', ${JSON.stringify(`Run ${input.agentDescription}`)})`)
			writer.writeLine('.addPayloadSchema(inputSchema)')
			writer.writeLine('.addParameterSchema(parameterSchema)')
			writer.writeLine('.addOutputSchema(outputSchema)')
			writer.writeLine(
				`.canInvokeAgent(${singleQuoted(serviceName)}, ${singleQuoted(input.serviceVersion)}, ${agentIdentifier}.contract)`,
			)
			writer.writeLine(`.exposeAsHttpEndpoint('POST', '${names.route}')`)
			writer.writeLine('.enableHttpSecurity(true)')
			writer.writeLine('.setCommandFunction(async function (context, payload, _parameter) {')
			writer.indent(() => {
				writer.writeLine(
					`return context.agent${serviceAddress}[${singleQuoted(input.serviceVersion)}][${agentIdentifier}.contract.id].run(`,
				)
				writer.indent(() => {
					writer.writeLine('payload.input,')
					writer.writeLine('payload.sessionId === undefined ? {} : { sessionId: payload.sessionId },')
				})
				writer.writeLine(')')
			})
			writer.writeLine('})')
		})
		return writer.toString()
	}

	writer.writeLine('const inputSchema = z.unknown()')
	writer.writeLine('const parameterSchema = z.object({})')
	writer.writeLine("const chunkSchema = z.object({ event: z.literal('data'), data: z.unknown() })")
	writer.writeLine('const finalSchema = z.void()').blankLine()
	writer.writeLine(`export const ${names.builderIdentifier} = ${serviceBuilderIdentifier}`)
	writer.indent(() => {
		writer.writeLine(`.getStreamBuilder('${names.targetName}', ${JSON.stringify(`Stream ${input.agentDescription}`)})`)
		writer.writeLine('.addPayloadSchema(inputSchema)')
		writer.writeLine('.addParameterSchema(parameterSchema)')
		writer.writeLine('.addChunkSchema(chunkSchema)')
		writer.writeLine('.addFinalSchema(finalSchema)')
		writer.writeLine(
			`.canInvokeAgent(${singleQuoted(serviceName)}, ${singleQuoted(input.serviceVersion)}, ${agentIdentifier}.contract)`,
		)
		writer.writeLine(`.exposeAsHttpStreamEndpoint('POST', '${names.route}')`)
		writer.writeLine('.enableHttpSecurity(true)')
		writer.writeLine('.enableChunkAggregation(false)')
		writer.writeLine(".setHttpStreamingMode('stream')")
		writer.writeLine(".setHttpStreamProtocol('ai-sdk-ui-message-stream-v1')")
		writer.writeLine(".setHttpResponseHeaders({ 'x-vercel-ai-ui-message-stream': 'v1' })")
		writer.writeLine('.setStreamFunction(async function (context, payload, _parameter, writer) {')
		writer.indent(() => {
			writer.writeLine('const request = await parseHarnessUIMessageRequest(payload)')
			writer.writeLine(
				"const input = request.lastUserMessage.parts.flatMap(part => part.type === 'text' ? [part.text] : []).join('\\n')",
			)
			writer.writeLine(
				`const events = await context.agent${serviceAddress}[${singleQuoted(input.serviceVersion)}][${agentIdentifier}.contract.id].stream(`,
			)
			writer.indent(() => {
				writer.writeLine('input,')
				writer.writeLine(
					'request.resume === undefined ? { sessionId: request.sessionId } : { sessionId: request.sessionId, resume: request.resume },',
				)
			})
			writer.writeLine(')')
			writer.writeLine('let cancellation = Promise.resolve()')
			writer.writeLine('writer.onCancel(reason => { cancellation = events.cancel(reason) })')
			writer.writeLine('try {')
			writer.indent(() => {
				writer.writeLine('for await (const record of createHarnessUIMessageSseEvents(events, {')
				writer.indent(() => {
					writer.writeLine('sessionId: request.sessionId,')
					writer.writeLine(
						'...(request.assistantMessageId === undefined ? {} : { messageId: request.assistantMessageId }),',
					)
				})
				writer.writeLine('})) {')
				writer.indent(() => writer.writeLine('await writer.write(record)'))
				writer.writeLine('}')
				writer.writeLine('if (!writer.cancelled) await writer.close()')
			})
			writer.writeLine('} finally {')
			writer.indent(() => writer.writeLine('await cancellation'))
			writer.writeLine('}')
		})
		writer.writeLine('})')
	})
	return writer.toString()
}

/** Generate a small colocated contract test for the projected builder metadata. */
export const getAgentHttpProjectionTestFileContent = (input: {
	serviceName: string
	serviceVersion: string
	agentName: string
	http: Exclude<AgentHttpProjection, 'none'>
	puristaConfig: PuristaConfig
	agentImport: string
	codeWriterOptions?: Partial<Options>
}) => {
	const names = getAgentHttpProjectionNames(input)
	const agentIdentifier = getHarnessAgentIdentifier(input.agentName)
	const outputType = `${pascalCase(names.targetName)}CommandOutput`
	const testLib = input.puristaConfig.runtime === 'bun' ? 'bun:test' : 'vitest'
	return `import type { HarnessTargetRunOutcome } from '@purista/harness'
import { ${input.http === 'command' ? 'createCommandContextMock' : 'createStreamContextMock'} } from '@purista/core'
import { describe, expect, expectTypeOf, it } from '${testLib}'
import { ${agentIdentifier} } from '${input.agentImport}'
import { ${names.builderIdentifier}${input.http === 'command' ? `, type ${outputType}` : ''} } from './${names.builderFileName}.js'

describe('${names.builderIdentifier}', () => {
\tit('keeps the generated HTTP projection protected', async () => {
\t\tconst definition = await ${names.builderIdentifier}.getDefinition()
\t\texpect(definition.${input.http === 'command' ? 'commandName' : 'streamName'}).toBe('${names.targetName}')
${input.http === 'stream' ? '\t\texpect(definition.metadata.expose.http?.openApi?.isSecure).toBe(true)' : ''}
${
	input.http === 'command'
		? `\t\ttype ClientResult = Awaited<ReturnType<ReturnType<typeof ${names.builderIdentifier}.getCommandFunctionPlain>>>
\t\texpectTypeOf<ClientResult['outcome']>().toEqualTypeOf<HarnessTargetRunOutcome<typeof ${agentIdentifier}.contract>>()
\t\texpectTypeOf<${outputType}['outcome']>().toEqualTypeOf<ClientResult['outcome']>()`
		: ''
}
\t})
${
	input.http === 'command'
		? `
\tit('forwards input and session while preserving an interrupted outcome', async () => {
\t\tconst payload = { input: 'summarize this', sessionId: 'session-1' }
\t\tconst { context, stubs } = createCommandContextMock(${names.builderIdentifier}, { payload, parameter: {} })
\t\tconst interrupted = {
\t\t\tsessionId: 'session-1',
\t\t\toutcome: {
\t\t\t\tstatus: 'interrupted',
\t\t\t\trunId: 'run-1',
\t\t\t\tinterrupt: { type: 'external-wait', id: 'wait-1' },
\t\t\t},
\t\t} as unknown as ${outputType}
\t\tstubs.agent.${pascalCase(input.serviceName)}['${input.serviceVersion}'].${camelCase(input.agentName)}.run.resolves(interrupted)

\t\tconst result = await ${names.builderIdentifier}.getCommandFunctionPlain().call({} as never, context, payload, {})

\t\texpect(result).toEqual(interrupted)
	\texpect(stubs.agent.${pascalCase(input.serviceName)}['${input.serviceVersion}'].${camelCase(input.agentName)}.run.calledWith('summarize this', { sessionId: 'session-1' })).toBe(true)
	})

	it('allows Harness to allocate a session when the request omits one', async () => {
		const payload = { input: 'summarize this' }
		const { context, stubs } = createCommandContextMock(${names.builderIdentifier}, { payload, parameter: {} })
		const completed = { sessionId: 'generated-session', outcome: { status: 'completed', runId: 'run-2', output: 'done' } } as const
		stubs.agent.${pascalCase(input.serviceName)}['${input.serviceVersion}'].${camelCase(input.agentName)}.run.resolves(completed)
		const result = await ${names.builderIdentifier}.getCommandFunctionPlain().call({} as never, context, payload, {})
		expect(result).toEqual(completed)
		expect(stubs.agent.${pascalCase(input.serviceName)}['${input.serviceVersion}'].${camelCase(input.agentName)}.run.calledWith('summarize this', {})).toBe(true)
	})`
		: ''
}
${
	input.http === 'stream'
		? `
\tit('maps a UI message to the addressed stream and writes data-only v1 events', async () => {
\t\tconst payload = {
\t\t\tid: 'session-1',
\t\t\ttrigger: 'submit-message',
\t\t\tmessages: [{ id: 'user-1', role: 'user', parts: [{ type: 'text', text: 'hello' }] }],
\t\t}
\t\tconst harness = createStreamContextMock(${names.builderIdentifier}, { payload, parameter: {} })
\t\tconst outcome = { status: 'completed', runId: 'run-1', output: 'done' } as const
\t\tconst events = {
\t\t\tresult: Promise.resolve(outcome),
\t\t\tcancel: async (_reason?: string) => undefined,
\t\t\tasync *[Symbol.asyncIterator]() {
\t\t\t\tyield { type: 'run.started', eventId: 'event-1', sequence: 1, runId: 'run-1', at: new Date(0).toISOString() }
\t\t\t\tyield { type: 'run.finished', eventId: 'event-2', sequence: 2, runId: 'run-1', at: new Date(1).toISOString(), outcome }
\t\t\t},
\t\t}
\t\tharness.stubs.agent.${pascalCase(input.serviceName)}['${input.serviceVersion}'].${camelCase(input.agentName)}.stream.resolves(events as never)

\t\tawait ${names.builderIdentifier}.getStreamFunction().call({} as never, harness.context, payload, {}, harness.writer)

\t\texpect(harness.stubs.agent.${pascalCase(input.serviceName)}['${input.serviceVersion}'].${camelCase(input.agentName)}.stream.calledWith('hello', { sessionId: 'session-1' })).toBe(true)
\t\texpect(harness.chunks.at(-1)).toEqual({ event: 'data', data: '[DONE]' })
	})

	it('forwards an approval continuation as resume without an idempotency key', async () => {
		const descriptor = {
			protocol: 'purista-harness/tool-approval', version: 1,
			rootRunId: 'run-approval', agentRunId: 'agent-run-1', sessionId: 'session-3',
			interruptId: 'interrupt-1', revision: 'revision-1', eventId: 'event-4', approvalIds: ['approval-1'],
		}
		const payload = {
			id: 'session-3', trigger: 'submit-message', messageId: 'assistant-1',
			messages: [
				{ id: 'user-3', role: 'user', parts: [{ type: 'text', text: 'continue' }] },
				{ id: 'assistant-1', role: 'assistant', parts: [{
					type: 'dynamic-tool', toolName: 'operation', toolCallId: 'call-1', state: 'approval-responded',
					input: { id: 'tx-1' }, approval: { id: 'approval-1', approved: true, descriptor },
				}] },
			],
		}
		const harness = createStreamContextMock(${names.builderIdentifier}, { payload, parameter: {} })
		const outcome = { status: 'completed', runId: 'run-3', output: 'done' } as const
		const events = {
			result: Promise.resolve(outcome), cancel: async (_reason?: string) => undefined,
			async *[Symbol.asyncIterator]() {
				yield { type: 'run.started', eventId: 'event-5', sequence: 1, runId: 'run-3', at: new Date(0).toISOString() }
				yield { type: 'run.finished', eventId: 'event-6', sequence: 2, runId: 'run-3', at: new Date(1).toISOString(), outcome }
			},
		}
		harness.stubs.agent.${pascalCase(input.serviceName)}['${input.serviceVersion}'].${camelCase(input.agentName)}.stream.resolves(events as never)
		await ${names.builderIdentifier}.getStreamFunction().call({} as never, harness.context, payload, {}, harness.writer)
		const options = harness.stubs.agent.${pascalCase(input.serviceName)}['${input.serviceVersion}'].${camelCase(input.agentName)}.stream.firstCall.args[1]
		expect(options).toMatchObject({ sessionId: 'session-3', resume: { type: 'tool-approval', runId: 'run-approval' } })
		expect(options).not.toHaveProperty('idempotencyKey')
		expect(harness.chunks.at(-1)).toEqual({ event: 'data', data: '[DONE]' })
	})

\tit('propagates transport cancellation to the Harness stream', async () => {
\t\tconst payload = {
\t\t\tid: 'session-2',
\t\t\ttrigger: 'submit-message',
\t\t\tmessages: [{ id: 'user-2', role: 'user', parts: [{ type: 'text', text: 'wait' }] }],
\t\t}
\t\tconst harness = createStreamContextMock(${names.builderIdentifier}, { payload, parameter: {} })
\t\tlet release: () => void = () => undefined
\t\tconst cancellationReasons: Array<string | undefined> = []
\t\tconst events = {
\t\t\tresult: new Promise<never>(() => undefined),
\t\t\tcancel: async (reason?: string) => { cancellationReasons.push(reason); release() },
\t\t\tasync *[Symbol.asyncIterator]() { await new Promise<void>(resolve => { release = resolve }) },
\t\t}
\t\tharness.stubs.agent.${pascalCase(input.serviceName)}['${input.serviceVersion}'].${camelCase(input.agentName)}.stream.resolves(events as never)
\t\tconst execution = ${names.builderIdentifier}.getStreamFunction().call({} as never, harness.context, payload, {}, harness.writer)
\t\tawait new Promise(resolve => setTimeout(resolve, 0))

\t\tharness.cancel('client closed')

\t\tawait expect(execution).rejects.toThrow(/terminal event/)
\t\texpect(cancellationReasons).toContain('client closed')
\t})`
		: ''
}
})
`
}
