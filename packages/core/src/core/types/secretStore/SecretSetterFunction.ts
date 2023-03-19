export type SecretSetterFunction = (secretName: string, secretValue: string) => Promise<void>
