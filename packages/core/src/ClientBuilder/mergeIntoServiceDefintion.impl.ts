import type { FullServiceDefinition } from '../helper/types/FullServiceDefinition.js'

export const mergeIntoServiceDefinition = (current: FullServiceDefinition, add: FullServiceDefinition) => {
	for (const [serviceName, value] of Object.entries(add)) {
		if (current[serviceName]) {
			for (const [serviceVersion, val] of Object.entries(value)) {
				if (!current[serviceName][serviceVersion]) {
					current[serviceName][serviceVersion] = val
					continue
				}

				current[serviceName][serviceVersion] = {
					description: current[serviceName][serviceVersion].description ?? val.description,
					deprecated: current[serviceName][serviceVersion].deprecated ?? val.deprecated,
					commands: { ...val.commands, ...current[serviceName][serviceVersion].commands },
					subscriptions: { ...val.subscriptions, ...current[serviceName][serviceVersion].subscriptions },
				}
			}
		} else {
			current[serviceName] = value
		}
	}
}

/**
 * @deprecated Use `mergeIntoServiceDefinition` instead.
 */
export const mergeIntoServiceDefintion = mergeIntoServiceDefinition
