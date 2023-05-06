import { extendApi } from '@purista/core'
import { z } from 'zod'

// define the input parameters
export const theServiceV1PostInputParameterSchema = extendApi(z.object({}), { title: 'post input parameter schema' })

// define the input payload
export const theServiceV1PostInputPayloadSchema = extendApi(z.any(), { title: 'post input payload schema' })

// define the output payload
export const theServiceV1PostOutputPayloadSchema = extendApi(z.any(), {
  title: 'post output payload schema',
})
