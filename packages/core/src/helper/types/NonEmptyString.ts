/** Rejects the empty string literal in builder type constraints. */
export type NonEmptyString<T extends string> = '' extends T ? never : T
