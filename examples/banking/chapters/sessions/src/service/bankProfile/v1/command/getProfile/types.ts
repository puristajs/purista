import type { z } from 'zod'

import type {
	bankProfileV1GetProfileInputParameterSchema,
	bankProfileV1GetProfileInputPayloadSchema,
	bankProfileV1GetProfileOutputPayloadSchema,
}
from './schema.js'

export type BankProfileV1GetProfileInputParameter = z.input<typeof bankProfileV1GetProfileInputParameterSchema>

export type BankProfileV1GetProfileInputPayload = z.input<typeof bankProfileV1GetProfileInputPayloadSchema>

export type BankProfileV1GetProfileOutputPayload = z.output<typeof bankProfileV1GetProfileOutputPayloadSchema>
