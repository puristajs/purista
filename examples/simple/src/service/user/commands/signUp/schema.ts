import { extendApi } from '@anatine/zod-openapi'
import { z } from 'zod'

// define the input parameters
// parameters are given as object (key-value)
export const inputParameterSchema = z.object({})

// define the input payload
export const inputPayloadSchema = extendApi(
  z.object({
    email: extendApi(
      z
        .string()
        .email()
        .transform((email: string) => email.toLowerCase()),
      {
        example: 'newuser@example.com',
        title: 'the users email address',
      },
    ),
    password: extendApi(z.string().min(5), {
      example: 'the_super_secret_user_password',
      title: 'the user password',
    }),
  }),
)

// define the output payload
export const outputPayloadSchema = extendApi(
  z.object({
    uuid: extendApi(z.string().uuid(), { example: 'e118e649-09c4-4d00-917b-3a0a940e1d45', title: 'the users uuid' }),
  }),
)

export type InputPayloadType = z.infer<typeof inputPayloadSchema>
export type InputParameterType = z.infer<typeof inputParameterSchema>
export type OutputPayloadType = z.infer<typeof outputPayloadSchema>
