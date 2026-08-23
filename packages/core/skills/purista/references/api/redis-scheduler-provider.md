# @purista/redis-scheduler-provider API Patterns

<!-- Generated from current TypeDoc; do not edit manually. -->
<!-- typedoc-digest: 33dfc6c4700fa85e -->

Use this reference only when working with `@purista/redis-scheduler-provider`. Every API name, callable pattern, and example below is extracted from the current public TypeDoc output. Do not invent a method that is absent here; consult the complete `../generated-api-manifest.json` and the public handbook when the API is not listed.

## Contents

- [RedisSchedulerProvider](#redisschedulerprovider)

## RedisSchedulerProvider

**class.** Redis-backed distributed occurrence provider for standalone Scheduler hosts. Source: `RedisSchedulerProvider.impl.ts:47`.

**Verified example**

```ts
const provider = new RedisSchedulerProvider({ config: { url: process.env.REDIS_URL } })
```

**Public callable patterns**

- `claimOccurrence(occurrence)` — Acquire a token-checked distributed lease unless this occurrence is completed or already claimed.
- `completeOccurrence(claim)` — Persist completion only when this provider still owns the lease token.
- `destroy()` — Disconnect only a client constructed by this provider.
- `releaseOccurrence(claim)` — Relinquish a failed publication claim only when the token still matches.
- `start()` — Connect the owned Redis client when it is not already open.

