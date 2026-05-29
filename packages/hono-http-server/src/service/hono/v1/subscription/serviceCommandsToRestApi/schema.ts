import { z } from 'zod'

/**
 * Schema for dynamic endpoint metadata received from service definition info messages.
 */
export const honoV1ServiceCommandsToRestApiInputPayloadSchema = z.record(z.string(), z.unknown())
