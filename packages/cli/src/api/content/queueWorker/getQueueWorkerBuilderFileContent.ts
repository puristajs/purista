import type { Options } from 'code-block-writer'
import CodeBlockWriter from 'code-block-writer'
import { camelCase, pascalCase } from '../../change-case.js'
import { convertToProjectFileCasing } from '../../convertToProjectFileCasing.js'
import type { PuristaConfig } from '../../loadPuristaConfig.js'

export const getQueueWorkerBuilderFileContent = (input: {
	serviceName: string
	serviceVersion: string
	queueName: string
	workerName: string
	workerDescription: string
	mode: 'continuous' | 'interval' | 'sequential'
	intervalMs?: number
	maxParallelHandlers: number
	puristaConfig: PuristaConfig
	codeWriterOptions?: Partial<Options>
}) => {
	const writer = new CodeBlockWriter(input.codeWriterOptions)

	const template = `${input.serviceName} v${input.serviceVersion} service builder`
	const serviceBuilderName = camelCase(template)
	const serviceBuilderFileName = convertToProjectFileCasing(template, input.puristaConfig)
	const workerBuilderName = camelCase(`${input.workerName} queue worker builder`)
	const queueDirName = convertToProjectFileCasing(input.queueName, input.puristaConfig)
	const queueTypePrefix = pascalCase(`${input.serviceName} v${input.serviceVersion} ${input.queueName} queue`)

	writer.writeLine(`import type { QueueMessage } from '@purista/core'`)
	writer.writeLine(`import { ${serviceBuilderName} } from '../../${serviceBuilderFileName}.js'`)
	writer.writeLine(
		`import type { ${queueTypePrefix}Payload, ${queueTypePrefix}Parameter } from '../../queue/${queueDirName}/types.js'`,
	)
	writer.blankLine()

	writer.writeLine(`export const ${workerBuilderName} = ${serviceBuilderName}`)
	writer.indent(() => {
		writer
			.write('.getQueueWorkerBuilder(')
			.quote(camelCase(input.queueName))
			.write(',')
			.quote(input.workerDescription || input.workerName)
			.write(')')
			.newLine()
		writer.writeLine(`.setMode('${input.mode}')`)
		if (input.mode === 'interval' && input.intervalMs) {
			writer.writeLine(`.setIntervalMs(${input.intervalMs})`)
		}
		writer.writeLine(`.setMaxParallelHandlers(${input.maxParallelHandlers})`)
		if (input.puristaConfig.linter === 'biome') {
			writer.writeLine(
				'// biome-ignore lint/complexity/useArrowFunction: handler relies on service context `this` binding',
			)
		}
		writer
			.write(
				`.setHandler(async function (context, message: QueueMessage<${queueTypePrefix}Payload, ${queueTypePrefix}Parameter>)`,
			)
			.inlineBlock(() => {
				writer.writeLine("context.logger.debug({ message }, 'processing queue job')")
				writer.writeLine('await context.job.complete()')
				writer.writeLine('return undefined')
			})
			.write(')')
	})

	return writer.toString()
}
