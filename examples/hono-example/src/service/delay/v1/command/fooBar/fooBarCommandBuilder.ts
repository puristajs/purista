import { delayV1ServiceBuilder } from '../../delayV1ServiceBuilder.js'
import {
  delayV1FooBarInputParameterSchema,
  delayV1FooBarInputPayloadSchema,
  delayV1FooBarOutputPayloadSchema,
} from './schema'

export const fooBarCommandBuilder = delayV1ServiceBuilder
  .getCommandBuilder('fooBar', 'Example for an exposed command')
  .addPayloadSchema(delayV1FooBarInputPayloadSchema)
  .addParameterSchema(delayV1FooBarInputParameterSchema)
  .addOutputSchema(delayV1FooBarOutputPayloadSchema)
  .disableHttpSecurity()
  .exposeAsHttpEndpoint('GET', 'foo-bar/:p/:q?')
  .setCommandFunction(async function (_context, _payload, parameter) {
    return { foo: 'bar', parameter }
  })
