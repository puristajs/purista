export type SetNewTypeValue<T, K extends keyof T, V> = {
	[P in keyof T]: P extends K ? V : T[P]
}
