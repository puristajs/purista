import { EBMessage } from '@purista/core'
import { IPublishPacket } from 'mqtt'

import { MqttBridge } from '../MqttEventBridge'

export type IncomingMessageFunction = (this: MqttBridge, payload: EBMessage, packet: IPublishPacket) => Promise<void>
