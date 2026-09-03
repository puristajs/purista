import { z } from 'zod'

export const identityV1LogoutInputParameterSchema = z.object({ sessionToken: z.uuid() })
export const identityV1LogoutInputPayloadSchema = z.undefined()
export const identityV1LogoutOutputPayloadSchema = z.object({ loggedOut: z.literal(true) })
