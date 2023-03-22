import { extendApi } from '@anatine/zod-openapi'
import { z } from 'zod'

// define the input parameters
export const theServiceV1PingInputParameterSchema = extendApi(z.object({}), { title: 'ping input parameter schema' })

// define the input payload
export const theServiceV1PingInputPayloadSchema = extendApi(z.undefined(), { title: 'ping input payload schema' })

// define the output payload
export const theServiceV1PingOutputPayloadSchema = extendApi(z.object({ ping: z.boolean() }), {
  title: 'ping output payload schema',
})
