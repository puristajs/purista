import type { Command, CommandResponse } from './commandType'
import type { CustomMessage } from './CustomMessage'
import type { InfoMessage } from './infoType'

/**
 * EBMessage is some message which is handled by the event bridge.
 */
export type EBMessage = Command | CommandResponse | InfoMessage | CustomMessage
