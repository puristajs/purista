import { extendApi } from '@purista/core'
import { z } from 'zod'

// define the input parameters
export const userV1ComputeDataInputParameterSchema = extendApi(z.object({}), {
	title: 'compute data input parameter schema',
})

// define the input payload
export const userV1ComputeDataInputPayloadSchema = extendApi(z.any(), { title: 'compute data input payload schema' })

// define the output payload
export const userV1ComputeDataOutputPayloadSchema = extendApi(z.any(), { title: 'compute data output payload schema' })
