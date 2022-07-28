import { randomUUID } from 'node:crypto'

import { EventName } from '../../../../types'
import { UserFunction } from '../../UserFunction.enum'
import { UserServiceBuilder } from '../../UserServiceBuilder'
import { inputParameterSchema, inputPayloadSchema, outputPayloadSchema } from './schema'

/**
 * Example of defining a function for a service.
 * As types are generated out of schema definitions you should have some order.
 *
 * First define input and output schemas.
 * Next define transform input/output hooks.
 *
 * Then define all other hooks.
 *
 * Add the implementation of you function as very last to ensure all information (types & co) are available.
 */
export const userSignUpBuilder = UserServiceBuilder.getFunctionBuilder(
  UserFunction.SignUpNewUser, // set the name of function within the service
  'Sign up a new unknown user', // a short description what the function does (for example used in openApi)
  EventName.NewUserSignedUp, // the event name for the success response message
)
  .setSuccessEventName(EventName.NewUserSignedUp)
  // recommended: set the input payload validation and because of that the input payload type(s)
  // even if you do not use payload within your function define the schema and set it to z.unknown()
  .addInputSchema(inputPayloadSchema)
  .addParameterSchema(inputParameterSchema)
  .addOutputSchema(outputPayloadSchema)
  .exposeAsHttpEndpoint('POST', '/sign-up')
  .disableHttpSecurity(true)
  // optional: add tags for openApi (swagger)
  .addTags('User')
  // optional: set the summery text for this function which is used for example in openApi
  .setSummary('Some function summery to explain a bit more')
  // optional: define http query parameters if you expose as http endpoint
  // query parameters will be add to input parameters and documented in openApi
  .addQueryParameters(
    {
      required: false,
      name: 'search',
    },
    {
      required: false,
      name: 'limit',
    },
  )

  .setFunction(async function ({ logger, message, invoke }, payload, parameter) {
    logger.debug(payload.test)
    logger.debug(message.payload.payload)
    logger.debug('function input parameter', parameter)

    const invokeResponse = await invoke<string>(
      {
        serviceName: this.serviceInfo.serviceName,
        serviceVersion: this.serviceInfo.serviceVersion,
        serviceTarget: UserFunction.TestFunction,
      },
      {
        sample: 'payload from signUp function',
      },
      {},
    )

    logger.debug('response from other service function invocation', invokeResponse)

    logger.debug('sign up new user', payload)

    const uuid = randomUUID()

    return {
      uuid,
    }
  })
