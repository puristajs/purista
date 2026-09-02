import type { z } from 'zod'

import type {
	identityV1LogoutInputParameterSchema,
	identityV1LogoutInputPayloadSchema,
	identityV1LogoutOutputPayloadSchema,
}
from './schema.js'

export type IdentityV1LogoutInputParameter = z.input<typeof identityV1LogoutInputParameterSchema>

export type IdentityV1LogoutInputPayload = z.input<typeof identityV1LogoutInputPayloadSchema>

export type IdentityV1LogoutOutputPayload = z.output<typeof identityV1LogoutOutputPayloadSchema>
