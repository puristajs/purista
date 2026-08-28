---
title: Create the first service
description: Create a versioned incident service and start it through the application composition root.
order: 130
---

A service is the boundary for related business behavior. Create one for incidents before adding a command; this gives the command an address, configuration, resources, and lifecycle.

## Generate the boundary

```bash title="Generate service"
npm run add:service -- incident --description "Manage reported incidents"
```

The command creates `src/service/incident/v1/` and adds the generated service to the project structure. The service is not usable until the application creates and starts an instance.

`incident` is the required, non-empty service name; it becomes part of every
command, event, and client address the service owns. `--description` is also
required and becomes the service's human-readable metadata. The CLI uses
version `1` unless you pass `--version`; treat a changed version as a new
contract boundary, not a rename.

## Start it in the composition root

Use the generated service export in `src/index.ts`:

```ts title="src/index.ts"
import { DefaultEventBridge } from '@purista/core'
import { incidentV1Service } from './service/incident/v1/incidentV1Service.js'

const eventBridge = new DefaultEventBridge()
await eventBridge.start()

const incidentService = await incidentV1Service.getInstance(eventBridge)
await incidentService.start()
```

The composition root owns this order:

| Call | What it needs | What it does | Important boundary |
| --- | --- | --- | --- |
| [`new DefaultEventBridge()`](/handbook/api/classes/_purista_core.DefaultEventBridge/) | No additional package or broker for this local path. | Creates the included, in-process EventBridge. | It cannot connect independently deployed services. Choose and wire a transport adapter before a distributed deployment. |
| [`eventBridge.start()`](/handbook/api/classes/_purista_core.DefaultEventBridge/#start) | The bridge instance. | Starts the message transport that services use to register and exchange messages. | Start it before any service. A failed bridge startup means there is no usable service runtime. |
| [`incidentV1Service.getInstance(eventBridge, options?)`](/handbook/api/classes/_purista_core.ServiceBuilder/#getinstance) | A started EventBridge; optional runtime bindings such as stores, resources, logging, or validated `serviceConfig`. | Resolves the generated definitions and creates one typed service instance. | This does **not** start the service. If the builder declares resources or a config schema, the corresponding options are required or validated here. |
| [`incidentService.start()`](/handbook/api/classes/_purista_core.Service/#start) | The created instance. | Validates its configuration, registers its definitions, and announces that the service is ready. | A second call fails; shut the instance down instead of trying to start it twice. |

`DefaultEventBridge` is included in `@purista/core` and stays in process. It is
the right default for this local path, not a replacement for AMQP, NATS, MQTT,
or Dapr in a distributed deployment. The generated service has no required
runtime options yet, so the small call is intentionally inferred from its
builder. Add concrete adapters at this composition root as the service gains
stores, resources, queues, or HTTP exposure.

## Verify

Run the generated tests before adding behavior:

```bash title="Run generated project checks"
npm test
```

If startup fails, first confirm that the import points to the generated
`incidentV1Service.ts` export and that the EventBridge starts before the
service. A missing required resource or invalid `serviceConfig` rejects
`getInstance(...)`; a duplicate start or failed bridge registration rejects
`start()`. The exact file name follows the `fileConvention` in `purista.json`.

Next: [add a command](/handbook/framework/start/add-a-command/).
