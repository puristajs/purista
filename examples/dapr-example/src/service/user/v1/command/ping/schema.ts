import { extendApi } from '@purista/core'
import { z } from 'zod'

// define the input parameters
export const userV1PingInputParameterSchema = extendApi(z.object({}), { title: 'ping input parameter schema' })

// define the input payload
export const userV1PingInputPayloadSchema = extendApi(z.any(), { title: 'ping input payload schema' })

// define the output payload
export const userV1PingOutputPayloadSchema = extendApi(z.any(), { title: 'ping output payload schema' })
