import { extendApi } from '@purista/core'
import { z } from 'zod'

// define the input parameters
export const theServiceV1ErrorInputParameterSchema = extendApi(z.object({}), { title: 'error input parameter schema' })

// define the input payload
export const theServiceV1ErrorInputPayloadSchema = extendApi(z.undefined(), { title: 'error input payload schema' })

// define the output payload
export const theServiceV1ErrorOutputPayloadSchema = extendApi(z.object({ error: z.boolean() }), {
  title: 'error output payload schema',
})
