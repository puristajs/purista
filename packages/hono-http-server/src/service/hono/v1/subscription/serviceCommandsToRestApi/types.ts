import type { z } from 'zod'

import type { honoV1ServiceCommandsToRestApiInputPayloadSchema } from './schema.js'

export type HonoV1ServiceCommandsToRestApiInputPayload = z.output<
	typeof honoV1ServiceCommandsToRestApiInputPayloadSchema
>
