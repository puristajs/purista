import type { StateWriteOptions } from './StateRetention.js'

/** Set a state value in the state store. @group Store */
export type StateSetterFunction = (stateName: string, stateValue: unknown, options?: StateWriteOptions) => Promise<void>
