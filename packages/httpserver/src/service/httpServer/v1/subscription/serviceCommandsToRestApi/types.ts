import type { z } from 'zod'

import type { httpServerV1ServiceCommandsToRestApiInputPayloadSchema } from './schema'

export type HttpServerV1ServiceCommandsToRestApiInputPayload = z.output<
  typeof httpServerV1ServiceCommandsToRestApiInputPayloadSchema
>
