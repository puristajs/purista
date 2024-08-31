import type { EmptyObject } from './EmptyObject.js'

export type ServiceClassTypes<ConfigType = EmptyObject, Resources = EmptyObject> = {
	ConfigType: ConfigType
	Resources: Resources
}
