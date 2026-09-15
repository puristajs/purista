import { defineAgent, defineWorkflow, type Schema } from '@purista/harness'
import { defineHostTool } from '@purista/harness/integrator'
import { z } from 'zod'

import type { PuristaMetricContext } from '../core/types/PuristaMetrics.js'
import { ServiceBuilder } from '../ServiceBuilder/ServiceBuilder.impl.js'
import type { HarnessInvocationContract } from './invocation.js'

const serviceInfo = {
	serviceName: 'Records',
	serviceVersion: '1',
	serviceDescription: 'Records service',
} as const

function descriptorValues(root: unknown): unknown[] {
	const values: unknown[] = []
	const pending = [root]
	const seen = new WeakSet<object>()
	while (pending.length > 0) {
		const current = pending.pop()
		if ((typeof current !== 'object' || current === null) && typeof current !== 'function') continue
		if (seen.has(current)) continue
		seen.add(current)
		for (const key of Reflect.ownKeys(current)) {
			const descriptor = Object.getOwnPropertyDescriptor(current, key)
			if (!descriptor || !('value' in descriptor)) continue
			values.push(descriptor.value)
			pending.push(descriptor.value)
		}
	}
	return values
}

function exposesUsableOwner(root: unknown): boolean {
	return descriptorValues(root).some(value => {
		try {
			defineHostTool(value as never, 'reflectedOwnerProbe', {
				description: 'Probe.',
				input: z.string(),
				output: z.string(),
				async handler(_context, input) {
					return input
				},
			})
			return true
		} catch {
			return false
		}
	})
}

