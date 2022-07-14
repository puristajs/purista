import { extendApi } from '@anatine/zod-openapi'
import { z } from 'zod'

import { CommandFunction } from '../../../core/'
import { HttpServerService } from '../../HttpServerService.impl'

export const inputPayloadSchema = extendApi(z.unknown())

export const inputParameterSchema = z.object({})

export const outputPayloadSchema = z.any()

export type MessagePayloadType = z.input<typeof inputPayloadSchema>
export type FunctionPayloadType = z.output<typeof inputPayloadSchema>
export type MessageParameterType = z.input<typeof inputParameterSchema>
export type FunctionParameterType = z.output<typeof inputParameterSchema>
export type MessageResultType = z.output<typeof outputPayloadSchema>
export type FunctionResultType = z.input<typeof outputPayloadSchema>
export type FunctionImplementationType = CommandFunction<
  HttpServerService,
  MessagePayloadType,
  MessageParameterType,
  FunctionPayloadType,
  FunctionParameterType,
  FunctionResultType
>
