import type { ExecutionEvent, HarnessTargetContract, RunOutcome } from '@purista/harness'

import type { InvokeFunction } from '../core/types/InvokeFunction.js'
import type { InvokeList } from '../core/types/InvokeList.js'
import type { OpenStreamFunction } from '../core/types/OpenStreamFunction.js'
import type { StreamInvokeList } from '../core/types/StreamInvokeList.js'
import type { StreamHandle } from '../core/types/stream/StreamHandle.js'
import type { HarnessInvokeParameter } from './runtime.js'

type TargetKind = HarnessTargetContract<'agent' | 'workflow'>['kind']
type AnyTargetContract = HarnessTargetContract<TargetKind, any, any>

/** Type marker carried by a declared aggregate Harness invocation. */
export type HarnessInvokeDeclaration<C extends AnyTargetContract> = ((
	input: C['$infer']['input'],
	options?: HarnessInvokeParameter,
) => Promise<RunOutcome<C['$infer']['output']>>) & {
	readonly __harnessTarget: C
}

/** Type marker carried by a declared streaming Harness invocation. */
export type HarnessStreamDeclaration<C extends AnyTargetContract> = ((
	input: C['$infer']['input'],
	options?: HarnessInvokeParameter,
) => Promise<StreamHandle<ExecutionEvent<C['$infer']['output']>, RunOutcome<C['$infer']['output']>>>) & {
	readonly __harnessTarget: C
}

/** Client for one address-first agent or workflow target. */
export type HarnessTargetClient<C extends AnyTargetContract> = Readonly<{
	/** Run until the target completes or returns a durable interrupt. */
	run(input: C['$infer']['input'], options?: HarnessInvokeParameter): Promise<RunOutcome<C['$infer']['output']>>
	/** Open the target's provider-neutral portable execution stream. */
	stream(
		input: C['$infer']['input'],
		options?: HarnessInvokeParameter,
	): Promise<StreamHandle<ExecutionEvent<C['$infer']['output']>, RunOutcome<C['$infer']['output']>>>
}>

type ContractOf<T, Kind extends TargetKind> = T extends { readonly __harnessTarget: infer C }
	? C extends HarnessTargetContract<Kind, any, any>
		? C
		: never
	: never

type MatchingKeys<T, Kind extends TargetKind> = {
	[K in keyof T]: ContractOf<T[K], Kind> extends never ? never : K
}[keyof T]

type TargetClients<T, Kind extends TargetKind> = {
	[K in MatchingKeys<T, Kind>]: HarnessTargetClient<ContractOf<T[K], Kind>>
}

type VersionClients<T, Kind extends TargetKind> = {
	[K in keyof T as MatchingKeys<T[K], Kind> extends never ? never : K]: TargetClients<T[K], Kind>
}

/** Typed address namespace exposed in PURISTA handler contexts. */
export type HarnessInvocationClients<Invokes extends InvokeList, Kind extends TargetKind> = {
	[K in keyof Invokes as keyof VersionClients<Invokes[K], Kind> extends never ? never : K]: VersionClients<
		Invokes[K],
		Kind
	>
}

/** Register both aggregate and streaming capabilities for one Harness target. */
export function registerHarnessInvocation<C extends AnyTargetContract>(
	invokes: InvokeList,
	streamInvokes: StreamInvokeList,
	serviceName: string,
	serviceVersion: string,
	serviceTarget: string,
	contract: C,
) {
	if (serviceName.trim() === '' || serviceVersion.trim() === '' || serviceTarget.trim() === '') {
		throw new Error(
			`canInvoke${contract.kind === 'agent' ? 'Agent' : 'Workflow'} requires non-empty service name, version and target`,
		)
	}

	return {
		invokes: {
			...invokes,
			[serviceName]: {
				...(invokes[serviceName] ?? {}),
				[serviceVersion]: {
					...(invokes[serviceName]?.[serviceVersion] ?? {}),
					[serviceTarget]: { payloadSchema: contract.input, harnessTarget: contract },
				},
			},
		},
		streamInvokes: {
			...streamInvokes,
			[serviceName]: {
				...(streamInvokes[serviceName] ?? {}),
				[serviceVersion]: {
					...(streamInvokes[serviceName]?.[serviceVersion] ?? {}),
					[serviceTarget]: {
						payloadSchema: contract.input,
						validateChunk: false,
						validateFinal: false,
						harnessTarget: contract,
					},
				},
			},
		},
	}
}

const noop = () => {
	// Proxy target only.
}

/** Build the `context.agent` or `context.workflow` address-first proxy. */
export function createHarnessInvocationProxy<T>(
	invoke: InvokeFunction,
	openStream: OpenStreamFunction,
	address: { serviceName: string; serviceVersion: string; serviceTarget: string } = {
		serviceName: '',
		serviceVersion: '',
		serviceTarget: '',
	},
	level = 0,
): T {
	return new Proxy(noop, {
		get(_target, property) {
			if (typeof property !== 'string' || property === 'then' || property === 'catch' || property === 'finally') {
				return undefined
			}
			if (level === 0) {
				return createHarnessInvocationProxy(invoke, openStream, { ...address, serviceName: property }, level + 1)
			}
			if (level === 1) {
				return createHarnessInvocationProxy(invoke, openStream, { ...address, serviceVersion: property }, level + 1)
			}
			if (level === 2) {
				const targetAddress = { ...address, serviceTarget: property }
				return Object.freeze({
					run: (input: unknown, options: HarnessInvokeParameter = {}) => invoke(targetAddress, input, options),
					stream: (input: unknown, options: HarnessInvokeParameter = {}) => openStream(targetAddress, input, options),
				})
			}
			return undefined
		},
	}) as T
}
