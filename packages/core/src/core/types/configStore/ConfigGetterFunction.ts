export type ConfigGetterFunction = <T>(secretName: string) => Promise<T>
