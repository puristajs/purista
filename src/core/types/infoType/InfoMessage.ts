import { EBMessage } from '../EBMessage'
import { EBMessageType } from '../EBMessageType.enum'
import { InfoInvokeTimeOut } from './InfoInvokeTimeOut'
import { InfoServiceDrain } from './InfoServiceDrain'
import { InfoServiceFunctionAdded } from './InfoServiceFunctionAdded'
import { InfoServiceInit } from './InfoServiceInit'
import { InfoServiceNotReady } from './InfoServiceNotReady'
import { InfoServiceReady } from './InfoServiceReady'
import { InfoServiceShutdown } from './InfoServiceShutdown'

export type InfoMessage =
  | InfoServiceDrain
  | InfoServiceFunctionAdded
  | InfoServiceInit
  | InfoServiceNotReady
  | InfoServiceReady
  | InfoServiceShutdown
  | InfoInvokeTimeOut

export type InfoMessageType =
  | EBMessageType.InfoServiceDrain
  | EBMessageType.InfoServiceFunctionAdded
  | EBMessageType.InfoServiceInit
  | EBMessageType.InfoServiceNotReady
  | EBMessageType.InfoServiceReady
  | EBMessageType.InfoServiceShutdown
  | EBMessageType.InfoInvokeTimeOut
export const infoMessageTypes = [
  EBMessageType.InfoServiceDrain,
  EBMessageType.InfoServiceFunctionAdded,
  EBMessageType.InfoServiceInit,
  EBMessageType.InfoServiceNotReady,
  EBMessageType.InfoServiceReady,
  EBMessageType.InfoServiceShutdown,
  EBMessageType.InfoInvokeTimeOut,
]

export const isInfoMessage = (message: EBMessage): message is InfoMessage => {
  return infoMessageTypes.includes(message.messageType)
}
