/**
 * A helper which forces to provide all object keys, even if they are optional.
 *
 * @example
 * ```typescript
 * type A = {
 *  one?: string,
 *  two?: number,
 *  three: string
 * }
 *
 * // without:
 * const x:A = { three: 'will work'}
 *
 * // this will fail
 * const y:Complete<A> = { three: 'will complain that one and two is missing'}
 * // needs to be like this:
 * const z:Complete<A> = { one: undefined, two: undefined, three: 'will work'}
 * ```
 */
export type Complete<T> = {
  [P in keyof Required<T>]: Pick<T, P> extends Required<Pick<T, P>> ? T[P] : T[P] | undefined
}
