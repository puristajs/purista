---
title: Service discovery and contracts
description: Use application/platform discovery with exported contracts; the Framework does not ship a service registry.
order: 450
---

PURISTA addresses a capability by service name, service version, and target
name. It does not ship a service registry that resolves process locations.
Keep the logical PURISTA address in the service definition and let the selected
transport boundary resolve its physical destination.

| Boundary | What the application addresses | Where physical discovery belongs |
| --- | --- | --- |
| Embedded `DefaultEventBridge` | Service, version, and command/stream name | Application composition: the provider instance and caller use the same started bridge. |
| Broker-backed EventBridge | Service, version, and command/stream name | Broker adapter configuration, broker routing, and the deployment platform. |
| PURISTA HTTP endpoint | Versioned route projected from a command or stream | DNS, ingress, service mesh, gateway, or application configuration supplies the HTTP base URL. |
| External HTTP API | An application-owned URL and route | The external provider's discovery contract and your [`HttpClient`](/handbook/api/classes/_purista_core.HttpClient/) resource configuration. |

## Resolve an HTTP endpoint from application configuration

Publish a generated client package from reviewed service definitions, then
supply the deployment-specific base URL in the consuming application. Do not
compile a cluster hostname or production credential into the generated
package.

```ts title="src/client/invoiceClient.ts"
import { InvoiceHttpClient } from '@acme/invoice-client'

const invoiceApiUrl = process.env.INVOICE_API_URL

if (!invoiceApiUrl) {
  throw new Error('INVOICE_API_URL is required')
}

export const invoiceClient = new InvoiceHttpClient({
  baseUrl: invoiceApiUrl,
  defaultTimeout: 5_000,
  bearerToken: process.env.INVOICE_API_TOKEN,
})
```

The generated constructor options configure transport behavior. They do not
alter the service name, version, command schemas, or HTTP route captured in the
definition artifact. See
[`ClientBuilder.generateHttpClient()`](/handbook/api/classes/_purista_core.ClientBuilder/#generatehttpclient)
and [service clients](/handbook/framework/expose-and-consume-services/service-clients/)
for the complete generation flow.

For a browser application, normally point the generated client at your public
gateway and authenticate through that gateway. For a server application,
inject the URL and secret through the platform's configuration and secret
facilities. Use [configuration stores](/handbook/framework/configure-applications/configuration-stores/)
when the application needs a PURISTA configuration-store adapter; the Framework
does not automatically watch that store and rebuild existing client instances.

## Keep discovery separate from contract compatibility

A reachable endpoint can still implement an incompatible service version.
Export service definitions with
[`exportServiceDefinitions()`](/handbook/api/functions/_purista_core.exportServiceDefinitions/),
commit or publish the artifact, and regenerate the consumer client from that
reviewed version. For public HTTP, publish and diff the OpenAPI document as a
second consumer-facing artifact.

Verify a distributed release at the real boundary:

1. Start the provider and confirm its readiness probe is healthy.
2. Resolve the configured DNS, gateway, or broker endpoint from the consumer's
   network namespace.
3. Call one versioned capability with a valid identity and expected tenant.
4. Repeat with a missing or unauthorized identity and verify the controlled
   rejection.
5. Exercise timeout and provider-unavailable behavior; do not assume a timeout
   means the command was not received.
6. Compare the released definition/OpenAPI artifacts with the generated client
   version used by the consumer.

Discovery never grants authorization. The HTTP authentication middleware or
trusted message boundary establishes principal and tenant identity, while
business guards decide whether that identity may perform the operation.

Next: [service clients](/handbook/framework/expose-and-consume-services/service-clients/),
[HTTP and REST](/handbook/framework/expose-and-consume-services/http-and-rest/),
and [configuration stores](/handbook/framework/configure-applications/configuration-stores/).
