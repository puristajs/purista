import { z } from 'zod'

import { httpServerV1ServiceCommandsToRestApiInputPayloadSchema } from './schema'

export type HttpServerV1ServiceCommandsToRestApiInputPayload = z.output<
  typeof httpServerV1ServiceCommandsToRestApiInputPayloadSchema
>
