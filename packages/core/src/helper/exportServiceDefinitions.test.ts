import { harnessExecutionEventTypesV1 } from '@purista/harness'
import { describe, expect, it } from 'vitest'
import {
	createMountedHarnessServiceExport,
	type MountedHarnessExportProjection,
	mergeServiceDefinition,
} from './exportServiceDefinitions.js'
import type { ServiceDefinitions } from './types/ServiceDefinitions.js'

const createDefinitions = (input: {
	serviceName?: string
	serviceVersion?: string
	serviceDescription?: string
	deprecated?: boolean
	commandNames?: string[]
	subscriptionNames?: string[]
	queueNames?: string[]
	scheduleNames?: string[]
}): ServiceDefinitions => {
	const commands = (input.commandNames ?? []).map(commandName => {
		return { commandName } as ServiceDefinitions['commands'][number]
	})
	const subscriptions = (input.subscriptionNames ?? []).map(subscriptionName => {
		return { subscriptionName } as ServiceDefinitions['subscriptions'][number]
	})
	const queues = (input.queueNames ?? []).map(queueName => {
		return { queueName } as NonNullable<ServiceDefinitions['queues']>[number]
	})
	const schedules = (input.scheduleNames ?? []).map(name => {
		return {
			name,
			targetKind: 'event' as const,
			targetName: `${name}.event`,
			expression: { kind: 'cron' as const, value: '* * * * *' },
			concurrencyPolicy: 'allow' as const,
			missedRunPolicy: 'skip' as const,
			enabledByDefault: true,
		}
	})

	return {
		serviceName: input.serviceName ?? 'UserService',
		serviceVersion: input.serviceVersion ?? '1',
		serviceDescription: input.serviceDescription ?? 'user service',
		deprecated: input.deprecated ?? false,
		commands,
		subscriptions,
		streams: [],
		queues,
		queueWorkers: [],
		schedules,
		eventToQueueBindings: [],
	}
}

describe('mergeServiceDefinition', () => {
	it('keeps existing command and subscription entries when service version is merged again', () => {
		const existing = mergeServiceDefinition(
			{},
			createDefinitions({ commandNames: ['create'], subscriptionNames: ['mail'] }),
		)
		const merged = mergeServiceDefinition(
			existing,
			createDefinitions({ commandNames: ['update'], subscriptionNames: ['audit'] }),
		)

		expect(Object.keys(merged.UserService['1'].commands).sort()).toEqual(['create', 'update'])
		expect(Object.keys(merged.UserService['1'].subscriptions).sort()).toEqual(['audit', 'mail'])
	})

	it('keeps existing metadata while still accepting new definitions', () => {
		const existing = mergeServiceDefinition(
			{},
			createDefinitions({
				serviceDescription: 'original description',
				deprecated: true,
				commandNames: ['create'],
			}),
		)
		const merged = mergeServiceDefinition(
			existing,
			createDefinitions({
				serviceDescription: 'new description',
				deprecated: false,
				commandNames: ['update'],
			}),
		)

		expect(merged.UserService['1'].description).toBe('original description')
		expect(merged.UserService['1'].deprecated).toBe(true)
		expect(Object.keys(merged.UserService['1'].commands).sort()).toEqual(['create', 'update'])
	})

	it('merges queues and schedules into exported service definitions', () => {
		const merged = mergeServiceDefinition(
			{},
			createDefinitions({ queueNames: ['billing.monthlyClosing'], scheduleNames: ['monthlyBillingCycle'] }),
		)

		expect(Object.keys(merged.UserService['1'].queues ?? {})).toEqual(['billing.monthlyClosing'])
		expect(merged.UserService['1'].schedules?.monthlyBillingCycle).toMatchObject({
			targetName: 'monthlyBillingCycle.event',
			targetServiceName: 'UserService',
			targetServiceVersion: '1',
		})
	})

	it('exports only explicit Harness roots as raw callable target definitions', () => {
		const exported = createMountedHarnessServiceExport({
			name: 'support',
			dependencies: {
				tools: ['lookupAccount'],
				skills: ['support-policy'],
				mcpServers: ['crm'],
				agents: ['privateResearcher', 'support'],
				workflows: ['privateEscalation'],
			},
			projections: [
				{
					visibility: 'root',
					policy: { queueName: 'support.answer' },
					targetExport: {
						targetName: 'support',
						kind: 'agent',
						description: 'Answer support questions',
						inputSchema: { type: 'string' },
						validatedInputSchema: { type: 'string' },
						outputSchema: { type: 'object' },
						updateSchema: false,
						interruptSchema: false,
						invocation: { aggregate: true, stream: true, resumableInterrupts: [] },
						stream: {
							protocol: 'harness-execution-events-v1',
							eventTypes: harnessExecutionEventTypesV1,
							outputUpdates: ['text-delta'],
						},
						queue: { name: 'support.answer' },
					},
					exportDigest: 'sha256:root',
					privateTarget: { run: () => 'must not be exported' },
				} as unknown as MountedHarnessExportProjection,
				{
					visibility: 'dependency',
					policy: null,
					targetExport: {
						targetName: 'privateResearcher',
						kind: 'agent',
						inputSchema: { type: 'string' },
						validatedInputSchema: { type: 'string' },
						outputSchema: { type: 'string' },
						updateSchema: false,
						interruptSchema: false,
						invocation: { aggregate: true, stream: true, resumableInterrupts: [] },
						stream: {
							protocol: 'harness-execution-events-v1',
							eventTypes: harnessExecutionEventTypesV1,
							outputUpdates: [],
						},
					},
					exportDigest: 'sha256:dependency',
				},
			],
		})

		expect(exported.agents).toEqual({
			support: expect.objectContaining({
				targetName: 'support',
				exportDigest: 'sha256:root',
				queue: { name: 'support.answer' },
			}),
		})
		expect(exported.workflows).toEqual({})
		expect(exported.agents?.privateResearcher).toBeUndefined()
		expect(exported.harness).toEqual({
			name: 'support',
			roots: { agents: ['support'], workflows: [] },
			dependencies: {
				tools: ['lookupAccount'],
				skills: ['support-policy'],
				mcpServers: ['crm'],
				agents: ['privateResearcher'],
				workflows: ['privateEscalation'],
			},
		})
		expect(JSON.stringify(exported)).not.toContain('must not be exported')
	})

	it('preserves callable Harness maps and the sanitized composition view when definitions are merged', () => {
		const harness = createMountedHarnessServiceExport({
			name: 'support',
			dependencies: { tools: [], skills: [], mcpServers: [], agents: [], workflows: [] },
			projections: [
				{
					visibility: 'root',
					policy: { queueName: null },
					targetExport: {
						targetName: 'support',
						kind: 'agent',
						inputSchema: false,
						validatedInputSchema: false,
						outputSchema: false,
						updateSchema: false,
						interruptSchema: false,
						invocation: { aggregate: true, stream: true, resumableInterrupts: [] },
						stream: {
							protocol: 'harness-execution-events-v1',
							eventTypes: harnessExecutionEventTypesV1,
							outputUpdates: [],
						},
					},
					exportDigest: 'sha256:support',
				},
			],
		})
		const first = mergeServiceDefinition({}, { ...createDefinitions({ commandNames: ['create'] }), ...harness })
		const merged = mergeServiceDefinition(first, createDefinitions({ commandNames: ['update'] }))

		expect(merged.UserService['1'].agents?.support.exportDigest).toBe('sha256:support')
		expect(merged.UserService['1'].harness).toEqual(harness.harness)
	})
})
