/**
 * Bind `this` argument like regular `.bind(thisArg)`, but keeps the typescript types in result
 *
 * @example
 * ```typescript
 * const functionWithThisSet = safeBind(fn, thisParam)
 * ```
 *
 * @param fn The function
 * @param thisArg
 * @returns
 */
export function safeBind<ThisType, Args extends unknown[], ReturnType>(
	fn: (this: ThisType, ...args: Args) => ReturnType,
	thisArg: ThisType,
): (...args: Args) => ReturnType {
	return fn.bind(thisArg)
}
