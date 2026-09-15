import { z } from 'zod'
import { sessionRecordSchema } from '../../session.js'

export const identityV1ResolveSessionInputParameterSchema = z.object({ sessionToken: z.uuid() })
export const identityV1ResolveSessionInputPayloadSchema = z.undefined()
export const identityV1ResolveSessionOutputPayloadSchema = sessionRecordSchema
