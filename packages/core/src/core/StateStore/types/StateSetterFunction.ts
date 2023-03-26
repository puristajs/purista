/** set a state value in the state store @group Store */
export type StateSetterFunction = (secretName: string, secretValue: unknown) => Promise<void>
