import type { z } from 'zod'

import type {
	identityV1GetCurrentSessionInputParameterSchema,
	identityV1GetCurrentSessionInputPayloadSchema,
	identityV1GetCurrentSessionOutputPayloadSchema,
}
from './schema.js'

export type IdentityV1GetCurrentSessionInputParameter = z.input<typeof identityV1GetCurrentSessionInputParameterSchema>

export type IdentityV1GetCurrentSessionInputPayload = z.input<typeof identityV1GetCurrentSessionInputPayloadSchema>

export type IdentityV1GetCurrentSessionOutputPayload = z.output<typeof identityV1GetCurrentSessionOutputPayloadSchema>
