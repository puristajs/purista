import type { Context } from 'hono'

import type { IHttpEventBridge } from './IHttpEventBridge.js'

/**
 * Hono route handler bound to an HTTP event bridge instance.
 */
export type RouterFunction<T extends IHttpEventBridge = IHttpEventBridge> = (this: T, c: Context) => Promise<Response>
