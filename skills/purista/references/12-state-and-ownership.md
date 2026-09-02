# State and capability ownership

Use this before adding persistence, session behavior, or a repository. A small
example simplifies the business problem while retaining PURISTA architecture.

## Choose the boundary

| Need | Owner and mechanism |
| --- | --- |
| Short-lived operational state: opaque sessions, resumable interaction state, transient preferences or caches | Service `stateStore` binding, accessed through `context.states` |
| Deployment settings | Validated service configuration; `configStore` for runtime key access |
| Credentials | `secretStore` or explicit secret injection; never ordinary state/config fixtures |
| Domain records and business history, even when the first use case only saves and reads one record | Service-owned database/repository resource |
| Remote API, identity provider, embeddings, search | Narrow declared resource, concrete implementation injected at startup |
| Agent conversation/checkpoint/workspace state | Supported Harness storage/workspace bindings under service `ai` options |

Choose by **what the data means and who owns it**, not by how few methods the
first chapter happens to call. A transaction, customer, account, posting,
document, case, or report is a business record. Put it behind a narrow resource
and inject a real database implementation at composition time. Do not move a
business record into StateStore merely because the lesson currently needs only
`save` and `getById`.

`DefaultStateStore` is already PURISTA's process-local store for operational
application state. Instantiate it at
the composition root when teaching store wiring, inject it intentionally, and
destroy supplied stores in application cleanup. Do not replace it with another
general-purpose Map wrapper. Sharing a backing adapter does not give services
permission to read each other's records.

`getState(...keys)` returns an object indexed by the requested keys, including
`undefined` for a missing value. `setState(key, value)` replaces one value;
`removeState(key)` removes it. Validate stored values. Encode service/version
and tenant/object boundaries unambiguously in keys. Prefixes do not authorize
access; use trusted identity and business guards.

The generic interface does not promise scans, atomic increments, compare-and-set,
cross-key transactions, or per-write TTL. For sessions, store and check an expiry
timestamp and identify the cleanup owner. Do not infer retention or durability
from an adapter name. A read followed by a write is not an atomic claim.

## Keep HTTP thin

Application REST operations belong in generated service commands and are
exposed with `exposeAsHttpEndpoint(...)`. This includes local login, current
session, and logout operations when the tutorial owns them. Mark only the login
command public with `makeEndpointPublic()`; generated endpoints are protected
by default. Configure `setProtectMiddleware(...)` once to authenticate protected
generated endpoints, resolve the opaque session, and set trusted `principalId`
and `tenantId` variables before the command runs.

Keep session resolution owned by the Identity service. One local pattern is an
internal `resolveSession` command with no HTTP exposure. The Hono protection
middleware can call it through the bound Hono service's `invoke(...)` method,
then set the returned trusted identity variables. The public login, protected
current-session, and protected logout operations remain ordinary generated
Identity endpoints. Do not read the shared StateStore directly from Hono
middleware.

Do not add parallel `http.app.get/post/...` lifecycle routes for operations that
fit command contracts. Custom Hono routes are reserved for static assets or a
protocol translation that a command/stream exposure cannot represent. Name and
test that exception. Body parsing, schema validation, body limits, Problem
Details, and public/protected selection should remain in the generated endpoint
path instead of being duplicated in application middleware.

If the application implements session issue/resolve/revoke, name the owning
capability and use the PURISTA state store. For a small local tutorial, returning
an opaque bearer session token from the public login command keeps all three
operations inside generated endpoints. The protection middleware extracts and
resolves that token. An external identity provider can instead be a declared
resource. Do not build a complete identity-provider product to teach guards.

Local fixture login must be labeled, restricted to local development, and
absent from production configuration. Identity is separate from current object
permissions. Guards authorize the action/object; mutable permission-sensitive
writes still need the required consistency at their write boundary.

## Keep the example small

Use few records and one visible result. Pure helpers and narrow repository
interfaces are useful. A custom session store, service registry, queue engine,
or global application state is not justified merely by calling it a demo.
Immutable fixtures and test message captures may use ordinary collections;
they are not application stores.

Keep a business repository narrow when a lesson only needs save/read-by-ID;
do not invent history indexes or financial balances. The narrow API is still a
resource boundary backed by a database. Use an in-process database when that is
the simplest honest dependency, or provide reproducible Compose setup when an
external database is part of the lesson. Do not adapt general PURISTA KV into a
domain repository or Harness storage.
