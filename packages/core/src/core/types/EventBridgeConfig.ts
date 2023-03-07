import { InstanceId } from './InstanceId'

export type EventBridgeConfig = {
  /** The execution time of a command until the eventbridge automatically returns a timeout error response */
  defaultCommandTimeout?: number
  /** Instance id of the current running event bridge instance */
  instanceId?: InstanceId
  /** Log warnings on messages which are emitted, but could not delivered to at least one receiver */
  logWarnOnMessagesWithoutReceiver?: boolean
}

export type EventBridgeEnsuredDefaults = {
  defaultCommandTimeout: number
  instanceId: InstanceId
  logWarnOnMessagesWithoutReceiver: boolean
}
