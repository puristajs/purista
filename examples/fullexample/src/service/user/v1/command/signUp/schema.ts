import { extendApi } from '@anatine/zod-openapi'
import { z } from 'zod'

// define the input parameters
export const userV1SignUpInputParameterSchema = extendApi(z.object({}), { title: 'sign up input parameter schema' })

// define the input payload
export const userV1SignUpInputPayloadSchema = extendApi(
  z.object({
    email: extendApi(z.string().email(), { title: 'the email of the user to register', example: 'user@email.com' }),
    name: extendApi(z.string().min(3), {
      title: 'the name of the user to register',
      example: 'User',
    }),
    password: extendApi(z.string().min(3), {
      title: 'the name login password',
      example: 'password',
    }),
  }),
  { title: 'the sign up input' },
)

// define the output payload
export const userV1SignUpOutputPayloadSchema = extendApi(
  z.object({
    userId: extendApi(z.string().uuid(), { title: 'the user id', example: 'a5fef052-911c-472c-ac25-e2da327f0af5' }),
  }),
  { title: 'sign up output payload schema' },
)
