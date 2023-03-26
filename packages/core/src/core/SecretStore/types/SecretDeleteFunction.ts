/** delete a secret from the secret store @group Store */
export type SecretDeleteFunction = (secretName: string) => Promise<void>
