# Streaming Builder Integration (Draft)

Goal: integrate streaming into existing builder patterns (`ServiceBuilder`, `CommandDefinitionBuilder`, `SubscriptionDefinitionBuilder`) while keeping the type inference story intact.

## Where streaming fits best

Recommended: introduce a new definition type instead of mutating existing command semantics (v1).

- Commands remain request-response (stable, current behavior).
- Streams become a new first-class primitive with its own builder.

Rationale:
- `Service.executeCommand` and `EventBridge.invoke` are currently built around a single final response payload.
- Extending commands in-place to support streaming would either break the command contract or add heavy branching in the core execution path.
- A dedicated stream primitive can still be "command-like" and reuse builder ergonomics while keeping runtime changes isolated.

DX mitigation:
- The StreamBuilder should deliberately mirror CommandBuilder method names and behavior.
- Later we can add a convenience adapter like `addCommand(...).asStream()` that *creates* a stream definition (not mutates command behavior).

## New builder types (pattern match)

Current builder type shapes:
- `CommandDefinitionBuilderTypes<PayloadSchema, ParamsSchema, OutputSchema, ... Resources, Invokes, EmitList>`
- `SubscriptionDefinitionBuilderTypes<PayloadSchema, ParamsSchema, OutputSchema, ... Resources, Invokes, EmitList>`

Streaming needs at least:
- input payload schema (optional)
- input params schema (optional)
- output chunk schema (required)
- optional final output schema (optional) for "stream then return summary"

Additionally (per requirements):
- chunk schema validation can be disabled for performance while keeping types
- optional automatic aggregation of chunks into a final result (command-like completion)
- optional event name for the final aggregate so it behaves like a command response event and can be picked up by subscriptions

Draft:

```ts
export type StreamDefinitionBuilderTypes<
  PayloadSchema extends Schema = Schema,
  ParamsSchema extends Schema = Schema,
  ChunkSchema extends Schema = Schema,
  FinalSchema extends Schema = Schema,
  TransformInputPayloadSchema extends Schema = Schema,
  TransformInputParamsSchema extends Schema = Schema,
  TransformChunkSchema extends Schema = Schema,
  TransformFinalSchema extends Schema = Schema,
  Resources extends Record<string, unknown> = EmptyObject,
  Invokes extends InvokeList = InvokeList,
  EmitList extends Record<string, Schema> = Record<string, Schema>,
> = {
  PayloadSchema: PayloadSchema
  ParamsSchema: ParamsSchema
  ChunkSchema: ChunkSchema
  FinalSchema: FinalSchema
  TransformInputPayloadSchema: TransformInputPayloadSchema
  TransformInputParamsSchema: TransformInputParamsSchema
  TransformChunkSchema: TransformChunkSchema
  TransformFinalSchema: TransformFinalSchema
  Resources: Resources
  Invokes: Invokes
  EmitList: EmitList
}
```

## ServiceBuilder integration

Draft API:

```ts
const stream = serviceBuilder
  .getStreamBuilder('chat', 'Stream chat completion')
  .addPayloadSchema(z.object({ prompt: z.string() }))
  .addChunkSchema(z.object({ token: z.string() }), true)
  .setStreamFunction(async function (context, payload, parameter, writer) {
    // use invoke-like consumption from other services if needed:
    // const upstream = await context.stream.OtherService['1'].someStream(payload, parameter)
    // write chunks:
    // await writer.write({ token: '...' })
    // close stream (optional final aggregate handled by framework when enabled)
    await writer.close()
  })

serviceBuilder.addStreamDefinition(stream.getDefinition())
```

Important: handler signature must preserve the same schema-driven inference style as commands/subscriptions.

## Handler contract

We likely need a producer-side stream writer that is strongly typed and constrained:

- `write(chunk: Infer<ChunkSchema>)`
- `close(final?: Infer<FinalSchema>)`
- `cancelled` boolean
- `onCancel(cb)` register cancel handler

Chunk schema validation toggle:

```ts
addChunkSchema(schema, validate = true)
```

Type inference always uses the schema; runtime validation can be disabled when `validate = false`.

Open questions:
- Should `write` apply backpressure (await transport flush) where supported?
- Do we allow `yield`-based implementations (async generators) in addition to callback-based?

## Aggregated final result (command-like mode)

Requirement: optionally aggregate all chunks and emit a final result.

Draft:

```ts
enableChunkAggregation(enabled = true)
enableFinalAggregateChunk(enabled = true) // if enabled, `close()` writes one last chunk containing the aggregate
setFinalEventName('UserCreated') // optional; if present, final result is emitted as a custom event and can be subscribed to
```

Notes:
- Aggregation strategy must be defined when `FinalSchema` is enabled: `string concat`, `array collect`, custom reducer, etc.
- `FinalSchema` should be optional. If set, it should be paired with either:
  - a user-provided aggregation function, or
  - a default aggregation derived from `ChunkSchema`.

### Default aggregate shape (proposal)

If the user enables aggregation but does not provide a custom reducer, the framework can default to:

```ts
type DefaultStreamAggregate<TChunk> = {
  chunkCount: number
  chunks: TChunk[]
}
```

Default aggregator:
- collect all chunks into `chunks: TChunk[]`
- `chunkCount = chunks.length`

This preserves typing, is deterministic, and is safe for any chunk shape.

### Custom aggregation

If users want a final “real result” (for example a concatenated string or merged object), they should be able to provide a reducer:

```ts
setFinalAggregation<TAgg>(initial: TAgg, reduce: (agg: TAgg, chunk: Chunk) => TAgg, schema?: FinalSchema)
```

Validation:
- if a `FinalSchema` is present, validate the aggregate once on completion (not per chunk)

Operational note:
- aggregation has memory impact (stores chunks or aggregate); it should be opt-in and documented clearly.
- If `setFinalEventName` is enabled, the final result must behave like a command success response event (1 producer:N subscribers possible).

### Subscription integration requirement

If a `finalSchema` is provided (or default final aggregate is enabled), the user must be able to make the final result subscribable:

- `setFinalEventName(eventName)` enables subscriptions to pick up the final aggregate result.
- The emitted event payload is the final aggregate type (`Infer<FinalSchema>` or the default aggregate type).
- This should reuse the existing `CustomMessage` event channel semantics so current subscription filters work.

Non-goal (v1):
- auto-broadcasting *each chunk* as an event. That is a separate feature because it changes scaling semantics and would be 1 producer:N consumers for every chunk.

## ClientBuilder impact (generated clients)

Client generation currently builds request-response clients from definitions.

Streaming adds:

- new client method kind: `stream()`
- return type: `AsyncIterable<StreamEnvelope<Chunk>>` or `StreamHandle<Chunk>`

We need to decide if generated clients expose:
- low-level stream frames, or
- only `chunk` payloads (with separate metadata callbacks).

## Event bridge integrations

Per bridge we need a consistent routing key scheme:

- `serviceName/serviceVersion/streamName/ownerInstanceId/sessionId`

Rule: include `ownerInstanceId` to avoid interleaving across instances.

## Backwards compatibility

- No breaking changes to existing `CommandDefinition` and `SubscriptionDefinition` types in v1.
- Streaming is additive and behind new builder/definition types.
