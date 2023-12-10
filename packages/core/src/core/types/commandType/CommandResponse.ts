import type { CommandErrorResponse } from './CommandErrorResponse.js'
import type { CommandSuccessResponse } from './CommandSuccessResponse.js'

/**
 * CommandResponse is a response to a specific previously received command which can be either a success or failure
 *
 * @group Command
 */
export type CommandResponse<T = unknown> = CommandSuccessResponse<T> | CommandErrorResponse
