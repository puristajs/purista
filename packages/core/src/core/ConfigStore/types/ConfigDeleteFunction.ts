/** delete a config value from the config store @group Store */
export type ConfigDeleteFunction = (configName: string) => Promise<void>
