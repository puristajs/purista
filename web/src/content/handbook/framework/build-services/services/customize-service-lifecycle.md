---
title: Customize service lifecycle
description: Extend the Service class only when a long-lived business boundary must start and stop with the service rather than a normal injected resource.
order: 316
---

Most services need a resource, not a subclass. Use [`setCustomClass(...)`](/handbook/api/classes/_purista_core.ServiceBuilder/#setcustomclass) when
the service itself owns a long-lived listener or gateway whose lifecycle must be
coordinated with service startup and shutdown. Do not use a custom class as a
second dependency container.

```ts title="src/service/ledger/v1/ledgerV1ServiceBuilder.ts"
import { Service, ServiceBuilder, type ServiceClassTypes } from '@purista/core'
import type { LedgerGateway } from '../../../resource/ledgerGateway.js'
import { ledgerServiceInfo } from './ledgerV1ServiceInfo.js'

type LedgerServiceTypes = ServiceClassTypes<{}, { ledgerGateway: LedgerGateway }>

class LedgerGatewayService extends Service<LedgerServiceTypes> {
  async start() {
    await super.start()
    try {
      await this.resources.ledgerGateway.open()
    } catch (error) {
      await super.destroy()
      throw error
    }
  }

  async destroy() {
    try {
      await this.resources.ledgerGateway.close()
    } finally {
      await super.destroy()
    }
  }
}

export const ledgerV1ServiceBuilder = new ServiceBuilder(ledgerServiceInfo)
  .defineResource<'ledgerGateway', LedgerGateway>()
  .setCustomClass(LedgerGatewayService)
```

| Use a custom class | Prefer a resource |
| --- | --- |
| A listener/connection must open only after normal service registration | A database, HTTP, cache, or SDK client is made by application bootstrap |
| Shutdown ordering is part of the business boundary | A focused dependency is enough for handlers |
| The class can preserve normal base lifecycle behavior | The class would store credentials or hide unrelated workflows |

[`setCustomClass(...)`](/handbook/api/classes/_purista_core.ServiceBuilder/#setcustomclass) replaces the constructor used by [`getInstance(...)`](/handbook/api/classes/_purista_core.ServiceBuilder/#getinstance);
[`getCustomClass()`](/handbook/api/classes/_purista_core.ServiceBuilder/#getcustomclass) returns the currently configured constructor. Call
`super.start()` and `super.destroy()` once, preserve the required ordering, and
let startup fail when the owned boundary cannot become ready. The base `destroy`
cancels streams, stops workers, and tears down a started QueueBridge, so a
subclass must not bypass it.

Test the custom lifecycle with a fake resource, retain the aggregate setup test,
and add adapter integration coverage for a real external connection. For the
API, see [ServiceBuilder](/handbook/api/classes/_purista_core.ServiceBuilder/).
