---
title: Enterprise interoperability
description: Exchange versioned business messages with external systems without making internal service details their contract.
order: 830
---

Treat an external integration as a boundary with its own schema, ownership,
security, and recovery policy. Export a stable event/command contract,
translate at the boundary, and keep internal service refactors behind that
translation.

## Publish a partner contract, not an internal object

For a logistics partner, translate the internal `shipment.created` event into a
versioned partner event at one adapter/boundary. The partner gets the contract
you commit to support; it does not get a database row, an internal command name,
or every framework message field.

PURISTA can map a custom message to CloudEvents 1.0 when that is the agreed
wire format. The mapping carries the event payload plus trace, correlation,
tenant, principal, and sender extensions. Agree with the partner which fields
they may trust and which identities are established by the authenticated
transport, rather than accepting identity from a public event body.

```ts title="src/integration/logistics/toPartnerEvent.ts"
import { toCloudEvent, type CustomMessage } from '@purista/core'

type ShipmentCreatedPayload = {
  shipmentId: string
  destinationCountry: string
}

export const toPartnerEvent = (message: CustomMessage<ShipmentCreatedPayload>) => ({
  ...toCloudEvent(message),
  type: 'com.example.logistics.shipment.created.v1',
  data: {
    shipmentId: message.payload.shipmentId,
    destinationCountry: message.payload.destinationCountry,
  },
})
```

The boundary deliberately selects a small payload. Add a schema validation test
for this partner event and a compatibility rule: add optional fields in a new
compatible revision; publish a new event type/version for a breaking meaning or
shape change.

| Do | Do not |
| --- | --- |
| Version and validate a message contract | Publish a database row or internal error object |
| Propagate a trusted correlation/trace context | Accept tenant/principal identity from an untrusted payload |
| Define retry and dead-letter ownership | Retry an unknown external side effect indefinitely |
| Use a broker adapter with explicit guarantees | Assume all brokers provide the same durability |

## Own failure and change separately

| Boundary concern | Decide explicitly |
| --- | --- |
| Authentication | Mutual TLS, workload identity, API key, or broker identity—and its rotation owner |
| Authorization | Exact publish/subscribe subject/queue permissions per partner |
| Delivery | Retention, duplicate/order behavior, retry/DLQ owner, and replay approval path |
| Compatibility | Schema/event version, deprecation window, and consumer verification process |
| Privacy | Allowed fields, residency, retention, audit access, and redaction rules |

Use the EventBridge guide to choose AMQP, NATS, MQTT, or Dapr. For regulated
exchange, record the contractual schema/version and ensure broker permissions
restrict the partner to its intended subjects/queues. Test the translator and a
real authenticated broker round trip; do not treat a shared TypeScript type as
a cross-company contract.

Next: [chapter overview](/handbook/framework/apply-patterns-and-recipes/).
