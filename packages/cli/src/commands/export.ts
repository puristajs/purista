import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, isAbsolute, join } from 'node:path'
import {
	EventBridgeCommandTransport,
	EventBridgeLateResponseHandling,
	EventBridgeResponseConfirmationLevel,
	EventBridgeStreamLateFrameHandling,
	exportAsyncApi,
	exportCloudEventsSchema,
	exportRuntimeCapabilities,
	exportScheduleManifest,
} from '@purista/core'
import { z } from 'zod'
import type { PuristaExecutableCommand } from '../core/command.js'
import { createIssuesFromZod, createPendingResolution, createResult } from './shared.js'

const outputFormatSchema = z.enum(['json']).default('json')

const exportDefinitionsInputSchema = z.object({
	definitions: z.string().trim().default('purista.definitions.json'),
	out: z.string().trim().default('asyncapi.json'),
	title: z.string().trim().default('PURISTA contracts'),
	version: z.string().trim().default('1.0.0'),
	format: outputFormatSchema,
})

const exportRuntimeCapabilitiesInputSchema = z.object({
	out: z.string().trim().default('purista-runtime-capabilities.json'),
	mode: z.enum(['definition-only', 'runtime-inspect']).default('definition-only'),
	format: outputFormatSchema,
})

const exportCloudEventsSchemaInputSchema = z.object({
	out: z.string().trim().default('cloudevents.json'),
	format: outputFormatSchema,
})

type ExportDefinitionsInput = z.input<typeof exportDefinitionsInputSchema>
type ExportDefinitionsResolved = z.output<typeof exportDefinitionsInputSchema>
type ExportRuntimeCapabilitiesInput = z.input<typeof exportRuntimeCapabilitiesInputSchema>
type ExportRuntimeCapabilitiesResolved = z.output<typeof exportRuntimeCapabilitiesInputSchema>
type ExportCloudEventsSchemaInput = z.input<typeof exportCloudEventsSchemaInputSchema>
type ExportCloudEventsSchemaResolved = z.output<typeof exportCloudEventsSchemaInputSchema>

const resolvePath = (cwd: string, filePath: string) => (isAbsolute(filePath) ? filePath : join(cwd, filePath))

const writeJsonFile = async (filePath: string, value: unknown) => {
	await mkdir(dirname(filePath), { recursive: true })
	await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf-8')
}

const readDefinitions = async (cwd: string, filePath: string) =>
	JSON.parse(await readFile(resolvePath(cwd, filePath), 'utf-8'))

const resolveDefinitionsExport = async <TInput extends ExportDefinitionsInput>(
	command: 'export-asyncapi' | 'export-schedule-manifest',
	input: TInput,
) => {
	const parsed = exportDefinitionsInputSchema.safeParse(input)
	if (!parsed.success) {
		return createPendingResolution<TInput, ExportDefinitionsResolved>(
			command,
			input,
			[],
			createIssuesFromZod(parsed.error),
		)
	}
	return createPendingResolution<TInput, ExportDefinitionsResolved>(command, input, [], [], [], parsed.data)
}

export const exportAsyncApiCommand: PuristaExecutableCommand<ExportDefinitionsInput, ExportDefinitionsResolved> = {
	id: 'export-asyncapi',
	resolve: input => resolveDefinitionsExport('export-asyncapi', input),
	execute: async (input, context) => {
		const definitions = await readDefinitions(context.cwd, input.definitions)
		const document = await exportAsyncApi({
			title: input.title,
			version: input.version,
			services: definitions,
		})
		const outPath = resolvePath(context.cwd, input.out)
		await writeJsonFile(outPath, document)
		return createResult('export-asyncapi', context.mode, { createdFiles: [outPath], updatedFiles: [] })
	},
}

export const exportScheduleManifestCommand: PuristaExecutableCommand<
	ExportDefinitionsInput,
	ExportDefinitionsResolved
> = {
	id: 'export-schedule-manifest',
	resolve: input => resolveDefinitionsExport('export-schedule-manifest', input),
	execute: async (input, context) => {
		const definitions = await readDefinitions(context.cwd, input.definitions)
		const document = await exportScheduleManifest({
			title: input.title,
			version: input.version,
			services: definitions,
		})
		const outPath = resolvePath(context.cwd, input.out)
		await writeJsonFile(outPath, document)
		return createResult('export-schedule-manifest', context.mode, { createdFiles: [outPath], updatedFiles: [] })
	},
}

