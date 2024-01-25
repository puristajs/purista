import { pingV1ServiceBuilder } from '../../pingV1ServiceBuilder'
import { pingV1FooInputParameterSchema, pingV1FooInputPayloadSchema, pingV1FooOutputPayloadSchema } from './schema'

export const fooCommandBuilder = pingV1ServiceBuilder
  .getCommandBuilder('foo', 'Calls foo command')
  .addPayloadSchema(pingV1FooInputPayloadSchema)
  .addParameterSchema(pingV1FooInputParameterSchema)
  .addOutputSchema(pingV1FooOutputPayloadSchema)
  .exposeAsHttpEndpoint('GET', 'foo')
  .enableHttpSecurity()
  .setCommandFunction(async function (_context, _payload, _parameter) {
    // add your business logic here
    return {
      foo: 'foo',
    }
  })
