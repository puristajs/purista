---
title: Environment-specific configuration
description: Separate portable service definitions from deployment-specific values, credentials, and infrastructure endpoints.
order: 502
---

Keep service code portable across local, test, staging, and production environments. The application composition root selects the EventBridge, stores, endpoints, and resource implementations; the deployment supplies non-sensitive configuration and secrets through its approved mechanisms.

| Value | Put it in | Example |
| --- | --- | --- |
| Service behavior setting | Typed service configuration | Batch size or feature threshold |
| Adapter endpoint/region | Application configuration | Broker URL or AWS region |
| Technical credential needed to start or connect | Platform secret delivery / workload identity at the composition root | Broker password or service API token |
| Tenant/principal-owned or runtime-managed secret | Secret store | A user's integration token or delegated credential |
| Business record | State store/database | Incident or idempotency record |

Use distinct namespaces, identities, and backing resources for environments. Never rely on an environment-name string alone to prevent a staging workload from reading production configuration or secrets.

Next: [chapter overview](/handbook/framework/configure-applications/).
