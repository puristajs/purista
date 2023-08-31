import fastify from 'fastify'

declare module 'fastify' {
  interface FastifyRequest {
    principalId?: string
    tenantId?: string
  }
}
