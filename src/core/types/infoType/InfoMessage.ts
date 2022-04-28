import { EBMessage } from '../EBMessage'
import { EBMessageType } from '../EBMessageType.enum'
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

export type InfoMessageType =
  | EBMessageType.InfoServiceDrain
  | EBMessageType.InfoServiceFunctionAdded
  | EBMessageType.InfoServiceInit
  | EBMessageType.InfoServiceNotReady
  | EBMessageType.InfoServiceReady
  | EBMessageType.InfoServiceShutdown
export const infoMessageTypes = [
  EBMessageType.InfoServiceDrain,
  EBMessageType.InfoServiceFunctionAdded,
  EBMessageType.InfoServiceInit,
  EBMessageType.InfoServiceNotReady,
  EBMessageType.InfoServiceReady,
  EBMessageType.InfoServiceShutdown,
]

export const isInfoMessage = (message: EBMessage): message is InfoMessage => {
  return infoMessageTypes.includes(message.messageType)
}
