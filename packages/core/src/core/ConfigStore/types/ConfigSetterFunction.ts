/** set a config value in the config store @group Store */
export type ConfigSetterFunction = (configName: string, configValue: unknown) => Promise<void>
