export type StateSetterFunction = (secretName: string, secretValue: unknown) => Promise<void>
