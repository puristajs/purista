import { extendApi } from '@purista/core'
import { z } from 'zod'

// define the input parameters
export const userV1GetUserByIdInputParameterSchema = extendApi(
  z.object({
    userId: extendApi(z.string().uuid(), { title: 'the user id', example: 'a5fef052-911c-472c-ac25-e2da327f0af5' }),
  }),
  { title: 'get user by id input payload schema' },
)

// define the input payload
export const userV1GetUserByIdInputPayloadSchema = z.undefined()

// define the output payload
export const userV1GetUserByIdOutputPayloadSchema = extendApi(
  z.object({
    userId: extendApi(z.string().uuid(), { title: 'the user id', example: 'a5fef052-911c-472c-ac25-e2da327f0af5' }),
    email: extendApi(z.string().email(), { title: 'the email of the user to register', example: 'user@email.com' }),
    name: extendApi(z.string().min(3), {
      title: 'the name of the user to register',
      example: 'User',
    }),
  }),
  { title: 'the sign up input' },
)