describe('ServiceBuilder.defineTool', () => {
	it('does not expose its owner, registration callback, or mutable declarations through reflection', () => {
		const builder = new ServiceBuilder(serviceInfo).defineTool('privateBuilder', {
			description: 'Keep declaration state private.',
			input: z.string(),
			output: z.string(),
		})
		expect(Reflect.ownKeys(builder)).toEqual([])
		expect(exposesUsableOwner(builder)).toBe(false)
		expect(
			Object.values(Object.getOwnPropertyDescriptors(builder)).some(descriptor => {
				return 'value' in descriptor && typeof descriptor.value === 'function'
			}),
		).toBe(false)
	})

	it('returns the final frozen Harness host tool and retains exact declared context types', () => {
		const outputSchema = z.object({ value: z.string() })
		const payloadSchema = z.object({ id: z.string() })
		const parameterSchema = z.object({ requestId: z.string() })
		const eventSchema = z.object({ id: z.string() })
		const childAgent = defineAgent('childAgent', {
			model: 'chat',
			input: z.object({ question: z.string() }),
			output: z.object({ answer: z.string() }),
			instructions: 'Answer.',
			prompt: input => ({ role: 'user', content: input.question }),
		})
		const childWorkflow = defineWorkflow('childWorkflow', {
			input: z.object({ task: z.string() }),
			output: z.object({ result: z.string() }),
			handler: async ({ input }) => ({ result: input.task }),
		})

		const definition = new ServiceBuilder(serviceInfo)
			.defineResource<'records', { prefix: string }>()
			.defineMetric('records.lookups', { kind: 'counter', unit: '{lookup}', description: 'Record lookups' })
			.defineTool('lookupRecord', {
				description: 'Look up one record.',
				input: z.object({ id: z.string() }),
				output: outputSchema,
			})
			.canInvoke('Records', '1', 'load', outputSchema, payloadSchema, parameterSchema)
			.canConsumeStream('Records', '1', 'watch', z.string(), payloadSchema, parameterSchema, z.string())
			.canEnqueue('records.audit', payloadSchema, parameterSchema)
			.canEmit('record.loaded', eventSchema)
			.canInvokeAgent('Agents', '1', childAgent.contract)
			.canInvokeWorkflow('Workflows', '1', childWorkflow.contract)
			.setHandler(async (context, input) => {
				expectTypeOf(context.resources.records.prefix).toEqualTypeOf<string>()
				expectTypeOf(context.metrics).toEqualTypeOf<
					PuristaMetricContext<{
						'records.lookups': {
							kind: 'counter'
							unit: '{lookup}'
							description: 'Record lookups'
						}
					}>
				>()
				const loaded = await context.service.Records['1'].load({ id: input.id }, { requestId: context.tool.callId })
				const agentResult = await context.agent.Agents['1'].childAgent.run(
					{ question: loaded.value },
					{ callId: 'agent-child' },
				)
				const workflowResult = await context.workflow.Workflows['1'].childWorkflow.run(
					{ task: agentResult.answer },
					{ callId: 'workflow-child' },
				)
				// @ts-expect-error progressive nested target clients are intentionally unavailable
				context.agent.Agents['1'].childAgent.stream
				// @ts-expect-error undeclared commands are unavailable
				context.service.Records['1'].remove
				// @ts-expect-error undeclared streams are unavailable
				context.stream.Records['1'].remove
				// @ts-expect-error undeclared queues are unavailable
				context.queue.enqueue['records.missing']
				// @ts-expect-error undeclared events are unavailable
				context.emit('record.missing', { id: input.id })
				// @ts-expect-error undeclared resources are unavailable
				context.resources.missing
				// @ts-expect-error undeclared target clients are unavailable
				context.workflow.Workflows['1'].missing
				return { value: workflowResult.result }
			})

		expect(definition).toMatchObject({
			kind: 'tool',
			id: 'lookupRecord',
			description: 'Look up one record.',
		})
		expect(Object.isFrozen(definition)).toBe(true)
		expect(exposesUsableOwner(definition)).toBe(false)
		expect(Object.keys(definition).sort()).toEqual(['description', 'handler', 'id', 'input', 'kind', 'output'])
		expect('getDefinition' in definition).toBe(false)
		expect('invokes' in definition).toBe(false)
		expectTypeOf(definition.$infer.input).toEqualTypeOf<{ id: string }>()
		expectTypeOf(definition.$infer.output).toEqualTypeOf<{ value: string }>()
		const targetBuilder = new ServiceBuilder(serviceInfo).defineTool('aliasedChild', {
			description: 'Invalid.',
			input: z.string(),
			output: z.string(),
		})
		const invalidAliasArguments: Parameters<typeof targetBuilder.canInvokeAgent> = [
			// @ts-expect-error target aliases are removed; serviceTarget is always contract.id
			'Agents',
			'1',
			'alias',
			childAgent.contract,
		]
		void invalidAliasArguments
	})

	it('rejects copied and wrong-kind nested target contracts before registration', () => {
		const agent = defineAgent('authenticAgent', {
			model: 'chat',
			instructions: 'Answer.',
		})
		const workflow = defineWorkflow('authenticWorkflow', {
			async handler() {
				return 'done'
			},
		})
		const builder = new ServiceBuilder(serviceInfo).defineTool('targetCheck', {
			description: 'Check targets.',
			input: z.string(),
			output: z.string(),
		})
		expect(() => builder.canInvokeAgent('Agents', '1', { ...agent.contract } as never)).toThrow(
			'authentic Harness target contract',
		)
		expect(() => builder.canInvokeAgent('Agents', '1', workflow.contract as never)).toThrow(
			'requires an agent contract',
		)
		expect(() => builder.canInvokeWorkflow('Workflows', '1', agent.contract as never)).toThrow(
			'requires a workflow contract',
		)
	})

	it('accepts a service-bound Harness target without repeating its address', () => {
		const childAgent = defineAgent('localChild', {
			model: 'chat',
			input: z.object({ question: z.string() }),
			output: z.object({ answer: z.string() }),
			instructions: 'Answer.',
			prompt: input => ({ role: 'user', content: input.question }),
		})
		const builder = new ServiceBuilder(serviceInfo)
		expectTypeOf(builder.info.serviceName).toEqualTypeOf<'Records'>()
		expectTypeOf(builder.info.serviceVersion).toEqualTypeOf<'1'>()
		const target = builder.harnessTarget(childAgent.contract)
		expectTypeOf<HarnessInvocationContract<typeof target>>().toEqualTypeOf<typeof childAgent.contract>()
		expectTypeOf(target.address.serviceName).toEqualTypeOf<'Records'>()
		expectTypeOf(target.address.serviceVersion).toEqualTypeOf<'1'>()
		const tool = builder
			.defineTool('askLocalChild', {
				description: 'Ask the locally mounted child agent.',
				input: z.object({ question: z.string() }),
				output: z.object({ answer: z.string() }),
			})
			.canInvokeAgent(target)
			.setHandler(async (context, input) => {
				const answer = await context.agent.Records['1'].localChild.run(input, { callId: 'local-child' })
				expectTypeOf(answer.answer).toEqualTypeOf<string>()
				return answer
			})

		expect(tool.id).toBe('askLocalChild')
		expect(Object.isFrozen(tool)).toBe(true)
	})

	it('rejects schemas that are not a defined model JSON boundary', () => {
		const builder = new ServiceBuilder(serviceInfo)
		const validationOnly: Schema<string, string> = z.string()
		builder.defineTool('validationOnlyTool', {
			description: 'Invalid model input.',
			// @ts-expect-error host-tool input must implement ModelSchema JSON projection
			input: validationOnly,
			output: z.string(),
		})
		builder.defineTool('invalidTool', {
			description: 'Invalid.',
			// @ts-expect-error optional root input is not a defined model JSON boundary
			input: z.string().optional(),
			output: z.string(),
		})
	})
})
