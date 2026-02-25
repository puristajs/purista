import type { CustomMessage } from './CustomMessage.js'
import type { Command } from './commandType/Command.js'
import type { CommandResponse } from './commandType/CommandResponse.js'

import type { InfoMessage } from './infoType/InfoMessage.js'
import type { StreamMessage } from './stream/StreamMessage.js'

/**
 * EBMessage is some message which is handled by the event bridge.
 */
export type EBMessage = Command | CommandResponse | InfoMessage | CustomMessage | StreamMessage
