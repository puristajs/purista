type SafeThisParameterType<T> = T extends (this: unknown, ...args: any[]) => any
	? never
	: T extends (this: infer U, ...args: any[]) => any
		? U
		: never

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
export function safeBind<T extends (...args: any) => any>(
	fn: T,
	thisArg: SafeThisParameterType<T>,
): (...args: Parameters<T>) => ReturnType<T> {
	return fn.bind(thisArg)
}
