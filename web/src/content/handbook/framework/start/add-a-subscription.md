---
title: Add a subscription
description: React to an incident event without coupling the notification service to the command.
order: 150
---

Subscriptions react to an event after it has been published. They suit follow-up work such as sending a notification or updating a read model; the producer does not need to know the subscriber exists.

## Generate a notification service and subscription

```bash title="Generate service"
npm run add:service -- notification --description "Notify responders"
npm run add:subscription -- notify-responders \
  --description "Notify responders about a new incident" \
  --service notification \
  --service-version 1 \
  --event incidentCreated
```

The event name must exist in the project event inventory. The CLI uses it to generate the subscription declaration.

## Validate the event, then complete normally

The subscription generator also begins with an `unknown` input payload. Match
it to the command's success-event contract before accessing `payload.incidentId`:

```ts title="src/service/notification/v1/subscription/notifyResponders/schema.ts"
import { extendApi } from '@purista/core'
import { z } from 'zod'

export const notificationV1NotifyRespondersInputParameterSchema = extendApi(z.undefined(), { title: 'input parameter schema' })
export const notificationV1NotifyRespondersInputPayloadSchema = extendApi(
  z.object({ incidentId: z.string() }),
  { title: 'incident created event payload' },
)
```

A successful handler completes normally, so the EventBridge can acknowledge
the message. Replace the generated handler in its complete builder file:

```ts title="src/service/notification/v1/subscription/notifyResponders/notifyRespondersSubscriptionBuilder.ts"
import { ServiceEvent } from '../../../../serviceEvent.enum.js'
import { notificationV1ServiceBuilder } from '../../notificationV1ServiceBuilder.js'
import {
  notificationV1NotifyRespondersInputParameterSchema,
  notificationV1NotifyRespondersInputPayloadSchema,
} from './schema.js'

export const notifyRespondersSubscriptionBuilder = notificationV1ServiceBuilder
  .getSubscriptionBuilder('notifyResponders', 'Notify responders about a new incident')
  .subscribeToEvent(ServiceEvent.IncidentCreated)
  .addPayloadSchema(notificationV1NotifyRespondersInputPayloadSchema)
  .addParameterSchema(notificationV1NotifyRespondersInputParameterSchema)
  .setSubscriptionFunction(async function (context, _payload, _parameter) {
    context.logger.info('notification accepted')
  })
```

Use `retry` only when the operation is safe to run again. Before requesting retry, make the side effect idempotent; otherwise duplicate delivery can create duplicate notifications or charges.

