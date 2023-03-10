export type SecretSetterFunction = (secretName: string, secretValue: unknown) => Promise<void>
