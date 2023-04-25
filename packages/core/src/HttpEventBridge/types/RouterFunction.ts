import { Context } from 'hono'

import { HttpEventBridge } from '../HttpEventBridge.impl'
import { HttpEventBridgeConfig } from './HttpEventBridgeConfig'

export type RouterFunction<T extends HttpEventBridge<HttpEventBridgeConfig> = HttpEventBridge<HttpEventBridgeConfig>> =
  (this: T, c: Context) => Promise<Response>
