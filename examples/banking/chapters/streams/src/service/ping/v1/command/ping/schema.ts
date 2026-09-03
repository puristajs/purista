import { extendApi } from '@purista/core'
import { z } from 'zod'

export const pingV1PingInputParameterSchema = extendApi(z.object({}), { title: 'input parameter schema' })

export const pingV1PingInputPayloadSchema = extendApi(z.unknown(), { title: 'input payload schema' })

export const pingV1PingOutputPayloadSchema = extendApi(z.void(), { title: 'output payload schema' })
