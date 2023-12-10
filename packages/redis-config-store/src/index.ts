/**
 * A state store for using redis as storage.
 * Config values are stored as stringified JSON.
 *
 * Per default, setting/changing and removal of values are enabled.
 *
 * @example ```typescript
 * const config = {
 *  enableGet: true, // optional, default is true
 *  enableRemove: true, // optional, default is true
 *  enableSet: true, // optional, default is true
 *  url: 'redis://alice:foobared@awesome.redis.server:6379'
 * }
 *
 * const store = new RedisConfigStore(config)
 *
 * await store.setConfig('stateKey',{ myConfig: 'value' })
 *
 * let value = await store.getConfig('stateKey')
 * console.log(value) // outputs: { myConfig: 'value' }
 *
 * await store.removeConfig('stateKey')
 *
 * value = await store.getConfig('stateKey')
 * console.log(value) // outputs: undefined
 * ```
 *
 * See documentation of underlaying redis lib package for detailed configuration options.
 *
 * @see [NODE-REDIS](https://redis.js.org)
 *
 * @module
 */
export * from './RedisConfigStore.impl.js'
export * from './types.js'
export * from './version.js'
