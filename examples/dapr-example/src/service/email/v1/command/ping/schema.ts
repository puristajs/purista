import { extendApi } from '@anatine/zod-openapi'
import { z } from 'zod'

// define the input parameters
export const emailV1PingInputParameterSchema = extendApi(z.object({}), { title: 'ping input parameter schema' })

// define the input payload
export const emailV1PingInputPayloadSchema = extendApi(z.any(), { title: 'ping input payload schema' })

// define the output payload
export const emailV1PingOutputPayloadSchema = extendApi(z.any(), { title: 'ping output payload schema' })
