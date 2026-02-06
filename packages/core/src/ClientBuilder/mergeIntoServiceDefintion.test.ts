import type { FullServiceDefinition } from '../helper/types/FullServiceDefinition.js'
import { mergeIntoServiceDefintion } from './mergeIntoServiceDefintion.impl.js'

describe('mergeIntoServiceDefintion', () => {
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

		expect(() => mergeIntoServiceDefintion(current, add)).not.toThrow()
		expect(current.UserService['1']).toBeDefined()
		expect(current.UserService['2']).toBeDefined()
		expect(current.UserService['2'].description).toBe('v2')
	})

	it('merges definitions for an existing service version', () => {
		type CommandEntry = FullServiceDefinition[string][string]['commands'][string]
		type SubscriptionEntry = FullServiceDefinition[string][string]['subscriptions'][string]

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
				},
			},
		}

		mergeIntoServiceDefintion(current, add)

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
	})
})
