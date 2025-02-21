import type { EBMessage } from '@purista/core'
import type { IPublishPacket } from 'mqtt'
import type { IMqttBridge } from './IMqttBridge.js'

export type IncomingMessageFunction = (this: IMqttBridge, payload: EBMessage, packet: IPublishPacket) => Promise<void>
