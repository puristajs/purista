import { randomUUID } from 'node:crypto'

import { HandledError, StatusCode } from '@purista/core'

import { EventName } from '../../../../types'
import { UserFunction } from '../../UserFunction.enum'
import { UserServiceBuilder } from '../../UserServiceBuilder'
import {
  inputParameterSchema,
  inputPayloadSchema,
  outputPayloadSchema,
  transformInputSchema,
  transformOutputSchema,
  transformParameterSchema,
} from './schema'

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
  // optional if you want to use event name (recommended) and you did not set the event name in constructor of FunctionDefinitionBuilder
  .setSuccessEventName(EventName.NewUserSignedUp)

  // recommended: set the input payload validation and because of that the input payload type(s)
  // even if you do not use payload within your function define the schema and set it to z.unknown()
  .addInputSchema(inputPayloadSchema)
  // recommended: set the input parameter validation and because of that the input parameter type(s)
  // even if you do not use parameter within your function define the schema and set it to z.unknown()
  .addParameterSchema(inputParameterSchema)
  // recommended: set the output payload validation and because of that the output payload type(s)
  // even if you do not return a payload within your function define the schema and set it to z.void()
  .addOutputSchema(outputPayloadSchema)
  // optional: before guard is executed after input transform and schema validation and before function
  // put your business validation of request here
  .setBeforeGuardHook(async function (_context, payload, _params) {
    if (payload.email === 'blacklisted@example.com') {
      throw new HandledError(StatusCode.Unauthorized)
    }
  })
  // optional: after guard is executed after function, after output validation and before output transform
  .setAfterGuardHook(async function (_context, _payload, _params) {
    // if it throws other than a handled error the response will be a error response with internal server error 500
    // throw a handled error here to use your own status code and maybe respond with more details
  })
  // optional: mark the function as http endpoint
  // set the http method and (partial) path and optional set content type (defaults to application/json)
  .exposeAsHttpEndpoint('POST', '/sign-up', 'text/plain')
  // optional: if you mark the function as http endpoint,
  // the endpoint is per default marked as not public (auth required)
  // set the endpoint to be public or not
  .enableHttpSecurity(false)
  // or as alternative
  .disableHttpSecurity(true)
  // optional: add tags for openApi (swagger)
  .addTags('User', 'Public')
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
  // optional: if you expose as http endpoint, the basic response codes
  // 200, 204, 400, 401, 500 are auto-documented based on schema and http method.
  // if you throw other codes somewhere in you logic, add them here, to get them documented in openApi
  .addErrorStatusCodes(StatusCode.PaymentRequired, StatusCode.Conflict)
  // mandatory: the function implementation
  // optional: transform (decode) the input payload and parameter
  // for example if you have end-to-end decryption or the payload is a string wich needs to be decoded first
  .transformInput(transformInputSchema, transformParameterSchema, async function (_context, payload, params) {
    // if something throws here, it will be automatically converted into a handled error
    // a bad request 400 error response is send without any further information
    // you can throw your own handled error if you need to send a other or more detailed error
    return {
      payload: JSON.parse(payload),
      params,
    }
  })
  // optional: transform (encode) the success output payload
  // for example if you like to encrypt the response or encode is needed
  .transformOutput(transformOutputSchema, async function (_context, payload, _params) {
    return JSON.stringify(payload)
  })
  .setFunction(async function ({ logger, message, invoke }, payload, parameter) {
    logger.debug(payload.test)
    logger.debug(message.payload.payload)
    logger.debug({ parameter }, 'function input parameter')

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

    logger.debug({ invokeResponse }, 'response from other service function invocation')

    logger.debug({ payload }, 'sign up new user')

    const uuid = randomUUID()

    return {
      uuid,
    }
  })
