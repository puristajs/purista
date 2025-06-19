import type { z } from 'zod/v4'

import type { httpServerV1ServiceCommandsToRestApiInputPayloadSchema } from './schema.js'

export type HttpServerV1ServiceCommandsToRestApiInputPayload = z.output<
	typeof httpServerV1ServiceCommandsToRestApiInputPayloadSchema
>
