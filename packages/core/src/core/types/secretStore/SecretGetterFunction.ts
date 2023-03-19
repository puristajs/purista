export type SecretGetterFunction = (...secretName: string[]) => Promise<Record<string, unknown>>
