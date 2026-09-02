import type {
	BuilderState,
	HarnessDefinition,
	HarnessHostToolBindings,
	HarnessInstanceConfig,
	InferTypes,
} from '@purista/harness'
import type { Logger } from '../core/types/Logger.js'

/** Trusted PURISTA values available to a bound host tool for one run. */
export type HarnessHostContext = Readonly<{
	identity: Readonly<{ tenantId?: string; principalId?: string }>
	request: Readonly<{ traceId?: string; correlationId: string }>
	logger: Logger
}>

/** Address-first adapter that exposes a PURISTA command as a Harness host tool. */
export type HarnessCommandToolAdapter = Readonly<{
	kind: 'purista-command'
	serviceName: string
	serviceVersion: string
	serviceTarget: string
	mapInput?: (input: unknown) => Readonly<{ payload: unknown; parameter?: unknown }>
	mapOutput?: (output: unknown) => unknown
}>

type MountHostToolBindings<S extends BuilderState> = {
	[K in keyof HarnessHostToolBindings<S, HarnessHostContext>]:
		| HarnessHostToolBindings<S, HarnessHostContext>[K]
		| HarnessCommandToolAdapter
}

/** Agent or workflow names explicitly published at a PURISTA service address. */
export type HarnessPublishPolicy<S extends BuilderState> = Readonly<{
	publish: Readonly<{
		agents?: readonly (keyof NonNullable<S['agents']> & string)[]
		workflows?: readonly (keyof NonNullable<S['workflows']> & string)[]
	}>
}> &
	(keyof MountHostToolBindings<S> extends never
		? { readonly hostTools?: never }
		: { readonly hostTools: MountHostToolBindings<S> })

/** One immutable Harness definition mounted by a service builder. */
export type HarnessMount<D extends HarnessDefinition<any> = HarnessDefinition<any>> = Readonly<{
	definition: D
	policy: HarnessPublishPolicy<HarnessState<D>>
}>

/** Builder state carried by a portable Harness definition. */
export type HarnessState<D extends HarnessDefinition<any>> = D extends HarnessDefinition<infer S> ? S : never

/** Inferred input/output catalog carried by a portable Harness definition. */
export type HarnessTypes<D extends HarnessDefinition<any>> = D extends {
	readonly $infer: infer I extends InferTypes<any>
}
	? I
	: never

type UnionToIntersection<U> = (U extends unknown ? (value: U) => void : never) extends (value: infer I) => void
	? I
	: never

/** Runtime AI configuration accumulated from every mounted Harness definition. */
export type MountedHarnessRuntimeConfig<H extends readonly HarnessDefinition<any>[]> = UnionToIntersection<
	H[number] extends infer D extends HarnessDefinition<any>
		? Omit<HarnessInstanceConfig<HarnessState<D>, HarnessHostContext>, 'hostTools'>
		: never
>

/** Create an address-first command adapter for a Harness host tool. */
export function commandAsHarnessTool(
	serviceName: string,
	serviceVersion: string,
	serviceTarget: string,
	options: Pick<HarnessCommandToolAdapter, 'mapInput' | 'mapOutput'> = {},
): HarnessCommandToolAdapter {
	return Object.freeze({ kind: 'purista-command', serviceName, serviceVersion, serviceTarget, ...options })
}
