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

	writer.writeLine("import { createHash } from 'node:crypto'")
	writer.writeLine("import { z } from 'zod'")
	if (input.http === 'command') writer.writeLine("import type { HarnessTargetRunOutcome } from '@purista/harness'")
	if (input.http === 'stream') {
		writer.writeLine(
			"import { AI_SDK_UI_MESSAGE_STREAM_V1_PROTOCOL, parseHarnessUIMessageRequest, pipeHarnessUIMessageStream } from '@purista/harness-ai-sdk-ui/v1'",
		)
	}
	writer.writeLine(`import { ${serviceBuilderIdentifier} } from '../../${serviceBuilderFile}.js'`)
	writer.writeLine(`import { ${agentIdentifier} } from '${input.agentImport}'`).blankLine()

	if (input.http === 'command') {
		const outputType = `${pascalCase(names.targetName)}CommandOutput`
		writer.writeLine(
			`type AgentOutcome = Extract<HarnessTargetRunOutcome<typeof ${agentIdentifier}.contract>, { status: 'completed' }>`,
		)
		writer.writeLine('type AgentResult = { sessionId: string; outcome: AgentOutcome }')
		writer.writeLine(
			'const inputSchema = z.object({ input: z.string(), conversationId: z.string().min(1).optional() })',
		)
		writer.writeLine('const parameterSchema = z.object({})')
		writer.writeLine('const outputSchema = z.object({')
		writer.indent(() => {
			writer.writeLine('sessionId: z.string().min(1),')
			writer.writeLine("outcome: z.discriminatedUnion('status', [")
			writer.indent(() => {
				writer.writeLine(
					`z.object({ status: z.literal('completed'), runId: z.string().min(1), output: ${agentIdentifier}.contract.output }),`,
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
					"if (context.message.principalId === undefined) throw new Error('Authenticated principal identity is required.')",
				)
				writer.writeLine(
					"const sessionId = createHash('sha256').update(JSON.stringify([context.message.tenantId ?? '', context.message.principalId, payload.conversationId ?? 'default'])).digest('base64url')",
				)
				writer.writeLine(
					`const result = await context.agent${serviceAddress}[${singleQuoted(input.serviceVersion)}][${agentIdentifier}.contract.id].run(`,
				)
				writer.indent(() => {
					writer.writeLine('payload.input,')
					writer.writeLine('{ sessionId },')
				})
				writer.writeLine(')')
				writer.writeLine(
					"if (result.outcome.status !== 'completed') throw new Error('The generated agent projection only supports completed outcomes.')",
				)
				writer.writeLine('return result as AgentResult')
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
		writer.writeLine('.setHttpStreamProtocol(AI_SDK_UI_MESSAGE_STREAM_V1_PROTOCOL)')
		writer.writeLine('.setStreamFunction(async function (context, payload, _parameter, writer) {')
		writer.indent(() => {
			writer.writeLine(
				"if (context.message.principalId === undefined) throw new Error('Authenticated principal identity is required.')",
			)
			writer.writeLine('const transportId = z.object({ id: z.string().min(1) }).parse(payload).id')
			writer.writeLine(
				"const trustedSessionId = createHash('sha256').update(JSON.stringify([context.message.tenantId ?? '', context.message.principalId, transportId])).digest('base64url')",
			)
			writer.writeLine(
				'const request = await (parseHarnessUIMessageRequest as (body: unknown, options: { sessionId: string }) => ReturnType<typeof parseHarnessUIMessageRequest>)(payload, { sessionId: trustedSessionId })',
			)
			writer.writeLine(
				"const input = request.lastUserMessage.parts.flatMap(part => part.type === 'text' ? [part.text] : []).join('\\n')",
			)
			writer.writeLine(
				`const target = context.agent${serviceAddress}[${singleQuoted(input.serviceVersion)}][${agentIdentifier}.contract.id]`,
			)
			writer.writeLine('const events = await target.stream(input, { sessionId: request.sessionId })')
			writer.writeLine('await pipeHarnessUIMessageStream(events, writer, request)')
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
\t\texpectTypeOf<ClientResult['outcome']>().toEqualTypeOf<Extract<HarnessTargetRunOutcome<typeof ${agentIdentifier}.contract>, { status: 'completed' }>>()
\t\texpectTypeOf<${outputType}['outcome']>().toEqualTypeOf<ClientResult['outcome']>()`
		: ''
}
\t})
${
	input.http === 'command'
		? `
\tit('scopes a completed agent run to the authenticated conversation', async () => {
\t\tconst payload = { input: 'summarize this', conversationId: 'conversation-1' }
\t\tconst { context, stubs } = createCommandContextMock(${names.builderIdentifier}, { payload, parameter: {} })
\t\tconst completed = { sessionId: 'generated-session', outcome: { status: 'completed', runId: 'run-1', output: 'done' } } as const
\t\tstubs.agent.${pascalCase(input.serviceName)}['${input.serviceVersion}'].${camelCase(input.agentName)}.run.resolves(completed)

\t\tconst result = await ${names.builderIdentifier}.getCommandFunctionPlain().call({} as never, context, payload, {})

\t\texpect(result).toEqual(completed)
\t\tconst [input, options] = stubs.agent.${pascalCase(input.serviceName)}['${input.serviceVersion}'].${camelCase(input.agentName)}.run.firstCall.args
\t\texpect(input).toBe('summarize this')
\t\texpect(options?.sessionId).toMatch(/^[A-Za-z0-9_-]{43}$/)
\t})
`
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

\t\tconst [streamInput, streamOptions] = harness.stubs.agent.${pascalCase(input.serviceName)}['${input.serviceVersion}'].${camelCase(input.agentName)}.stream.firstCall.args
\t\texpect(streamInput).toBe('hello')
\t\texpect(streamOptions?.sessionId).toBeTruthy()
\t\texpect(harness.chunks.at(-1)).toEqual({ event: 'data', data: '[DONE]' })
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

\t\tawait expect(execution).resolves.toBeUndefined()
\t\texpect(cancellationReasons).toContain('client closed')
\t})`
		: ''
}
})
`
}
