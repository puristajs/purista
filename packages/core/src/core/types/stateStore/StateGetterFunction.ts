export type StateGetterFunction = <T>(secretName: string) => Promise<T | undefined>
