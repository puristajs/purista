/** set a config value in the config store @group Store */
export type ConfigSetterFunction = (secretName: string, secretValue: unknown) => Promise<void>
