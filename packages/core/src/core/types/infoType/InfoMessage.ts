import { EBMessage } from '../EBMessage'
import { EBMessageType } from '../EBMessageType.enum'
import { InfoInvokeTimeout } from './InfoInvokeTimeout'
import { InfoServiceDrain } from './InfoServiceDrain'
import { InfoServiceFunctionAdded } from './InfoServiceFunctionAdded'
import { InfoServiceInit } from './InfoServiceInit'
import { InfoServiceNotReady } from './InfoServiceNotReady'
import { InfoServiceReady } from './InfoServiceReady'
import { InfoServiceShutdown } from './InfoServiceShutdown'
import { InfoSubscriptionError } from './InfoSubscriptionError'

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

export const isInfoMessage = (message: EBMessage): message is InfoMessage => {
  return infoMessageTypes.includes(message.messageType)
}
