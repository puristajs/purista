import { z } from 'zod'
import { sessionRecordSchema } from '../../session.js'

export const identityV1GetCurrentSessionInputParameterSchema = z.object({ sessionToken: z.uuid() })
export const identityV1GetCurrentSessionInputPayloadSchema = z.undefined()
export const identityV1GetCurrentSessionOutputPayloadSchema = sessionRecordSchema