| Declaration | What it establishes | Options and boundary |
| --- | --- | --- |
| [`getSubscriptionBuilder(name, description)`](/handbook/api/classes/_purista_core.ServiceBuilder/#getsubscriptionbuilder) | The named subscription and its operator-facing description. | The name identifies this consumer in service registration and operations; it is not the event name. |
| [`subscribeToEvent(eventName, serviceVersion?)`](/handbook/api/classes/_purista_core.SubscriptionDefinitionBuilder/#subscribetoevent) | The event-name filter, optionally scoped to the producing service's version. | The second argument is a service version, not an event-payload version. Match the producer's success-event contract deliberately. |
| [`addPayloadSchema(schema)`](/handbook/api/classes/_purista_core.SubscriptionDefinitionBuilder/#addpayloadschema) / [`addParameterSchema(schema)`](/handbook/api/classes/_purista_core.SubscriptionDefinitionBuilder/#addparameterschema) | Event body and parameter validation plus inferred handler inputs. | A custom event has `parameter: undefined`, so use `z.undefined()` or omit the parameter schema. |
| [`addOutputSchema(eventName, schema, contentType?, contentEncoding?)`](/handbook/api/classes/_purista_core.SubscriptionDefinitionBuilder/#addoutputschema) | A validated follow-up event emitted only after the subscription succeeds. | Use it only when another consumer needs a fact from this completed reaction. The CLI's `--response-event <name>` option generates this declaration. |
| [`setSubscriptionFunction(handler)`](/handbook/api/classes/_purista_core.SubscriptionDefinitionBuilder/#setsubscriptionfunction) | The side-effect implementation. A normal fulfilled result lets the bridge follow its configured acknowledgement path. | Use `async function` when the handler needs its service receiver. For durable delivery, acknowledgement, retry, and dead-letter choices, continue with [subscriptions](/handbook/framework/build-services/subscriptions/). |

## Start both participating services

The generated subscription is registered with the notification service, but it
cannot receive the incident event until both services share a started
EventBridge:

```ts title="src/index.ts"
import { type Service, gracefulShutdown, initLogger } from '@purista/core'
import { getEventBridge } from './eventbridge.js'
import { incidentV1Service } from './service/incident/v1/incidentV1Service.js'
import { notificationV1Service } from './service/notification/v1/notificationV1Service.js'
import { pingV1Service } from './service/ping/v1/pingV1Service.js'

export const main = async () => {
  const logger = initLogger()
  const eventBridge = await getEventBridge(logger)
  const services: Service[] = []

  const pingService = await pingV1Service.getInstance(eventBridge)
  await pingService.start()
  services.push(pingService)

  const notificationService = await notificationV1Service.getInstance(eventBridge)
  await notificationService.start()
  services.push(notificationService)

  const incidentService = await incidentV1Service.getInstance(eventBridge)
  await incidentService.start()
  services.push(incidentService)

  gracefulShutdown(logger, [eventBridge, ...services])
}

main()
```

Starting the notification service before the incident service means the
subscriber is registered before this local process sends its first incident.
The `ping` service remains in the generated application. All services must
finish starting before any command is invoked.

## Run one incident through the local runtime

The default project has an in-process EventBridge, not an HTTP server. `src/index.ts`
therefore starts the application but does not accept a command from a second
terminal. Add this short-lived verifier to exercise the real command and
subscription runtime in one process:

```ts title="src/verify-first-result.ts"
import { DefaultEventBridge, initLogger } from '@purista/core'

import type { IncidentV1CreateIncidentOutputPayload } from './service/incident/v1/command/createIncident/types.js'
import { incidentV1Service } from './service/incident/v1/incidentV1Service.js'
import { notificationV1Service } from './service/notification/v1/notificationV1Service.js'

const eventBridge = new DefaultEventBridge({ logger: initLogger('info') })
await eventBridge.start()

const notificationService = await notificationV1Service.getInstance(eventBridge)
await notificationService.start()

const incidentService = await incidentV1Service.getInstance(eventBridge)
await incidentService.start()

try {
  const result = await eventBridge.invoke<IncidentV1CreateIncidentOutputPayload>({
    sender: {
      serviceName: 'LocalVerifier',
      serviceVersion: '1',
      serviceTarget: 'verifyFirstResult',
      instanceId: eventBridge.instanceId,
    },
    receiver: {
      serviceName: incidentService.serviceInfo.serviceName,
      serviceVersion: incidentService.serviceInfo.serviceVersion,
      serviceTarget: 'createIncident',
    },
    contentType: 'application/json',
    contentEncoding: 'utf-8',
    payload: {
      payload: { title: 'API down', description: 'The public API is unavailable.' },
      parameter: {},
    },
  })

  console.log('Command result:', result)

  while (eventBridge.getInFlightExecutionCount() > 0) {
    await new Promise<void>(resolve => setImmediate(resolve))
  }
} finally {
  await notificationService.destroy()
  await incidentService.destroy()
  await eventBridge.destroy()
}
```

`EventBridge.invoke` is the local runtime boundary for this verifier: its
receiver address selects the registered command, and its generic result uses
the command's generated output type. The command still validates its input and
output and publishes `incidentCreated`; the loop waits until the in-process
bridge has no active handler before shutdown. It is not the way one service
should normally call another service. Use a declared `canInvoke` capability
from a handler, or [expose a command over HTTP](/handbook/framework/expose-and-consume-services/http-and-rest/), for those boundaries.

## Verify

Run the subscription test and then the verifier. It prints the command result
and the notification handler writes `notification accepted` through the
structured logger. The default stores also warn that they are development-only;
that warning is expected for this local path.

With the default EventBridge, event delivery is local to one process. Use a
real EventBridge when services run in separate processes or need broker-backed
delivery.

Next: [run and verify the application](/handbook/framework/start/run-and-verify/).
