/**
 * Type helper which can create a typed record, based on given string array type.
 * Use it for typed multi-key store reads without widening the result to a
 * generic string map.
 */
export type ObjectWithKeysFromStringArray<T extends ReadonlyArray<string>, Value = unknown | undefined> = {
	[K in T extends ReadonlyArray<infer U> ? U : never]: Value
}
