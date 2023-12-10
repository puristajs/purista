import { EBMessageType } from '../EBMessageType.enum.js'
import type { InfoInvokeTimeout } from './InfoInvokeTimeout.js'
import type { InfoServiceDrain } from './InfoServiceDrain.js'
import type { InfoServiceFunctionAdded } from './InfoServiceFunctionAdded.js'
import type { InfoServiceInit } from './InfoServiceInit.js'
import type { InfoServiceNotReady } from './InfoServiceNotReady.js'
import type { InfoServiceReady } from './InfoServiceReady.js'
import type { InfoServiceShutdown } from './InfoServiceShutdown.js'
import type { InfoSubscriptionError } from './InfoSubscriptionError.js'

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
