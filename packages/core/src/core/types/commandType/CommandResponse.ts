import type { CommandErrorResponse } from './CommandErrorResponse'
import type { CommandSuccessResponse } from './CommandSuccessResponse'

/**
 * CommandResponse is a response to a specific previously received command which can be either a success or failure
 *
 * @group Command
 */
export type CommandResponse<T = unknown> = CommandSuccessResponse<T> | CommandErrorResponse
