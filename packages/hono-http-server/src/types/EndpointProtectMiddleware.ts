import type { Service } from '@purista/core'
import type { Context, Next } from 'hono'

import type { BindingsBase } from './BindingsBase.js'
import type { VariablesBase } from './VariablesBase.js'

export type EndpointProtectMiddleware<
	T extends Service,
	Bindings extends BindingsBase = BindingsBase,
	Variables extends VariablesBase = VariablesBase,
	// biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
> = (this: T, c: Context<{ Bindings: Bindings; Variables: Variables }>, next: Next) => Promise<void | Response>
