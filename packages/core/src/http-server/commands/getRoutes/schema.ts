import { extendApi } from '@anatine/zod-openapi'
import { z } from 'zod'

export const inputPayloadSchema = extendApi(z.undefined())

export const inputParameterSchema = z.object({})

export const outputPayloadSchema = z.any()

export type InputPayloadType = undefined // z.infer<typeof inputPayloadSchema>
export type InputParameterType = z.infer<typeof inputParameterSchema>
export type OutputPayloadType = z.infer<typeof outputPayloadSchema>
