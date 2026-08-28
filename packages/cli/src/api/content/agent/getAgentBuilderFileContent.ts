import type { Options } from 'code-block-writer'
import CodeBlockWriter from 'code-block-writer'
import { camelCase } from '../../change-case.js'
import { convertToProjectEventCasing } from '../../convertToProjectEventCasing.js'
import { convertToProjectFileCasing } from '../../convertToProjectFileCasing.js'
import type { PuristaConfig } from '../../loadPuristaConfig.js'

const toAgentIdentifier = (name: string) => {
	const normalized = camelCase(name)
	return normalized.endsWith('Agent') ? normalized : `${normalized}Agent`
}

/**
 * Generate an attached-agent queue builder file.
 *
 * The generated agent defines payload, parameter, and output schemas, registers
 * a `primary` model, attaches a harness agent, configures an ephemeral session,
 * and exposes the agent as an HTTP endpoint.
 */
export const getAgentBuilderFileContent = (input: {
	agentName: string
	agentDescription: string
	serviceName: string
	serviceVersion: string
	responseEventName?: string
	puristaConfig: PuristaConfig
	codeWriterOptions?: Partial<Options>
}) => {
	const writer = new CodeBlockWriter(input.codeWriterOptions)
	const agentIdentifier = toAgentIdentifier(input.agentName)
	const payloadSchemaName = `${agentIdentifier}PayloadSchema`
	const parameterSchemaName = `${agentIdentifier}ParameterSchema`
	const outputSchemaName = `${agentIdentifier}OutputSchema`
	const harnessAgentName = `${agentIdentifier}HarnessAgent`
	const serviceBuilderTemplate = `${input.serviceName} v${input.serviceVersion} service builder`
	const serviceBuilderName = camelCase(serviceBuilderTemplate)
	const serviceBuilderFileName = convertToProjectFileCasing(serviceBuilderTemplate, input.puristaConfig)
	const successEventName = input.responseEventName?.trim()
		? convertToProjectEventCasing(input.responseEventName, input.puristaConfig)
		: undefined

	writer.writeLine(`import { ${serviceBuilderName} } from '../../${serviceBuilderFileName}.js'`)
	writer.writeLine("import { extendApi } from '@purista/core'")
	writer.writeLine("import { z } from 'zod'").blankLine()

	writer.writeLine(`const ${payloadSchemaName} = extendApi(`)
	writer.indent(() => {
		writer.writeLine('z.object({')
		writer.indent(() => {
			writer.writeLine("prompt: extendApi(z.string().min(1), { title: 'User prompt' }),")
			writer.writeLine("context: extendApi(z.string().optional(), { title: 'Additional context' }),")
		})
		writer.writeLine('}),')
		writer.writeLine("  { title: 'Agent payload schema' },")
	})
	writer.writeLine(')').blankLine()

	writer.writeLine(`const ${parameterSchemaName} = extendApi(`)
	writer.indent(() => {
		writer.writeLine('z.object({')
		writer.indent(() => {
			writer.writeLine("sessionId: extendApi(z.string().optional(), { title: 'Session identifier' }),")
		})
		writer.writeLine('}),')
		writer.writeLine("  { title: 'Agent parameter schema' },")
	})
	writer.writeLine(')').blankLine()

	writer.writeLine(`const ${outputSchemaName} = extendApi(`)
	writer.indent(() => {
		writer.writeLine('z.object({')
		writer.indent(() => {
			writer.writeLine("message: extendApi(z.string(), { title: 'Assistant message' }),")
		})
		writer.writeLine('}),')
		writer.writeLine("  { title: 'Agent output schema' },")
	})
	writer.writeLine(')').blankLine()

	writer.writeLine(`export const ${agentIdentifier}Builder = ${serviceBuilderName}`)
	writer.indent(() => {
		writer.writeLine(`.getAgentQueueBuilder('${agentIdentifier}', '${input.agentDescription}')`)
		writer.writeLine(`.addPayloadSchema(${payloadSchemaName})`)
		writer.writeLine(`.addParameterSchema(${parameterSchemaName})`)
		writer.writeLine(`.addOutputSchema(${outputSchemaName})`)
		writer.writeLine(".addModel('primary', {")
		writer.indent(() => {
			writer.writeLine("capabilities: ['object'],")
			writer.writeLine('defaults: { temperature: 0.2 },')
		})
		writer.writeLine('})')
		writer.writeLine('.setHarnessAgent({')
		writer.indent(() => {
			writer.writeLine("model: 'primary',")
			writer.writeLine(`input: ${payloadSchemaName},`)
			writer.writeLine(`output: ${outputSchemaName},`)
			writer.writeLine("instructions: 'You are a helpful assistant for this service domain.',")
			writer.writeLine('builtinTools: false,')
		})
		writer.writeLine('})')
		if (successEventName) {
			writer.writeLine(`.setSuccessEventName('${successEventName}')`)
		}
		writer.writeLine(".setSessionPolicy({ mode: 'ephemeral' })")
		writer.writeLine('.setExecutionPolicy({')
		writer.indent(() => {
			writer.writeLine('maxAttempts: 3,')
			writer.writeLine('maxParallelHandlers: 1,')
		})
		writer.writeLine('})')
		writer.writeLine(`.exposeAsHttpEndpoint('POST', 'agents/${agentIdentifier}')`)
	})

	return writer.toString()
}
