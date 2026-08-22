import { describe, expect, it } from 'vitest'

import { createArchitectureManifest, validateArchitectureManifest } from './architectureManifest.js'
import type { FullDefinition } from './types/FullDefinition.js'

const definitions = {
	version: '4.0.0-test',
	services: {
		Billing: {
			'1': {
				description: 'Billing boundaries',
				deprecated: false,
				commands: {
					createInvoice: {
						commandName: 'createInvoice',
						commandDescription: 'Create one invoice',
						eventName: 'billing.invoice.created',
						call: async () => undefined,
						metadata: {},
						hooks: {},
						eventBridgeConfig: {},
						invokes: {},
						streamInvokes: {},
						emitList: { 'billing.invoice.created': {} },
						queueInvokes: {},
					},
				},
				subscriptions: {},
				streams: {},
				queues: {
					invoice: {
						queueName: 'invoice',
						description: 'Create invoice',
						tags: ['billing'],
						deprecated: false,
						workers: [],
						queueBridgeConfig: {},
					},
				},
				queueWorkers: {
					orphan: {
						name: 'orphan',
						queueName: 'absent',
						mode: 'continuous',
						maxParallelHandlers: 1,
						handler: async () => undefined,
						invokes: {},
						streamInvokes: {},
						emitList: {},
						queueInvokes: {},
						agentInvokes: [],
					},
				},
				schedules: {
					monthly: {
						name: 'monthly',
						targetKind: 'event',
						targetName: 'billing.monthly.due',
						expression: { kind: 'cron', value: '0 1 1 * *' },
						concurrencyPolicy: 'allow',
						missedRunPolicy: 'skip',
						enabledByDefault: true,
						providerHints: { token: 'must-not-appear' },
					},
				},
				eventToQueueBindings: [
					{ eventName: 'billing.invoice.created', queueName: 'absent', idempotencyMode: 'advisory' },
				],
				agents: {
					planner: {
						serviceName: 'Billing',
						serviceVersion: '1',
						agentName: 'planner',
						description: 'Plans invoice work',
						runtimeRevision: '1',
						models: {},
						session: { mode: 'ephemeral' },
						execution: { maxAttempts: 1, maxParallelHandlers: 1 },
						streamingMode: 'aggregate',
						allowedCommands: [{ serviceName: 'Unknown', serviceVersion: '1', commandName: 'missing' }],
						allowedAgents: [],
						usedSkills: [{ names: ['billing-policy'], resourceName: 'billing' }],
						builtInTools: false,
					},
				},
			},
		},
	},
} as unknown as FullDefinition

describe('architecture manifest', () => {
	it('creates a stable JSON-safe static view without handlers or provider hints', async () => {
		const manifest = await createArchitectureManifest({ services: definitions })

		expect(manifest).toMatchObject({
			kind: 'purista.architecture',
			definitionVersion: '4.0.0-test',
			services: [
				{
					name: 'Billing',
					commands: [{ name: 'createInvoice', emits: ['billing.invoice.created'] }],
					queues: [{ name: 'invoice' }],
					agents: [{ name: 'planner', usedSkills: ['billing-policy'] }],
				},
			],
		})
		expect(JSON.stringify(manifest)).not.toContain('must-not-appear')
		expect(JSON.stringify(manifest)).not.toContain('handler')
	})

	it('uses JSON Schema persisted in definition metadata without converting it again', async () => {
		const withPersistedSchema = {
			...definitions,
			services: {
				...definitions.services,
				Billing: {
					...definitions.services.Billing,
					'1': {
						...definitions.services.Billing['1'],
						commands: {
							...definitions.services.Billing['1'].commands,
							createInvoice: {
								...definitions.services.Billing['1'].commands.createInvoice,
								metadata: {
									expose: {
										inputPayload: {
											type: 'object',
											properties: { invoiceId: { type: 'string' } },
											required: ['invoiceId'],
										},
									},
								},
							},
						},
					},
				},
			},
		} as unknown as FullDefinition

		const manifest = await createArchitectureManifest({ services: withPersistedSchema })

		expect(manifest.services[0]?.commands[0]?.payloadSchema).toEqual({
			fingerprint: expect.any(String),
		})
	})

	it('emits deterministic static diagnostics and promotes warnings in strict mode', async () => {
		const manifest = await createArchitectureManifest({ services: definitions })
		const diagnostics = validateArchitectureManifest(manifest)

		expect(diagnostics.map(item => item.code)).toEqual([
			'PURISTA_ARCH_AGENT_MODEL_MISSING',
			'PURISTA_ARCH_EVENT_QUEUE_BINDING_UNKNOWN_QUEUE',
			'PURISTA_ARCH_QUEUE_WORKER_UNKNOWN_QUEUE',
			'PURISTA_ARCH_AGENT_COMMAND_TOOL_UNKNOWN',
		])
		expect(validateArchitectureManifest(manifest, { strict: true })).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ code: 'PURISTA_ARCH_AGENT_COMMAND_TOOL_UNKNOWN', severity: 'error' }),
			]),
		)
	})
})
