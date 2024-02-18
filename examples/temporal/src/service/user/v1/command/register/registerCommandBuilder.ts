import { HandledError, StatusCode } from '@purista/core'
import { Client, Connection } from '@temporalio/client'
import { OpenTelemetryWorkflowClientInterceptor } from '@temporalio/interceptors-opentelemetry'

import { ServiceEvent } from '../../../../ServiceEvent.enum.js'
import { userV1ServiceBuilder } from '../../userV1ServiceBuilder.js'
import {
  userV1RegisterInputParameterSchema,
  userV1RegisterInputPayloadSchema,
  userV1RegisterOutputPayloadSchema,
} from './schema.js'

export const registerCommandBuilder = userV1ServiceBuilder
  .getCommandBuilder('register', 'registers a new user')
  .setSuccessEventName(ServiceEvent.UserRegistrationStarted)
  .addPayloadSchema(userV1RegisterInputPayloadSchema)
  .addParameterSchema(userV1RegisterInputParameterSchema)
  .addOutputSchema(userV1RegisterOutputPayloadSchema)
  .exposeAsHttpEndpoint('POST', 'register')
  .disableHttpSecurity()
  .setCommandFunction(async function ({ logger, states }, payload, _parameter) {
    const existing = await states.getState(payload.email)

    if (existing[payload.email]) {
      throw new HandledError(StatusCode.BadRequest, 'Email already registered')
    }

    const connection = await Connection.connect({ address: 'localhost:7233' })

    const client = new Client({
      connection,
      interceptors: {
        workflow: [new OpenTelemetryWorkflowClientInterceptor({ tracer: this.getTracer() })],
      },
    })

    await states.setState(payload.email, payload)

    const handle = await client.workflow.start('onboardingWorkflow', {
      taskQueue: 'default-task-queue',
      args: [payload],
      // in practice, use a meaningful business ID, like customerId or transactionId
      workflowId: `onboarding-${payload.email}`,
    })
    logger.info(`Started workflow ${handle.workflowId}`)

    return {
      workflowId: handle.workflowId,
    }
  })
