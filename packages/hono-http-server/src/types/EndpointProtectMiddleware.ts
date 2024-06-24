import type { Service } from '@purista/core'
import type { Context, Next } from 'hono'

import type { BindingsBase } from './BindingsBase.js'
import type { VariablesBase } from './VariablesBase.js'

export type EndpointProtectMiddleware<
	T extends Service,
	Bindings extends BindingsBase = BindingsBase,
	Variables extends VariablesBase = VariablesBase,
> = (this: T, c: Context<{ Bindings: Bindings; Variables: Variables }>, next: Next) => Promise<undefined | Response>
