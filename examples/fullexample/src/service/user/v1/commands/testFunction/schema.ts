import { z } from 'zod'

// define the input parameters
export const inputParameterSchema = z.object({})

// define the input payload
export const inputPayloadSchema = z.any()

// define the output payload
export const outputPayloadSchema = z.string()
