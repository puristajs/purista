export type StateGetterFunction = (...stateNames: string[]) => Promise<Record<string, unknown>>
