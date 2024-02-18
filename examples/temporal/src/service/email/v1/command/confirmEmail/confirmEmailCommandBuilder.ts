import { HandledError, StatusCode, UnhandledError } from '@purista/core'
import { Client, Connection } from '@temporalio/client'
import { OpenTelemetryWorkflowClientInterceptor } from '@temporalio/interceptors-opentelemetry'

import { ServiceEvent } from '../../../../ServiceEvent.enum.js'
import { emailV1ServiceBuilder } from '../../emailV1ServiceBuilder.js'
import {
  emailV1ConfirmEmailInputParameterSchema,
  emailV1ConfirmEmailInputPayloadSchema,
  emailV1ConfirmEmailOutputPayloadSchema,
} from './schema.js'

export const confirmEmailCommandBuilder = emailV1ServiceBuilder
  .getCommandBuilder('confirmEmail', 'confirms an email address')
  .setSuccessEventName(ServiceEvent.EmailAddressConfirmed)
  .addPayloadSchema(emailV1ConfirmEmailInputPayloadSchema)
  .addParameterSchema(emailV1ConfirmEmailInputParameterSchema)
  .addOutputSchema(emailV1ConfirmEmailOutputPayloadSchema)
  .exposeAsHttpEndpoint('POST', 'verify')
  .disableHttpSecurity()
  .setCommandFunction(async function ({ states }, payload, _parameter) {
    const exist = await states.getState(payload.email)
    if (!exist[payload.email]) {
      throw new HandledError(StatusCode.BadRequest, 'Unknown email')
    }

    const connection = await Connection.connect({ address: 'localhost:7233' })

    const client = new Client({
      connection,
      interceptors: {
        workflow: [new OpenTelemetryWorkflowClientInterceptor({ tracer: this.getTracer() })],
      },
    })

    try {
      await client.workflow.getHandle(`onboarding-${payload.email}`).signal('signal-email-verified')
    } catch (error) {
      const err = error as Error
      if (err.name === 'WorkflowNotFoundError') {
        throw new HandledError(StatusCode.BadRequest, 'Invalid email')
      }
      throw UnhandledError.fromError(err)
    }
  })
