import { CommandFunction, Service } from '@purista/core'
import { randomUUID } from 'crypto'
import { z } from 'zod'

import { inputParameterSchema, inputPayloadSchema, outputPayloadSchema } from './schema'

/**
 * If you like to have the implementation of your function in a separate file,
 * you will need to define the types for inputs and output.
 *
 * You can simply copy and paste the following code for type definitions in this case.
 *
 * The input type for a schema can differ from output type, as you are able to set defaults.
 * You are also able to transform values.
 * For example transformation from number to string is possible with zod.
 *
 * This means we need to handle it.
 *
 **/
export type MessagePayloadType = z.input<typeof inputPayloadSchema>
export type FunctionPayloadType = z.output<typeof inputPayloadSchema>
export type MessageParameterType = z.input<typeof inputParameterSchema>
export type FunctionParameterType = z.output<typeof inputParameterSchema>
export type MessageResultType = z.output<typeof outputPayloadSchema>
export type FunctionResultType = z.input<typeof outputPayloadSchema>

/**
 * This is some helper type to reduce code in the implementation file.
 * Be aware that original message payload property (payload and parameter) might not have the real type here, if you use the transform input hook!
 */
export type FunctionImplementationType = CommandFunction<
  Service,
  MessagePayloadType,
  MessageParameterType,
  FunctionPayloadType,
  FunctionParameterType,
  FunctionResultType
>

export const signUp: FunctionImplementationType = async function ({ logger }, payload, _parameter) {
  logger.debug({ payload }, 'sign up new user')

  const uuid = randomUUID()

  return {
    uuid,
  }
}
