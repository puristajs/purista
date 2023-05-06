import { extendApi } from '@purista/core'
import { z } from 'zod'

// define the input parameters
export const theServiceV1PatchInputParameterSchema = extendApi(z.object({}), { title: 'patch input parameter schema' })

// define the input payload
export const theServiceV1PatchInputPayloadSchema = extendApi(z.any(), { title: 'patch input payload schema' })

// define the output payload
export const theServiceV1PatchOutputPayloadSchema = extendApi(z.any(), {
  title: 'patch output payload schema',
})
