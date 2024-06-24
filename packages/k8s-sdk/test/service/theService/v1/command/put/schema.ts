import { extendApi } from '@purista/core'
import { z } from 'zod'

// define the input parameters
export const theServiceV1PutInputParameterSchema = extendApi(z.object({}), { title: 'put input parameter schema' })

// define the input payload
export const theServiceV1PutInputPayloadSchema = extendApi(z.any(), { title: 'put input payload schema' })

// define the output payload
export const theServiceV1PutOutputPayloadSchema = extendApi(z.any(), {
	title: 'put output payload schema',
})
