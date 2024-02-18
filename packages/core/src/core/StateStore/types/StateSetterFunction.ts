/** set a state value in the state store @group Store */
export type StateSetterFunction = (stateName: string, stateValue: unknown) => Promise<void>
