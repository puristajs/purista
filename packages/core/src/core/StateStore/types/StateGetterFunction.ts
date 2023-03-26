/** get a state value from the state store @group Store */
export type StateGetterFunction = (...stateNames: string[]) => Promise<Record<string, unknown | undefined>>
