import type { ObjectWithKeysFromStringArray } from '../../../helper/types/ObjectWithKeysFromStringArray.js'

/** get a config value from the config store @group Store */
export type ConfigGetterFunction = <ConfigNames extends string[]>(
	...configNames: ConfigNames
) => Promise<ObjectWithKeysFromStringArray<ConfigNames>>
