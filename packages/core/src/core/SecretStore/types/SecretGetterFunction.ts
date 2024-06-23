import type { ObjectWithKeysFromStringArray } from '../../../helper/types/ObjectWithKeysFromStringArray.js'

/** get a secret from the secret store @group Store */
export type SecretGetterFunction = <SecretNames extends string[]>(
	...secretNames: SecretNames
) => Promise<ObjectWithKeysFromStringArray<SecretNames, string | undefined>>
