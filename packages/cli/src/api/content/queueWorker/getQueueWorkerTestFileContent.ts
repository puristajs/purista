import type { Options } from 'code-block-writer'
import CodeBlockWriter from 'code-block-writer'
import { camelCase, capitalCase, pascalCase } from '../../change-case.js'
import { convertToProjectFileCasing } from '../../convertToProjectFileCasing.js'
import type { PuristaConfig } from '../../loadPuristaConfig.js'

/** Generate a queue worker test using `createQueueWorkerTestHarness`. */
export const getQueueWorkerTestFileContent = (input: {
	serviceName: string
	serviceVersion: string
	workerName: string
	queueName: string
	puristaConfig: PuristaConfig
	codeWriterOptions?: Partial<Options>
}) => {
	const writer = new CodeBlockWriter(input.codeWriterOptions)

	const workerBuilderFileName = convertToProjectFileCasing(
		`${input.workerName} queue worker builder`,
		input.puristaConfig,
	)
	const workerBuilderName = camelCase(`${input.workerName} queue worker builder`)
	const serviceTemplate = `${input.serviceName} v${input.serviceVersion} service`
	const serviceFileName = convertToProjectFileCasing(serviceTemplate, input.puristaConfig)
	const serviceName = camelCase(serviceTemplate)
	const typePrefix = pascalCase(`${input.serviceName} v${input.serviceVersion} ${input.queueName} queue`)
	const queueFileName = convertToProjectFileCasing(input.queueName, input.puristaConfig)
	const testLib = input.puristaConfig.runtime === 'bun' ? 'bun:test' : 'vitest'

	writer.writeLine(`import { describe, expect, it } from '${testLib}'`)
	writer.writeLine(`import { createQueueWorkerTestHarness } from '@purista/core/testing'`)
	writer.blankLine()
	writer.writeLine(`import { ${serviceName} } from '../../${serviceFileName}.js'`)
	writer.writeLine(`import { ${workerBuilderName} } from './${workerBuilderFileName}.js'`)
	writer.writeLine(
		`import type { ${typePrefix}Parameter, ${typePrefix}Payload } from '../../queue/${queueFileName}/types.js'`,
	)
	writer.blankLine()
	writer
		.write(
			`describe('service ${capitalCase(input.serviceName)} version ${input.serviceVersion} - queue worker ${camelCase(input.workerName)}', () =>`,
		)
		.inlineBlock(() => {
			writer
				.write(`it('processes one leased job through the worker runtime', async () =>`)
				.inlineBlock(() => {
					writer.writeLine(`const payload: ${typePrefix}Payload = undefined`)
					writer.writeLine(`const parameter: ${typePrefix}Parameter = {}`)
					writer.blankLine()
					writer.writeLine(`const harness = await createQueueWorkerTestHarness(${serviceName}, ${workerBuilderName})`)
					writer.blankLine()
					writer.writeLine('try {')
					writer.withIndentationLevel(1, () => {
						writer.writeLine('const result = await harness.run({')
						writer.withIndentationLevel(2, () => {
							writer.writeLine("id: 'job-1',")
							writer.writeLine(`queueName: '${camelCase(input.queueName)}',`)
							writer.writeLine('payload,')
							writer.writeLine('parameter,')
							writer.writeLine('headers: {},')
							writer.writeLine('createdAt: Date.now(),')
							writer.writeLine('attempt: 1,')
							writer.writeLine('maxAttempts: 3,')
							writer.writeLine('leaseExpiresAt: Date.now() + 60_000,')
							writer.writeLine('leaseTtlMs: 60_000,')
							writer.writeLine("traceId: 'trace-1',")
							writer.writeLine("correlationId: 'corr-1',")
						})
						writer.writeLine('})')
						writer.blankLine()
						writer.writeLine('expect(result.ackCalls).toHaveLength(1)')
						writer.writeLine('expect(result.deadLetterCalls).toHaveLength(0)')
					})
					writer.writeLine('} finally {')
					writer.withIndentationLevel(1, () => {
						writer.writeLine('await harness.destroy()')
					})
					writer.writeLine('}')
				})
				.write(')')
		})
		.write(')')

	return writer.toString()
}
