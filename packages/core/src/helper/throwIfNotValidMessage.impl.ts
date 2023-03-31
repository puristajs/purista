import { z } from 'zod'

import { EBMessageType, StatusCode, UnhandledError } from '../core'

/**
 * Validates if the given input might be valid event bridge message
 * It only checks for "technically possible"
 * @param input
 */
export const throwIfNotValidMessage = (input: unknown) => {
  const ebMessageSchema = z
    .object({
      messageType: z.nativeEnum(EBMessageType),
      id: z.string(),
      instanceId: z.string(),
      timestamp: z.number(),
      contentType: z.string(),
      contentEncoding: z.string(),
      traceId: z.string().optional(),
      correlationId: z.string().optional(),
      principalId: z.string().optional(),
      eventName: z.string().optional(),
      otp: z.string().optional(),
    })
    .passthrough()

  try {
    ebMessageSchema.parse(input)
  } catch (error) {
    throw new UnhandledError(
      StatusCode.BadRequest,
      'Input is no valid PURISTA event bridge message - see https://purista.dev',
    )
  }
}
