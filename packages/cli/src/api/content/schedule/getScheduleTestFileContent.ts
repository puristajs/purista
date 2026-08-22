import type { Options } from 'code-block-writer'
import CodeBlockWriter from 'code-block-writer'
import { camelCase, capitalCase } from '../../change-case.js'
import { convertToProjectEventCasing } from '../../convertToProjectEventCasing.js'
import { convertToProjectFileCasing } from '../../convertToProjectFileCasing.js'
import type { PuristaConfig } from '../../loadPuristaConfig.js'

/** Generate a fast declaration test; scheduling itself is exercised by the separate Scheduler Runtime. */
export const getScheduleTestFileContent = (input: {
	serviceName: string
	serviceVersion: string
	scheduleName: string
	eventName: string
	cronExpression: string
	puristaConfig: PuristaConfig
	codeWriterOptions?: Partial<Options>
}) => {
	const writer = new CodeBlockWriter(input.codeWriterOptions)
	const scheduleFileName = convertToProjectFileCasing(`${input.scheduleName} schedule definition`, input.puristaConfig)
	const scheduleDefinitionName = camelCase(`${input.scheduleName} schedule definition`)
	const testLib = input.puristaConfig.runtime === 'bun' ? 'bun:test' : 'vitest'

	writer.writeLine(`import { describe, expect, test } from '${testLib}'`)
	writer.writeLine(`import { ${scheduleDefinitionName} } from './${scheduleFileName}.js'`)
	writer.blankLine()
	writer.write(
		`describe('service ${capitalCase(input.serviceName)} version ${input.serviceVersion} - schedule ${camelCase(input.scheduleName)}', () => `,
	)
	writer.block(() => {
		writer
			.write("test('declares an event-only trigger contract', () => ")
			.inlineBlock(() => {
				writer.writeLine(`expect(${scheduleDefinitionName}).toMatchObject({`)
				writer.withIndentationLevel(1, () => {
					writer.writeLine(`name: '${camelCase(input.scheduleName)}',`)
					writer.writeLine("targetKind: 'event',")
					writer.writeLine(`targetName: '${convertToProjectEventCasing(input.eventName, input.puristaConfig)}',`)
					writer.writeLine(`expression: { kind: 'cron', value: '${input.cronExpression}' },`)
				})
				writer.writeLine('})')
			})
			.write(')')
	})
	writer.write(')')

	return writer.toString()
}
