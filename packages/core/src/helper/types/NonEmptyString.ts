export type NonEmptyString<T extends string> = '' extends T ? never : T
