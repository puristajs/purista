import { z } from 'zod/v4'

// define the input payload
export const honoV1ServiceCommandsToRestApiInputPayloadSchema = z.record(z.string(), z.unknown())
