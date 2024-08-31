export type SetNewTypeValue<T, K extends keyof T, V> = {
	[P in keyof T]: P extends K ? V : T[P]
}

export type SetNewTypeValues<T, Changes extends { [K in keyof T]?: any }> = {
	[P in keyof T]: P extends keyof Changes ? Changes[P] : T[P]
}
