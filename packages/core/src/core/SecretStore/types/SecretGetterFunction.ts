/** get a secret from the secret store @group Store */
export type SecretGetterFunction = (...secretName: string[]) => Promise<Record<string, string | undefined>>
