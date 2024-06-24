import type { FullServiceDefinition } from '../helper/index.js'

export const mergeIntoServiceDefintion = (current: FullServiceDefinition, add: FullServiceDefinition) => {
	for (const [serviceName, value] of Object.entries(add)) {
		if (current[serviceName]) {
			for (const [serviceVersion, val] of Object.entries(value)) {
				current[serviceName][serviceVersion] = {
					description: current[serviceName][serviceVersion].description ?? val.description,
					deprecated: current[serviceName][serviceVersion].deprecated,
					commands: { ...val.commands, ...current[serviceName][serviceVersion].commands },
					subscriptions: { ...val.subscriptions, ...current[serviceName][serviceVersion].subscriptions },
				}
			}
		} else {
			current[serviceName] = value
		}
	}
}
