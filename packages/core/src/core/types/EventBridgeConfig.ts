import { InstanceId } from './InstanceId'

export type EventBridgeConfig = {
  defaultCommandTimeout?: number
  instanceId?: InstanceId
}

export type EventBridgeEnsuredDefaults = {
  defaultCommandTimeout: number
  instanceId: InstanceId
}
