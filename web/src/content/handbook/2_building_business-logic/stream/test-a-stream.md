---
title: Test a Stream
description: Test stream handlers with a context mock first, then use the runtime harness when you need real frame delivery.
order: 202540
---

# Test a stream

Streams have two useful testing levels:

- `createStreamContextMock(...)` for handler logic
- `createStreamTestHarness(...)` for real runtime frames

## Handler test

Use the context mock when you want to verify chunk and final payload logic directly.

```ts
import { createStreamContextMock } from '@purista/core/testing'

const mock = createStreamContextMock(searchUsersStreamBuilder, {
  payload: { query: 'ada' },
  parameter: {},
})

await searchUsersStreamBuilder.getStreamFunction()(
  mock.context,
  { query: 'ada' },
  {},
  mock.writer,
)

expect(mock.chunks).toStrictEqual([{ id: 'ada-1' }])
expect(mock.finalValue).toStrictEqual({ total: 1 })
```

Use this level when you want to verify:

- chunk generation
- final payload calculation
- direct handler branching
- emitted events or invokes inside the handler

## Runtime test

Use the harness when you want to verify the real stream runtime behavior.

```ts
import { createStreamTestHarness } from '@purista/core/testing'

const harness = await createStreamTestHarness(userV1Service, searchUsersStreamBuilder)

try {
  const result = await harness.run({
    payload: { query: 'ada' },
    parameter: {},
  })

  expect(result.frames.length).toBeGreaterThan(0)
  expect(result.chunks).toStrictEqual([{ id: 'ada-1' }])
  expect(result.final).toStrictEqual({ total: 1 })
} finally {
  await harness.destroy()
}
```

Use this level when you want to verify:

- before and after guards
- frame emission through the event bridge
- final runtime delivery

## Related guides

- [The stream builder](./the-stream-builder.md)
- [Stream overview](./index.md)
