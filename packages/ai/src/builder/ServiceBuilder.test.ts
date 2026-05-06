import { describe, expectTypeOf, it } from 'vitest'
import type { ModelProviderForCapabilities } from '../providers/runtime/ModelProvider.js'
import { ServiceBuilder } from './ServiceBuilder.js'

describe('ServiceBuilder ai model typing', () => {
	it('infers ai.model keys from added agent definitions', () => {
		const serviceBuilder = new ServiceBuilder({
			serviceName: 'support',
			serviceVersion: '1',
			serviceDescription: 'Support service',
		})

		const agentDefinitionPromise = serviceBuilder
			.getAgentQueueBuilder('triage', 'Triage support requests', 'support.triage.completed')
			.addModel('openai:gpt-4o-mini', { capabilities: ['text', 'object'] })
			.setAgentFunction(async function () {
				return { message: 'ok' }
			})
			.getDefinition()

		const typedBuilder = serviceBuilder.addAgentDefinition(agentDefinitionPromise)

		const modelProvider: ModelProviderForCapabilities<['text', 'object']> = {
			name: 'mock',
			capabilities: { text: true, object: true },
			generateText: async () => 'ok',
			generateObject: async () => ({ data: { ok: true } as never, text: '{"ok":true}' }),
		}

		const validOptions = {
			ai: {
				model: {
					'openai:gpt-4o-mini': modelProvider,
				},
			},
		}

		typedBuilder.getInstance({} as never, validOptions)

		const invalidOptions = {
			ai: {
				model: {
					'anthropic:claude-3-5-sonnet': modelProvider,
				},
			},
		}
		// @ts-expect-error model alias must be inferred from agent builder declarations
		typedBuilder.getInstance({} as never, invalidOptions)
	})

	it('narrows handler model methods from declared capabilities', () => {
		const serviceBuilder = new ServiceBuilder({
			serviceName: 'support',
			serviceVersion: '1',
			serviceDescription: 'Support service',
		})

		serviceBuilder
			.getAgentQueueBuilder('triage', 'Triage support requests')
			.addModel('openai:gpt-4o-mini', { capabilities: ['text', 'object'] })
			.setAgentFunction(async function (context) {
				expectTypeOf(context.ai.models['openai:gpt-4o-mini'].generateObject).toBeFunction()
				// @ts-expect-error streamText is not declared for a text+object model
				context.ai.models['openai:gpt-4o-mini'].streamText
				return { message: 'ok' }
			})
	})

	it('passes the shorthand success event into the attached-agent manifest', async () => {
		const serviceBuilder = new ServiceBuilder({
			serviceName: 'support',
			serviceVersion: '1',
			serviceDescription: 'Support service',
		})

		const definition = await serviceBuilder
			.getAgentQueueBuilder('triage', 'Triage support requests', 'support.triage.completed')
			.setAgentFunction(async function () {
				return { message: 'ok' }
			})
			.getDefinition()

		expectTypeOf(definition.manifest.successEventName).toEqualTypeOf<string | undefined>()
	})
})
