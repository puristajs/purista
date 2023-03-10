export type SecretGetterFunction = <T>(secretName: string) => Promise<T | undefined>
