/**
 * A state store for using redis as storage.
 * State values are stored as stringified JSON.
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
 * const store = new RedisStateStore({ config })
 *
 * await store.setState('stateKey',{ myState: 'value' })
 *
 * let value = await store.getState('stateKey')
 * console.log(value) // outputs: { myState: 'value' }
 *
 * await store.removeState('stateKey')
 *
 * value = await store.getState('stateKey')
 * console.log(value) // outputs: undefined
 * ```
 *
 * See documentation of underlaying redis lib package for detailed configuration options.
 *
 * @see [NODE-REDIS](https://redis.js.org)
 *
 * @module
 */
export * from './RedisStateStore.impl'
