import { extendApi } from '@anatine/zod-openapi'
import { z } from 'zod'

// define the input parameters
export const userV1GetAllUsersInputParameterSchema = extendApi(z.object({}), {
  title: 'get all users input parameter schema',
})

// define the input payload
export const userV1GetAllUsersInputPayloadSchema = z.undefined()

export const userV1GetAllUsersUserEntrySchema = z.object({
  userId: extendApi(z.string().uuid(), { title: 'the user id', example: 'a5fef052-911c-472c-ac25-e2da327f0af5' }),
  email: extendApi(z.string().email(), { title: 'the email of the user to register', example: 'user@email.com' }),
  name: extendApi(z.string().min(3), {
    title: 'the name of the user to register',
    example: 'User',
  }),
})

// define the output payload
export const userV1GetAllUsersOutputPayloadSchema = extendApi(z.array(userV1GetAllUsersUserEntrySchema), {
  title: 'get all users output payload schema',
})
