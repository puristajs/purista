/**
 * Helper for better typescript type.
 * All keys of given object must start with the given prefix. Otherwise Typescript will complain.
 *
 * ```
 */
export type addPrefixToObject<T, P extends string> = {
	[K in keyof T as K extends string ? `${P}${K}` : never]: T[K]
}
