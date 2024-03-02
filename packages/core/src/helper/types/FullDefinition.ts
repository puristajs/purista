import type { FullServiceDefinition } from './FullServiceDefinition.js'

export type FullDefinition = {
  version: string
  rest?: {
    apiPath: string
    domain: string
  }
  services: FullServiceDefinition
}