export const exportRuntimeCapabilitiesCommand: PuristaExecutableCommand<
	ExportRuntimeCapabilitiesInput,
	ExportRuntimeCapabilitiesResolved
> = {
	id: 'export-runtime-capabilities',
	resolve: async input => {
		const parsed = exportRuntimeCapabilitiesInputSchema.safeParse(input)
		if (!parsed.success) {
			return createPendingResolution<ExportRuntimeCapabilitiesInput, ExportRuntimeCapabilitiesResolved>(
				'export-runtime-capabilities',
				input,
				[],
				createIssuesFromZod(parsed.error),
			)
		}
		return createPendingResolution<ExportRuntimeCapabilitiesInput, ExportRuntimeCapabilitiesResolved>(
			'export-runtime-capabilities',
			input,
			[],
			[],
			[],
			parsed.data,
		)
	},
	execute: async (input, context) => {
		const report = exportRuntimeCapabilities({
			mode: input.mode,
			eventBridge: getDeclaredEventBridge(context.puristaConfig?.eventBridge),
			queueBridge: getDeclaredQueueBridge(),
		})
		const outPath = resolvePath(context.cwd, input.out)
		await writeJsonFile(outPath, report)
		return createResult('export-runtime-capabilities', context.mode, { createdFiles: [outPath], updatedFiles: [] })
	},
}

export const exportCloudEventsSchemaCommand: PuristaExecutableCommand<
	ExportCloudEventsSchemaInput,
	ExportCloudEventsSchemaResolved
> = {
	id: 'export-cloudevents-schema',
	resolve: async input => {
		const parsed = exportCloudEventsSchemaInputSchema.safeParse(input)
		if (!parsed.success) {
			return createPendingResolution<ExportCloudEventsSchemaInput, ExportCloudEventsSchemaResolved>(
				'export-cloudevents-schema',
				input,
				[],
				createIssuesFromZod(parsed.error),
			)
		}
		return createPendingResolution<ExportCloudEventsSchemaInput, ExportCloudEventsSchemaResolved>(
			'export-cloudevents-schema',
			input,
			[],
			[],
			[],
			parsed.data,
		)
	},
	execute: async (input, context) => {
		const outPath = resolvePath(context.cwd, input.out)
		await writeJsonFile(outPath, exportCloudEventsSchema())
		return createResult('export-cloudevents-schema', context.mode, { createdFiles: [outPath], updatedFiles: [] })
	},
}

const getDeclaredEventBridge = (eventBridge?: string) => {
	if (eventBridge === 'default' || !eventBridge) {
		return {
			name: 'DefaultEventBridge',
			capabilities: {
				supportsStreams: true,
				durableCommands: false,
				durableSubscriptions: false,
				manualAckSupported: false,
				lateResponseHandling: EventBridgeLateResponseHandling.IgnoreWithWarning,
				gracefulDrainSupported: true,
				nativeDeadLettering: false,
				commandHandling: {
					transport: EventBridgeCommandTransport.InMemory,
					pendingInvocationCancellation: true,
					responseConfirmation: EventBridgeResponseConfirmationLevel.None,
					strictMode: true,
				},
				streamHandling: {
					incrementalDelivery: true,
					consumerCancellation: true,
					gracefulStreamDrain: true,
					aggregatedFinalSupported: true,
					lateFrameHandling: EventBridgeStreamLateFrameHandling.IgnoreWithWarning,
				},
				consumerFailureHandling: {
					boundedRetry: false,
					delayedRetry: false,
					deadLetterTarget: false,
					drop: false,
					stopConsumer: false,
					consumerPauseResume: false,
					bridgeManagedDeadLettering: false,
					nativeDeadLettering: false,
					fatalClassification: false,
					strictMode: true,
				},
			},
		}
	}

	return { name: eventBridge }
}

const getDeclaredQueueBridge = () => ({
	name: 'DefaultQueueBridge',
	capabilities: {
		delayedDelivery: true,
		fifoOrdering: true,
		partitions: false,
		priorities: false,
		deadLetterNative: false,
		exactlyOnce: false,
		maxBatchSize: 1,
		defaultDeadLetterPrefix: '',
		defaultDeadLetterSuffix: '.dead-letter',
		deadLetterInspectable: true,
		deadLetterInspectSupported: true,
		deadLetterReplaySupported: true,
		deadLetterPurgeSupported: true,
		leaseInspectionSupported: false,
		idempotencyEnforcement: false,
		partitionOrdering: false,
		providerManagedDelayedDelivery: false,
		strictStartupValidation: true,
	},
})
