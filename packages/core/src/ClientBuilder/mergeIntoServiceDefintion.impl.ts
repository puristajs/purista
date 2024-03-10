import type { FullServiceDefinition } from '../helper/index.js'

export const mergeIntoServiceDefintion = (current: FullServiceDefinition, add: FullServiceDefinition) => {
  Object.entries(add).forEach(([serviceName, value]) => {
    if (current[serviceName]) {
      Object.entries(value).forEach(([serviceVersion, val]) => {
        current[serviceName][serviceVersion] = {
          description: current[serviceName][serviceVersion].description ?? val.description,
          deprecated: current[serviceName][serviceVersion].deprecated,
          commands: {
            ...val.commands,
            ...current[serviceName][serviceVersion].commands,
          },
          subscriptions: {
            ...val.subscriptions,
            ...current[serviceName][serviceVersion].subscriptions,
          },
        }
      })
    } else {
      current[serviceName] = value
    }
  })
}
