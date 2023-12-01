import type { Context } from 'hono'

import type { HttpEventBridge } from '../HttpEventBridge.impl'
import type { HttpEventBridgeConfig } from './HttpEventBridgeConfig'

export type RouterFunction<T extends HttpEventBridge<HttpEventBridgeConfig> = HttpEventBridge<HttpEventBridgeConfig>> =
  (this: T, c: Context) => Promise<Response>
