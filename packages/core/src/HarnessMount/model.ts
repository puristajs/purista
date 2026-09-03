import type { BuilderState, HarnessDefinition, ModelHandle } from '@purista/harness'

import type { InvokeList } from '../core/types/InvokeList.js'

/** Internal type-and-runtime key carried with a handler's declared invokes. */
export const harnessModelDeclarations = Symbol('purista.harness.models')

type HarnessModelReference = Readonly<{
	definition: HarnessDefinition<any>
	alias: string
}>

/** Phantom declaration added to a builder by `canUseHarnessModel`. */
export type HarnessModelDeclaration<
	D extends HarnessDefinition<any>,
	Alias extends keyof D['catalog']['models'] & string,
> = {
	readonly [harnessModelDeclarations]: Readonly<Record<Alias, ModelHandle<D['catalog']['models'][Alias]>>>
}

/** Capability-projected deterministic model handles exposed to one handler. */
export type HarnessModelClients<Invokes extends InvokeList> = Invokes extends {
	readonly [harnessModelDeclarations]: infer Models
}
	? Models
	: Record<never, never>

/** Register a mounted model reference without adding an EventBridge invocation. */
export function registerHarnessModel<
	D extends HarnessDefinition<any>,
	Alias extends keyof D['catalog']['models'] & string,
>(invokes: InvokeList, definition: D, alias: Alias): InvokeList & HarnessModelDeclaration<D, Alias> {
	const carrier = invokes as InvokeList & {
		[harnessModelDeclarations]?: Record<string, HarnessModelReference>
	}
	const current = carrier[harnessModelDeclarations] ?? {}
	const existing = current[alias]
	if (existing && existing.definition !== definition) {
		throw new Error(`Harness model alias "${alias}" is already declared from another Harness definition.`)
	}
	Object.defineProperty(carrier, harnessModelDeclarations, {
		value: { ...current, [alias]: Object.freeze({ definition, alias }) },
		configurable: true,
		enumerable: true,
		writable: true,
	})
	return carrier as unknown as InvokeList & HarnessModelDeclaration<D, Alias>
}

/** Resolve only the model aliases explicitly declared by a handler builder. */
export function createHarnessModelClients<T extends InvokeList>(
	invokes: T,
	resolve: (definition: HarnessDefinition<BuilderState>, alias: string) => ModelHandle,
): HarnessModelClients<T> {
	const references = (
		invokes as InvokeList & { [harnessModelDeclarations]?: Readonly<Record<string, HarnessModelReference>> }
	)[harnessModelDeclarations]
	if (!references) return Object.freeze({}) as HarnessModelClients<T>
	return Object.freeze(
		Object.fromEntries(
			Object.entries(references).map(([alias, reference]) => [alias, resolve(reference.definition, alias)]),
		),
	) as HarnessModelClients<T>
}
