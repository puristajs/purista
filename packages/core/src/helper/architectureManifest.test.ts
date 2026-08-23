import { describe, expect, it } from 'vitest'

import {
	compareArchitectureManifests,
	createArchitectureContext,
	createArchitectureManifest,
	getArchitectureManifestDigest,
	renderArchitectureContextMarkdown,
	validateArchitectureComposition,
	validateArchitectureManifest,
} from './architectureManifest.js'
import type { FullDefinition } from './types/FullDefinition.js'

const customerSchema = {
	type: 'object',
	properties: { customerId: { type: 'string' } },
	required: ['customerId'],
}
const invoiceSchema = {
	type: 'object',
	properties: { invoiceId: { type: 'string' } },
	required: ['invoiceId'],
}

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
						metadata: {
							expose: { inputPayload: customerSchema, parameter: customerSchema, outputPayload: invoiceSchema },
						},
						invokes: {},
						streamInvokes: {},
						queueInvokes: {},
						emitList: { 'billing.invoice.audited': invoiceSchema },
					},
				},
				subscriptions: {
					notify: {
						subscriptionName: 'notify',
						subscriptionDescription: 'Notify customer',
						eventName: 'billing.invoice.created',
						emitEventName: 'billing.notification.sent',
						metadata: {
							expose: { inputPayload: invoiceSchema, parameter: customerSchema, outputPayload: invoiceSchema },
						},
						invokes: {},
						streamInvokes: {},
						queueInvokes: {},
						emitList: {},
					},
				},
				streams: {
					invoiceProgress: {
						streamName: 'invoiceProgress',
						streamDescription: 'Invoice progress',
						finalEventName: 'billing.invoice.completed',
						metadata: {
							expose: {
								inputPayload: customerSchema,
								parameter: customerSchema,
								chunkPayload: invoiceSchema,
								finalPayload: invoiceSchema,
							},
						},
						invokes: {},
						streamInvokes: {},
						queueInvokes: {},
						emitList: {},
						aggregateChunks: true,
						chunkValidationEnabled: true,
						finalValidationEnabled: true,
					},
				},
				queues: {
					invoice: {
						queueName: 'invoice',
						description: 'Create invoice',
						tags: ['billing'],
						deprecated: false,
						workers: [],
						queueBridgeConfig: {},
						payloadSchema: invoiceSchema,
						parameterSchema: customerSchema,
					},
				},
				queueWorkers: {
					invoiceWorker: {
						name: 'invoiceWorker',
						queueName: 'invoice',
						mode: 'continuous',
						maxParallelHandlers: 1,
						invokes: {},
						streamInvokes: {},
						queueInvokes: {},
						emitList: { 'billing.invoice.processed': invoiceSchema },
						agentInvokes: [],
					},
					orphan: {
						name: 'orphan',
						queueName: 'absent',
						mode: 'continuous',
						maxParallelHandlers: 1,
						invokes: {},
						streamInvokes: {},
						queueInvokes: {},
						emitList: {},
						agentInvokes: [],
					},
				},
				schedules: {
					monthly: {
						name: 'monthly',
						targetKind: 'event',
						targetName: 'billing.monthly.due',
						payloadSchema: invoiceSchema,
						parameterSchema: customerSchema,
						expression: { kind: 'cron', value: '0 1 1 * *' },
						concurrencyPolicy: 'allow',
						missedRunPolicy: 'skip',
						enabledByDefault: true,
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
	it('creates a stable graph with role-specific schemas and no opaque runtime values', async () => {
		const manifest = await createArchitectureManifest({ services: definitions, schemaMode: 'full' })
		const again = await createArchitectureManifest({ services: definitions, schemaMode: 'full' })

		expect(manifest).toMatchObject({
			kind: 'purista.architecture',
			version: '1.0.0',
			definitionVersion: '4.0.0-test',
			digest: expect.any(String),
		})
		expect(again.digest).toBe(manifest.digest)
		expect(getArchitectureManifestDigest(JSON.parse(JSON.stringify(manifest)))).toBe(manifest.digest)
		expect(manifest.components).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					id: 'command:Billing/1/createInvoice',
					contracts: expect.objectContaining({
						payload: expect.any(Object),
						parameter: expect.any(Object),
						result: expect.any(Object),
					}),
				}),
				expect.objectContaining({
					id: 'stream:Billing/1/invoiceProgress',
					contracts: expect.objectContaining({ chunk: expect.any(Object), final: expect.any(Object) }),
				}),
				expect.objectContaining({ id: 'event:billing.invoice.audited' }),
			]),
		)
		expect(manifest.relations).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					kind: 'emits',
					from: 'command:Billing/1/createInvoice',
					to: 'event:billing.invoice.audited',
					contracts: { payload: expect.any(Object) },
				}),
				expect.objectContaining({
					kind: 'consumes',
					from: 'event:billing.invoice.created',
					to: 'subscription:Billing/1/notify',
				}),
			]),
		)
		expect(JSON.stringify(manifest)).not.toContain('handler')
		expect(JSON.stringify(manifest.schemas)).toContain('jsonSchema')
	})

	it('reports deterministic diagnostics and treats an event schedule as its event producer', async () => {
		const manifest = await createArchitectureManifest({ services: definitions })
		const diagnostics = validateArchitectureManifest(manifest)
		expect(diagnostics.map(item => item.code)).toEqual([
			'PURISTA_ARCH_AGENT_MODEL_MISSING',
			'PURISTA_ARCH_EVENT_QUEUE_BINDING_UNKNOWN_QUEUE',
			'PURISTA_ARCH_QUEUE_WORKER_UNKNOWN_QUEUE',
			'PURISTA_ARCH_AGENT_COMMAND_TOOL_UNKNOWN',
		])
		expect(manifest.relations).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					kind: 'scheduleTarget',
					to: 'event:billing.monthly.due',
					resolution: 'resolved',
				}),
			]),
		)
	})

	it('renders bounded deterministic agent context without unrelated schemas', async () => {
		const manifest = await createArchitectureManifest({ services: definitions, schemaMode: 'full' })
		const context = createArchitectureContext(manifest, {
			scope: ['command:createInvoice'],
			depth: 1,
			schemaMode: 'referenced',
		})
		expect(context.components.map(component => component.id)).toContain('command:Billing/1/createInvoice')
		expect(context.scope.omittedComponentCount).toBeGreaterThan(0)
		expect(renderArchitectureContextMarkdown(context)).toContain('PURISTA architecture context')
		expect(createArchitectureContext(manifest, { scope: ['missing:thing'] }).diagnostics).toEqual(
			expect.arrayContaining([expect.objectContaining({ code: 'PURISTA_ARCH_SCOPE_UNKNOWN' })]),
		)
	})

	it('reports conservative contract changes and validates pinned offline composition', async () => {
		const base = await createArchitectureManifest({ services: definitions })
		const changed = structuredClone(base)
		changed.components = changed.components.filter(component => component.id !== 'command:Billing/1/createInvoice')
		changed.digest = ''
		const changes = compareArchitectureManifests(base, changed, { strict: true })
		expect(changes).toEqual(
			expect.arrayContaining([expect.objectContaining({ code: 'PURISTA_ARCH_CONTRACT_COMPONENT_REMOVED' })]),
		)

		const unresolved = base.relations.find(relation => relation.kind === 'agentCommandTool')
		expect(unresolved).toBeDefined()
		const composition = {
			kind: 'purista.architecture.composition',
			version: '1.0.0',
			artifacts: [{ id: 'billing', digest: base.digest }],
			bindings: [{ from: unresolved?.id ?? '', to: 'command:Billing/1/createInvoice' }],
		} as const
		expect(validateArchitectureComposition(composition, { billing: base })).toEqual([])
		expect(
			validateArchitectureComposition(
				{ ...composition, artifacts: [{ id: 'billing', digest: 'wrong' }] },
				{ billing: base },
			),
		).toEqual(
			expect.arrayContaining([expect.objectContaining({ code: 'PURISTA_ARCH_COMPOSITION_ARTIFACT_DIGEST_MISMATCH' })]),
		)

		const externalScheduleArtifact = structuredClone(base)
		externalScheduleArtifact.relations = externalScheduleArtifact.relations.map(relation =>
			relation.kind === 'scheduleTarget' ? { ...relation, resolution: 'unresolved' as const } : relation,
		)
		externalScheduleArtifact.digest = getArchitectureManifestDigest(externalScheduleArtifact)
		const scheduleRelation = externalScheduleArtifact.relations.find(relation => relation.kind === 'scheduleTarget')
		expect(scheduleRelation).toBeDefined()
		expect(
			validateArchitectureComposition(
				{
					...composition,
					artifacts: [{ id: 'billing', digest: externalScheduleArtifact.digest }],
					bindings: [{ from: scheduleRelation?.id ?? '', to: 'command:Billing/1/createInvoice' }],
				},
				{ billing: externalScheduleArtifact },
			),
		).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ code: 'PURISTA_ARCH_COMPOSITION_SCHEMA_COMPATIBILITY_UNKNOWN' }),
			]),
		)
	})
})
