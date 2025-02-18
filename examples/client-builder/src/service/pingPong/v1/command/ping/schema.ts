import { extendApi } from '@purista/core'
import { z } from 'zod'

export const pingPongV1PingInputParameterSchema = extendApi(z.object({}), { title: 'input parameter schema' })

export const pingPongV1PingInputPayloadSchema = extendApi(z.undefined(), { title: 'input payload schema' })

export const pingPongV1PingOutputPayloadSchema = extendApi(z.string(), { title: 'output payload schema' })
