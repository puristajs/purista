import { extendApi } from '@anatine/zod-openapi'
import { z } from 'zod'

// define the input parameters
export const inputParameterSchema = z.object({
  search: z.string().optional(),
  limit: z.string().optional(),
})

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
    test: z.string().default('some default value for optional field'),
  }),
)

// define the output payload
export const outputPayloadSchema = extendApi(
  z.object({
    uuid: extendApi(z.string().uuid(), { example: 'e118e649-09c4-4d00-917b-3a0a940e1d45', title: 'the users uuid' }),
  }),
)
