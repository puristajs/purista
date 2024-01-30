import { extendApi } from '@purista/core'
import { z } from 'zod'

// define the input parameters
export const theServiceV1DeleteInputParameterSchema = extendApi(z.object({}), {
  title: 'delete input parameter schema',
})

// define the input payload
export const theServiceV1DeleteInputPayloadSchema = extendApi(z.any(), { title: 'delete input payload schema' })

// define the output payload
export const theServiceV1DeleteOutputPayloadSchema = extendApi(z.void(), {
  title: 'put output payload schema',
})
