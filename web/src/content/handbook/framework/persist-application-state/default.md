---
title: Use the default state store locally
description: Seed and wire the included in-memory state store for a local result or deterministic test, never as a production source of truth.
order: 620
---

`DefaultStateStore` is part of `@purista/core` and requires no installation.
It is a process-local map: values disappear on restart and are not shared with
another process. Its implementation warns that it is not secure for production.
Use it for a local walkthrough or deterministic service test—not idempotency,
recovery, or tenant state in production.

```ts title="src/index.ts"
import { DefaultStateStore } from '@purista/core'
import { userV1Service } from './service/user/v1/userV1Service.js'

const stateStore = new DefaultStateStore({
  config: { 'user:v1:users': [] },
})

const userService = await userV1Service.getInstance(eventBridge, { stateStore })
```

Reads, writes, and removals are all enabled by default. Disable an operation
only when a local test or process must be read-only. The configuration below
shows those permissions explicitly because it documents a mutable test double:

```ts title="test/support/createStateStore.ts"
import { DefaultStateStore } from '@purista/core'

export const createStateStore = () => new DefaultStateStore({
  enableGet: true,
  enableSet: true,
  enableRemove: true,
  config: { 'user:v1:users': [] },
})
```

Within a handler, use a stable, service-owned key and validate the value before
using it. A key prefix helps operations and migration; it is not tenant
isolation by itself. See [key and consistency design](/handbook/framework/persist-application-state/keys-namespaces-isolation-and-consistency/) before using this pattern for a real side effect.

```ts title="src/service/user/v1/command/signUp/signUpCommandBuilder.ts"
import { z } from 'zod'

const usersKey = 'user:v1:users'
const userListSchema = z.array(z.object({ id: z.string().uuid(), email: z.string().email() }))

const stored = await context.states.getState(usersKey)
const users = userListSchema.parse(stored[usersKey] ?? [])

await context.states.setState(usersKey, [...users, newUser])
```

Choose a durable [state-store adapter](/handbook/framework/persist-application-state/)
before work depends on a restart, another worker/process, or a delivery retry.
Define retention, backup, access control, concurrency/consistency, and
tenant-scoped keys in addition to adapter selection.
