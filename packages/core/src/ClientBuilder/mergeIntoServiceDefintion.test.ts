import type { FullServiceDefinition } from '../helper/types/FullServiceDefinition.js'
import { mergeIntoServiceDefinition, mergeIntoServiceDefintion } from './mergeIntoServiceDefinition.impl.js'

describe('mergeIntoServiceDefinition', () => {
	it('adds missing service versions without throwing', () => {
		const current: FullServiceDefinition = {
			UserService: {
				'1': {
					description: 'v1',
					deprecated: false,
					commands: {},
					subscriptions: {},
				},
			},
		}

		const add: FullServiceDefinition = {
			UserService: {
				'2': {
					description: 'v2',
					deprecated: false,
					commands: {},
					subscriptions: {},
				},
			},
		}

		expect(() => mergeIntoServiceDefinition(current, add)).not.toThrow()
		expect(current.UserService['1']).toBeDefined()
		expect(current.UserService['2']).toBeDefined()
		expect(current.UserService['2'].description).toBe('v2')
	})

	it('merges definitions for an existing service version', () => {
		type CommandEntry = FullServiceDefinition[string][string]['commands'][string]
		type SubscriptionEntry = FullServiceDefinition[string][string]['subscriptions'][string]
		type StreamEntry = NonNullable<FullServiceDefinition[string][string]['streams']>[string]
		type QueueEntry = NonNullable<FullServiceDefinition[string][string]['queues']>[string]
		type QueueWorkerEntry = NonNullable<FullServiceDefinition[string][string]['queueWorkers']>[string]
		type ScheduleEntry = NonNullable<FullServiceDefinition[string][string]['schedules']>[string]
		type EventToQueueBindingEntry = NonNullable<FullServiceDefinition[string][string]['eventToQueueBindings']>[number]

		const current: FullServiceDefinition = {
			UserService: {
				'1': {
					description: 'current',
					deprecated: false,
					commands: {
						currentCommand: { commandName: 'currentCommand' } as CommandEntry,
					},
					subscriptions: {
						currentSubscription: { subscriptionName: 'currentSubscription' } as SubscriptionEntry,
					},
					streams: {
						currentStream: { streamName: 'currentStream' } as StreamEntry,
					},
					queues: {
						currentQueue: { queueName: 'currentQueue' } as QueueEntry,
					},
					queueWorkers: {
						currentWorker: { name: 'currentWorker' } as unknown as QueueWorkerEntry,
					},
					schedules: {
						currentSchedule: { name: 'currentSchedule' } as ScheduleEntry,
					},
					eventToQueueBindings: [{ name: 'currentBinding' } as unknown as EventToQueueBindingEntry],
				},
			},
		}

		const add: FullServiceDefinition = {
			UserService: {
				'1': {
					description: 'incoming',
					deprecated: true,
					commands: {
						incomingCommand: { commandName: 'incomingCommand' } as CommandEntry,
					},
					subscriptions: {
						incomingSubscription: { subscriptionName: 'incomingSubscription' } as SubscriptionEntry,
					},
					streams: {
						incomingStream: { streamName: 'incomingStream' } as StreamEntry,
					},
					queues: {
						incomingQueue: { queueName: 'incomingQueue' } as QueueEntry,
					},
					queueWorkers: {
						incomingWorker: { name: 'incomingWorker' } as unknown as QueueWorkerEntry,
					},
					schedules: {
						incomingSchedule: { name: 'incomingSchedule' } as ScheduleEntry,
					},
					eventToQueueBindings: [{ name: 'incomingBinding' } as unknown as EventToQueueBindingEntry],
				},
			},
		}

		mergeIntoServiceDefinition(current, add)

		expect(current.UserService['1'].description).toBe('current')
		expect(current.UserService['1'].deprecated).toBe(false)
		expect(current.UserService['1'].commands).toMatchObject({
			currentCommand: { commandName: 'currentCommand' },
			incomingCommand: { commandName: 'incomingCommand' },
		})
		expect(current.UserService['1'].subscriptions).toMatchObject({
			currentSubscription: { subscriptionName: 'currentSubscription' },
			incomingSubscription: { subscriptionName: 'incomingSubscription' },
		})
		expect(current.UserService['1'].streams).toMatchObject({
			currentStream: { streamName: 'currentStream' },
			incomingStream: { streamName: 'incomingStream' },
		})
		expect(current.UserService['1'].queues).toMatchObject({
			currentQueue: { queueName: 'currentQueue' },
			incomingQueue: { queueName: 'incomingQueue' },
		})
		expect(current.UserService['1'].queueWorkers).toMatchObject({
			currentWorker: { name: 'currentWorker' },
			incomingWorker: { name: 'incomingWorker' },
		})
		expect(current.UserService['1'].schedules).toMatchObject({
			currentSchedule: { name: 'currentSchedule' },
			incomingSchedule: { name: 'incomingSchedule' },
		})
		expect(current.UserService['1'].eventToQueueBindings).toMatchObject([
			{ name: 'incomingBinding' },
			{ name: 'currentBinding' },
		])
	})

	it('keeps deprecated alias for backward compatibility', () => {
		expect(mergeIntoServiceDefintion).toBe(mergeIntoServiceDefinition)
	})
})
