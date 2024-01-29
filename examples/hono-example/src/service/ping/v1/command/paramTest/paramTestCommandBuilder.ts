import { pingV1ServiceBuilder } from '../../pingV1ServiceBuilder'
import {
  pingV1ParamTestInputParameterSchema,
  pingV1ParamTestInputPayloadSchema,
  pingV1ParamTestOutputPayloadSchema,
} from './schema'

export const paramTestCommandBuilder = pingV1ServiceBuilder
  .getCommandBuilder('paramTest', 'Show how to use path parmater and query params')
  .addPayloadSchema(pingV1ParamTestInputPayloadSchema)
  .addParameterSchema(pingV1ParamTestInputParameterSchema)
  .addOutputSchema(pingV1ParamTestOutputPayloadSchema)
  .exposeAsHttpEndpoint('GET', 'param/:requiredParam/:optionalParam?')
  .disableHttpSecurity()
  .addQueryParameters({ name: 'optionalQuery', required: false }, { name: 'requiredQuery', required: true })
  .setCommandFunction(async function (_context, _payload, parameter) {
    // add your business logic here

    return {
      parameter,
    }
  })
