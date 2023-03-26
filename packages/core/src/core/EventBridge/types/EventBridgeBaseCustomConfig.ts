import { InstanceId } from '../../types'

/**
 * The basic event bridge config, which every eventbridge should have.
 *
 * A Event bridge implementation must extend this type
 */
export type EventBridgeBaseCustomConfig = {
  /** The execution time of a command until the eventbridge automatically returns a timeout error response */
  defaultCommandTimeout?: number
  /** Instance id of the current running event bridge instance */
  instanceId?: InstanceId
}
