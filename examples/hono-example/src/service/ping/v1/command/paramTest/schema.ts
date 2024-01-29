import { extendApi } from '@purista/core'
import { z } from 'zod'

// define the input parameters
export const pingV1ParamTestInputParameterSchema = extendApi(
  z.object({
    optionalQuery: extendApi(z.string().optional(), { example: 'optional' }),
    requiredQuery: extendApi(z.string(), { example: 'required' }),
    requiredParam: extendApi(z.string(), { example: 'required_id' }),
    optionalParam: extendApi(z.string().optional(), { example: 'optionalParam' }),
  }),
  {
    title: 'paramTest input parameter schema',
  },
)

// define the input payload
export const pingV1ParamTestInputPayloadSchema = extendApi(z.undefined(), { title: 'paramTest input payload schema' })

// define the output payload
export const pingV1ParamTestOutputPayloadSchema = extendApi(
  z.object({
    parameter: z.object({
      optionalQuery: extendApi(z.string().optional(), { example: 'optional' }),
      requiredQuery: extendApi(z.string(), { example: 'required' }),
      requiredParam: extendApi(z.string(), { example: 'required_id' }),
      optionalParam: extendApi(z.string().optional(), { example: 'optionalParam' }),
    }),
  }),
  { title: 'paramTest output payload schema' },
)
