import type { z } from 'zod'

import type { honoV1ServiceCommandsToRestApiInputPayloadSchema } from './schema.js'

/**
 * Payload shape for service metadata messages that trigger dynamic HTTP endpoint registration.
 */
export type HonoV1ServiceCommandsToRestApiInputPayload = z.output<
	typeof honoV1ServiceCommandsToRestApiInputPayloadSchema
>
