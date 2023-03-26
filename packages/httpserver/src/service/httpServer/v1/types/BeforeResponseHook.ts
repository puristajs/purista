import { FastifyReply, FastifyRequest } from 'fastify'

export type BeforeResponseHook = <T = unknown>(
  payload: T,
  request: FastifyRequest,
  reply: FastifyReply,
  parameter: Record<string, unknown>,
) => void
