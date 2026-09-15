import type { Service } from '@purista/core'
import type { Context, Next } from 'hono'

import type { BindingsBase } from './BindingsBase.js'
import type { VariablesBase } from './VariablesBase.js'

/**
 * Middleware type for protected generated Hono endpoints.
 *
 * Use it to authenticate the HTTP request, verify and decode its credential,
 * and set typed Hono variables such as `principalId`, `tenantId` or
 * `additionalParameter`. Business authorization belongs to guards on the
 * receiving PURISTA command, stream, subscription, worker, or mounted Harness
 * target.
 */
export type EndpointProtectMiddleware<
	T extends Service,
	Bindings extends BindingsBase = BindingsBase,
	Variables extends VariablesBase = VariablesBase,
	// biome-ignore lint/suspicious/noConfusingVoidType: Response handlers may return void
> = (this: T, c: Context<{ Bindings: Bindings; Variables: Variables }>, next: Next) => Promise<void | Response>
