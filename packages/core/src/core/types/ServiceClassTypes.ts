import type { EmptyObject } from './EmptyObject.js'

export type ServiceClassTypes<ConfigType extends EmptyObject = EmptyObject, Resources = EmptyObject> = {
	ConfigType: ConfigType
	Resources: Resources
}
