import type { Context } from 'hono'

import type { IHttpEventBridge } from './IHttpEventBridge.js'

export type RouterFunction<T extends IHttpEventBridge = IHttpEventBridge> = (this: T, c: Context) => Promise<Response>
