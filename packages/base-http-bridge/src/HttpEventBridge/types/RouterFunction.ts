import type { Context } from 'hono'

import type { HttpEventBridge } from '../HttpEventBridge.impl.js'
import type { HttpEventBridgeConfig } from './HttpEventBridgeConfig.js'

export type RouterFunction<T extends HttpEventBridge<HttpEventBridgeConfig> = HttpEventBridge<HttpEventBridgeConfig>> =
  (this: T, c: Context) => Promise<Response>
