/** set a secret in the secret store @group Store */
export type SecretSetterFunction = (secretName: string, secretValue: string) => Promise<void>
