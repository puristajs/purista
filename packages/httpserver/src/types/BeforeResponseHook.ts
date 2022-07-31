import { FastifyReply, FastifyRequest } from 'fastify'

export type BeforeResponseHook = <T = unknown>(
  payload: T,
  request: FastifyRequest,
  reply: FastifyReply,
  params: Record<string, unknown>,
) => Promise<Boolean>
