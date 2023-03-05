import { EBMessageType } from '../EBMessageType.enum'
import type { InfoInvokeTimeout } from './InfoInvokeTimeout'
import type { InfoServiceDrain } from './InfoServiceDrain'
import type { InfoServiceFunctionAdded } from './InfoServiceFunctionAdded'
import type { InfoServiceInit } from './InfoServiceInit'
import type { InfoServiceNotReady } from './InfoServiceNotReady'
import type { InfoServiceReady } from './InfoServiceReady'
import type { InfoServiceShutdown } from './InfoServiceShutdown'
import type { InfoSubscriptionError } from './InfoSubscriptionError'

export type InfoMessage =
  | InfoServiceDrain
  | InfoServiceFunctionAdded
  | InfoServiceInit
  | InfoServiceNotReady
  | InfoServiceReady
  | InfoServiceShutdown
  | InfoInvokeTimeout
  | InfoSubscriptionError

export type InfoMessageType =
  | EBMessageType.InfoServiceDrain
  | EBMessageType.InfoServiceFunctionAdded
  | EBMessageType.InfoServiceInit
  | EBMessageType.InfoServiceNotReady
  | EBMessageType.InfoServiceReady
  | EBMessageType.InfoServiceShutdown
  | EBMessageType.InfoInvokeTimeout
  | EBMessageType.InfoSubscriptionError
export const infoMessageTypes = [
  EBMessageType.InfoServiceDrain,
  EBMessageType.InfoServiceFunctionAdded,
  EBMessageType.InfoServiceInit,
  EBMessageType.InfoServiceNotReady,
  EBMessageType.InfoServiceReady,
  EBMessageType.InfoServiceShutdown,
  EBMessageType.InfoInvokeTimeout,
  EBMessageType.InfoSubscriptionError,
]
