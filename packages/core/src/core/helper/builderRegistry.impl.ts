import { assertNonArrowFunction } from './assertNonArrowFunction.impl.js'

export const mergeNamedHooks = <THook extends (...args: never[]) => unknown>(
	existing: Record<string, THook>,
	hooks: Record<string, THook>,
	label: string,
) => {
	for (const [name, hook] of Object.entries(hooks)) {
		assertNonArrowFunction(hook, `${label}.${name}`)
	}

	return {
		...existing,
		...hooks,
	}
}

export const getNamedHook = <THook>(hooks: Record<string, THook>, name: keyof typeof hooks) => hooks[name]

type InvokeSchemaConfig = {
	outputSchema?: unknown
	payloadSchema?: unknown
	parameterSchema?: unknown
}

export const registerInvokeCapability = <
	TExisting extends Record<string, Record<string, Record<string, InvokeSchemaConfig>>>,
>(
	existing: TExisting,
	serviceName: string,
	serviceVersion: string,
	serviceTarget: string,
	config: InvokeSchemaConfig,
) => {
	if (serviceName.trim() === '' || serviceVersion.trim() === '' || serviceTarget.trim() === '') {
		throw new Error('canInvoke requires non-empty service name, version and target')
	}

	return {
		...existing,
		[serviceName]: {
			...(existing[serviceName] ?? {}),
			[serviceVersion]: {
				...(existing[serviceName]?.[serviceVersion] ?? {}),
				[serviceTarget]: config,
			},
		},
	}
}

type StreamInvokeSchemaConfig = {
	chunkSchema?: unknown
	finalSchema?: unknown
	payloadSchema?: unknown
	parameterSchema?: unknown
	validateChunk?: boolean
	validateFinal?: boolean
}

export const registerStreamInvokeCapability = <
	TExisting extends Record<string, Record<string, Record<string, StreamInvokeSchemaConfig>>>,
>(
	existing: TExisting,
	serviceName: string,
	serviceVersion: string,
	serviceTarget: string,
	config: StreamInvokeSchemaConfig,
) => {
	if (serviceName.trim() === '' || serviceVersion.trim() === '' || serviceTarget.trim() === '') {
		throw new Error('canConsumeStream requires non-empty service name, version and target')
	}

	return {
		...existing,
		[serviceName]: {
			...(existing[serviceName] ?? {}),
			[serviceVersion]: {
				...(existing[serviceName]?.[serviceVersion] ?? {}),
				[serviceTarget]: config,
			},
		},
	}
}

export const registerEmitSchema = <TExisting extends Record<string, unknown>, EventName extends string>(
	existing: TExisting,
	eventName: EventName,
	schema: unknown,
) => {
	if (eventName.trim() === '') {
		throw new Error('canEmit requires non-empty event name')
	}

	return {
		...existing,
		[eventName]: schema,
	}
}
