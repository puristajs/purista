import { z } from 'zod'

import { theServiceServiceBuilder } from '../../theServiceServiceBuilder'
import {
  theServiceV1InvokeFooInputParameterSchema,
  theServiceV1InvokeFooInputPayloadSchema,
  theServiceV1InvokeFooOutputPayloadSchema,
} from './schema'

export const invokeFooCommandBuilder = theServiceServiceBuilder
  .getCommandBuilder('invokeFoo', 'invokes foo command')
  .addPayloadSchema(theServiceV1InvokeFooInputPayloadSchema)
  .addParameterSchema(theServiceV1InvokeFooInputParameterSchema)
  .addOutputSchema(theServiceV1InvokeFooOutputPayloadSchema)
  .canInvoke(
    'TheService',
    '1',
    'foo',
    z.object({
      payload: z.any(),
      parameter: z.any(),
    }),
  )
  .setCommandFunction(async function ({ service }, payload, parameter) {
    return service.TheService['1'].foo(payload, parameter)
  })
