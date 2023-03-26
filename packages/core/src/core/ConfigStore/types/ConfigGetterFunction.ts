/** get a config value from the config store @group Store */
export type ConfigGetterFunction = (...configNames: string[]) => Promise<Record<string, unknown | undefined>>
