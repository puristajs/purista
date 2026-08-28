---
title: Service discovery and contracts
description: Use application/platform discovery with exported contracts; the Framework does not ship a service registry.
order: 450
---

The current public Framework packages do not ship a service registry or discovery provider. Use your deployment platform, DNS, gateway, broker topology, or application configuration to resolve a service endpoint, and keep the Framework service contract versioned independently.

For a distributed deployment, verify:

- the service version and message schemas match the client expectation;
- the chosen EventBridge or HTTP endpoint is reachable from the client network;
- client timeout, retry, and identity propagation rules are explicit; and
- API/OpenAPI artifacts are generated as part of release verification.

Do not use discovery to bypass tenant authorization. A resolvable service is not automatically an authorized service. Next: [service clients](/handbook/framework/expose-and-consume-services/service-clients/) and [configuration stores](/handbook/framework/configure-applications/configuration-stores/).
