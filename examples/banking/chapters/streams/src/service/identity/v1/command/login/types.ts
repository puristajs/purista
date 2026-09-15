import type { z } from 'zod'

import type {
	identityV1LoginInputParameterSchema,
	identityV1LoginInputPayloadSchema,
	identityV1LoginOutputPayloadSchema,
}
from './schema.js'

export type IdentityV1LoginInputParameter = z.input<typeof identityV1LoginInputParameterSchema>

export type IdentityV1LoginInputPayload = z.input<typeof identityV1LoginInputPayloadSchema>

export type IdentityV1LoginOutputPayload = z.output<typeof identityV1LoginOutputPayloadSchema>
