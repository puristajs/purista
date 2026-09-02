import type { z } from 'zod'

import type {
	identityV1ResolveSessionInputParameterSchema,
	identityV1ResolveSessionInputPayloadSchema,
	identityV1ResolveSessionOutputPayloadSchema,
}
from './schema.js'

export type IdentityV1ResolveSessionInputParameter = z.input<typeof identityV1ResolveSessionInputParameterSchema>

export type IdentityV1ResolveSessionInputPayload = z.input<typeof identityV1ResolveSessionInputPayloadSchema>

export type IdentityV1ResolveSessionOutputPayload = z.output<typeof identityV1ResolveSessionOutputPayloadSchema>
