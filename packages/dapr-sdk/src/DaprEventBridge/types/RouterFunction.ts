import { IncomingMessage, ServerResponse } from 'http'

export type RouterFunction = (
  request: IncomingMessage,
  response: ServerResponse,
  parameter: Record<string, unknown>,
) => Promise<void>
