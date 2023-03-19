export type ConfigGetterFunction = (...configNames: string[]) => Promise<Record<string, unknown>>
