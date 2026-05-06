import { describe, expect, it } from 'vitest'
import { mergeServiceDefinition } from './exportServiceDefinitions.js'
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
})
