import type { CustomMessage } from './CustomMessage.js'
import type { Command, CommandResponse } from './commandType/index.js'
import type { InfoMessage } from './infoType/index.js'

/**
 * EBMessage is some message which is handled by the event bridge.
 */
export type EBMessage = Command | CommandResponse | InfoMessage | CustomMessage
