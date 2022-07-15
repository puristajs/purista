import { InstanceId } from './InstanceId'

export type EventBridgeConfig = {
  defaultTtl?: number
  instanceId?: InstanceId
}

export type EventBridgeEnsuredDefaults = {
  defaultTtl: number
  instanceId: InstanceId
}
