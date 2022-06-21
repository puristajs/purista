import { z } from 'zod'

export type ValidationDefinition = {
  inputPayloadSchema?: z.ZodType<unknown, z.ZodTypeDef, unknown>
  inputParameterSchema?: z.ZodType<unknown, z.ZodTypeDef, unknown>
  outputPayloadSchema?: z.ZodType<unknown, z.ZodTypeDef, unknown>
}
