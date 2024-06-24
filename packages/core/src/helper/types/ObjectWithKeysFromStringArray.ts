/**
 * Type helper which can create a typed record, based on given string array type.
 *
 */
export type ObjectWithKeysFromStringArray<T extends ReadonlyArray<string>, Value = unknown | undefined> = {
	[K in T extends ReadonlyArray<infer U> ? U : never]: Value
}
