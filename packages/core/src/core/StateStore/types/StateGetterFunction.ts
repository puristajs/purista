import type { ObjectWithKeysFromStringArray } from '../../../helper/types/ObjectWithKeysFromStringArray.js'

/** get a state value from the state store @group Store */
export type StateGetterFunction = <StateNames extends string[]>(
	...stateNames: StateNames
) => Promise<ObjectWithKeysFromStringArray<StateNames>>
