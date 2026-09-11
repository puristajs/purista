import {
	type AnyHarnessTargetContract,
	defineAgent,
	defineHarness,
	defineWorkflow,
	type HarnessDefinition,
	type JsonValue,
	type ModelSchema,
} from '@purista/harness'
import { FakeModelProvider } from '@purista/harness/testing'
import { getNewCorrelationId } from '../core/helper/getNewCorrelationId.impl.js'
import { DefaultEventBridge } from '../DefaultEventBridge/DefaultEventBridge.impl.js'
import { getCommandMessageMock } from '../mocks/messages/getCommandMessage.mock.js'
import { ServiceBuilder } from '../ServiceBuilder/ServiceBuilder.impl.js'
import { createMountedHarnessTargetProjections } from './projection.js'
import type { HarnessDefinitionMountPolicy, MountedHarnessTargetProjection } from './types.js'

export const mountedServiceName = 'Harness'
export const mountedServiceVersion = '1'
export const rootTargetName = 'echo'
export const dependencyTargetName = 'privateLookup'

export const rootAddress = Object.freeze({
	serviceName: mountedServiceName,
	serviceVersion: mountedServiceVersion,
	serviceTarget: rootTargetName,
})

export const dependencyAddress = Object.freeze({
	serviceName: mountedServiceName,
	serviceVersion: mountedServiceVersion,
	serviceTarget: dependencyTargetName,
})

export function generatedModelSchema<Input extends JsonValue, Output extends JsonValue>(
	inputJsonSchema: Readonly<Record<string, unknown>> | boolean,
	outputJsonSchema: Readonly<Record<string, unknown>> | boolean = inputJsonSchema,
	transform: (value: Input) => Output = value => value as unknown as Output,
): ModelSchema<Input, Output> {
	const schema = { marker: 'p4-004-fixture' }
	Object.defineProperty(schema, '~standard', {
		enumerable: false,
		value: Object.freeze({
			version: 1,
			vendor: 'p4-004-fixture',
			validate(value: unknown) {
				return { value: transform(value as Input) }
			},
			types: undefined as unknown as { input: Input; output: Output },
			jsonSchema: Object.freeze({ input: () => inputJsonSchema, output: () => outputJsonSchema }),
		}),
	})
	return schema as unknown as ModelSchema<Input, Output>
}

export const valueSchema = generatedModelSchema<{ value: string }, { value: string }>({
	type: 'object',
	additionalProperties: false,
	required: ['value'],
	properties: { value: { type: 'string' } },
})

export const dependencyAgent = defineAgent(dependencyTargetName, {
	model: 'chat',
	instructions: 'Return the supplied value.',
	input: valueSchema,
	output: valueSchema,
	prompt: input => ({ role: 'user', content: input.value }),
})

export const rootWorkflow = defineWorkflow(rootTargetName, {
	input: valueSchema,
	output: valueSchema,
	agents: [dependencyAgent],
	async handler(context) {
		return context.input
	},
})

type AnyDefinition = HarnessDefinition<any, any, any>
export const mountedHarness: AnyDefinition = defineHarness({
	name: 'mountedRuntime',
	revision: 'mounted-runtime-r1',
}).addWorkflow(rootWorkflow) as unknown as AnyDefinition

export type AnyMountPolicy = HarnessDefinitionMountPolicy<AnyDefinition, Record<string, unknown>>

export function projectionsFor(
	definition: unknown = mountedHarness,
	policy?: unknown,
): readonly MountedHarnessTargetProjection<AnyHarnessTargetContract>[] {
	return createMountedHarnessTargetProjections(
		definition as never,
		{
			serviceName: mountedServiceName,
			serviceVersion: mountedServiceVersion,
			...(policy === undefined ? {} : { policy }),
		} as never,
	)
}

export function rootEnvelope(
	definition: unknown = mountedHarness,
	policy?: unknown,
	sessionId = 'session-1',
	targetName = rootTargetName,
) {
	const projection = projectionsFor(definition, policy).find(
		entry => entry.visibility === 'root' && entry.target.id === targetName,
	)
	if (!projection) throw new Error(`Expected root projection ${targetName}.`)
	return Object.freeze({
		contract: Object.freeze({ schemaVersion: 1 as const, exportDigest: projection.exportDigest }),
		root: Object.freeze({ invocationId: getNewCorrelationId(), sessionId }),
	})
}

export function rootCommandRequest(
	payload: JsonValue,
	options: Readonly<{
		definition?: unknown
		policy?: unknown
		sessionId?: string
		parameter?: Record<string, unknown>
		tenantId?: string
		principalId?: string
		targetName?: string
	}> = {},
) {
	const targetName = options.targetName ?? rootTargetName
	const message = getCommandMessageMock({
		tenantId: options.tenantId ?? 'tenant-a',
		principalId: options.principalId ?? 'reviewer-a',
		receiver: { ...rootAddress, serviceTarget: targetName },
		payload: { payload, parameter: options.parameter ?? {} },
		harness: rootEnvelope(
			options.definition ?? mountedHarness,
			options.policy,
			options.sessionId ?? 'session-1',
			targetName,
		),
	})
	const {
		id: _id,
		messageType: _messageType,
		timestamp: _timestamp,
		correlationId: _correlationId,
		...request
	} = message
	return request
}

export function mountedBuilder(definition: unknown = mountedHarness, policy?: unknown) {
	const builder = new ServiceBuilder({
		serviceName: mountedServiceName,
		serviceVersion: mountedServiceVersion,
		serviceDescription: 'P4-004 mounted receiver fixture',
	})
	// This helper deliberately crosses the erased-JavaScript test boundary so
	// negative fixtures can supply definitions and policies rejected at runtime.
	return builder.mountHarness(definition as never, policy as never)
}

export async function startMounted(
	options: Readonly<{
		definition?: unknown
		policy?: unknown
		eventBridge?: DefaultEventBridge
		ai?: unknown
	}> = {},
) {
	const eventBridge = options.eventBridge ?? new DefaultEventBridge()
	await eventBridge.start()
	const service = await mountedBuilder(options.definition ?? mountedHarness, options.policy).getInstance(eventBridge, {
		ai: options.ai ?? { models: { chat: { provider: new FakeModelProvider(), model: 'fake' } } },
	} as never)
	await service.start()
	return Object.freeze({ eventBridge, service })
}

export async function stopMounted(mounted: Awaited<ReturnType<typeof startMounted>>): Promise<void> {
	await mounted.service.destroy()
	await mounted.eventBridge.destroy()
}
