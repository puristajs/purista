import type { EBMessage } from '@purista/core'
import type { IPublishPacket } from 'mqtt'

import type { MqttBridge } from '../MqttEventBridge.js'

export type IncomingMessageFunction = (this: MqttBridge, payload: EBMessage, packet: IPublishPacket) => Promise<void>
