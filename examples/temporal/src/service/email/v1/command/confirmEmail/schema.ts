import { extendApi } from '@purista/core'
import { z } from 'zod'

// define the input parameters
export const emailV1ConfirmEmailInputParameterSchema = extendApi(z.object({}), {
  title: 'confirmEmail input parameter schema',
})

// define the input payload
export const emailV1ConfirmEmailInputPayloadSchema = extendApi(
  z.object({
    email: extendApi(z.string().email().toLowerCase(), { title: 'The users name', example: 'john_doe@example.com' }),
  }),
  { title: 'confirmEmail input payload schema' },
)

// define the output payload
export const emailV1ConfirmEmailOutputPayloadSchema = extendApi(z.any(), {
  title: 'confirmEmail output payload schema',
})
