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
					streams: { ...val.streams, ...current[serviceName][serviceVersion].streams },
					queues: { ...val.queues, ...current[serviceName][serviceVersion].queues },
					queueWorkers: { ...val.queueWorkers, ...current[serviceName][serviceVersion].queueWorkers },
					schedules: { ...val.schedules, ...current[serviceName][serviceVersion].schedules },
					...(val.agents === undefined && current[serviceName][serviceVersion].agents === undefined
						? {}
						: { agents: { ...val.agents, ...current[serviceName][serviceVersion].agents } }),
					...(val.workflows === undefined && current[serviceName][serviceVersion].workflows === undefined
						? {}
						: { workflows: { ...val.workflows, ...current[serviceName][serviceVersion].workflows } }),
					...(val.harness === undefined && current[serviceName][serviceVersion].harness === undefined
						? {}
						: { harness: current[serviceName][serviceVersion].harness ?? val.harness }),
					eventToQueueBindings: [
						...(val.eventToQueueBindings ?? []),
						...(current[serviceName][serviceVersion].eventToQueueBindings ?? []),
					],
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
