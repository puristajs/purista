import { ServiceInfoType } from '../types'

const serviceNameRegex = /^[a-zA-Z0-9-_]*$/
const serviceVersionRegex = /^\d+$/
export const ServiceInfoValidator = {
  set(obj: ServiceInfoType, prop: keyof ServiceInfoType, value: string) {
    if (prop === 'serviceName') {
      if (!value.length) {
        throw new TypeError('serviceName must be set')
      }
      if (!value.match(serviceNameRegex)) {
        throw new TypeError(
          `serviceName "${value}" is invalid. Only allowed to have a-z, A-Z, 0-9, -, _ as characters.`,
        )
      }
    }

    if (prop === 'serviceVersion') {
      if (!value.length) {
        throw new TypeError('serviceVersion must be set')
      }
      if (!value.match(serviceVersionRegex)) {
        throw new TypeError(`serviceVersion "${value}" is invalid. Only allowed number characters 0-9.`)
      }
    }

    obj[prop] = value
    return true
  },
}
