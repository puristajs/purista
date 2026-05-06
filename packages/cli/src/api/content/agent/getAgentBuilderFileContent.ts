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
	const schemaName = `${agentIdentifier}InputSchema`
	const serviceBuilderTemplate = `${input.serviceName} v${input.serviceVersion} service builder`
	const serviceBuilderName = camelCase(serviceBuilderTemplate)
	const serviceBuilderFileName = convertToProjectFileCasing(serviceBuilderTemplate, input.puristaConfig)
	const successEventName = input.responseEventName?.trim()
		? convertToProjectEventCasing(input.responseEventName, input.puristaConfig)
		: undefined

	writer.writeLine(`import { ${serviceBuilderName} } from '../../${serviceBuilderFileName}.js'`)
	writer.writeLine("import { extendApi } from '@purista/core'")
	writer.writeLine("import { z } from 'zod'").blankLine()

	writer.writeLine(`const ${schemaName} = extendApi(`)
	writer.indent(() => {
		writer.writeLine('z.object({')
		writer.indent(() => {
			writer.writeLine("sessionId: extendApi(z.string().optional(), { title: 'Session identifier' }),")
			writer.writeLine("prompt: extendApi(z.string().min(1), { title: 'User prompt' }),")
			writer.writeLine("context: extendApi(z.string().optional(), { title: 'Additional context' }),")
		})
		writer.writeLine('}),')
		writer.writeLine("  { title: 'Agent input schema' },")
	})
	writer.writeLine(')').blankLine()

	writer.writeLine(`export const ${agentIdentifier}Builder = ${serviceBuilderName}`)
	writer.indent(() => {
		writer.write(`.getAgentQueueBuilder('${agentIdentifier}', '${input.agentDescription}'`)
		if (successEventName) {
			writer.write(`, '${successEventName}'`)
		}
		writer.writeLine(')')
		writer.writeLine(`.addPayloadSchema(${schemaName})`)
		writer.writeLine(`.addModel('openai:gpt-4o-mini')`)
		writer.writeLine(`.exposeAsHttpEndpoint('POST', 'agents/${agentIdentifier}')`)
		writer.writeLine('.setAgentFunction(async function (context, payload) {')
		writer.indent(() => {
			writer.writeLine("context.logger.info({ prompt: payload.prompt }, 'planning agent execution')")
			writer.writeLine('const worker = context.ai.createModelExecutor({')
			writer.indent(() => {
				writer.writeLine("model: 'openai:gpt-4o-mini',")
				writer.writeLine("systemPrompt: 'You are a helpful assistant for this service domain.',")
			})
			writer.writeLine('})')
			writer.writeLine('const plan = await context.plan.generate({')
			writer.indent(() => {
				writer.writeLine("model: 'openai:gpt-4o-mini',")
				writer.writeLine('request: payload.prompt,')
				writer.writeLine("instructions: 'Break the request into executable tasks.',")
				writer.writeLine('worker,')
			})
			writer.writeLine('})')
			writer.writeLine('const { results, plan: executedPlan } = await context.plan.execute(plan)')
			writer.writeLine('const lastTask = executedPlan.tasks.at(-1)')
			writer.writeLine("const message = lastTask ? String(results[lastTask.id] ?? '') : 'No task result.'")
			writer.writeLine('return { message }')
		})
		writer.writeLine('})')
	})

	return writer.toString()
}
