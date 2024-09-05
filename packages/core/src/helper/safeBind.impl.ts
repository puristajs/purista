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
export function safeBind<T extends (...args: any[]) => any, U>(
	fn: T,
	thisArg: U,
): (...args: Parameters<T>) => ReturnType<T> {
	return fn.bind(thisArg)
}
