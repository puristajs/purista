export type ConfigSetterFunction = (secretName: string, secretValue: unknown) => Promise<void>
