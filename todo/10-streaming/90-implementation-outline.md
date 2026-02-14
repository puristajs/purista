# Implementation Outline (AI-Executable)

This outline is a concrete, file-oriented checklist intended to allow autonomous implementation without missing cross-package touch points.

## 0) Preconditions

- Streaming is implemented as a new first-class primitive (StreamDefinition + StreamBuilder).
- On-wire messages use `EBMessageType.Stream = 'stream'` (see `todo/10-streaming/70-production-spec-v1.md`).
- Streams can be exposed via HTTP as SSE.
- Commands/subscriptions can consume streams via `context.stream` with `canConsumeStream(...)`.

## 1) Core Types (packages/core)

1. Add message types:
   - Add `EBMessageType.Stream` in `packages/core/src/core/types/EBMessageType.enum.ts`.
   - Add `StreamOpenRequest`, `StreamFrame`, `StreamControl` types under a new folder:
     - `packages/core/src/core/types/stream/*`
   - Extend `EBMessage` union in `packages/core/src/core/types/EBMessage.ts` to include stream messages.
2. Add helper guards:
   - `isStreamMessage`, `isStreamFrame`, `isStreamOpenRequest`, `isStreamControl`.
3. Add stream handle/writer public types:
   - Prefer reusing/aligning with `todo/10-streaming/30-core-interfaces.md` naming.
4. Extend `InvokeList`-style typing:
   - Add `StreamInvokeList` similar to `InvokeList` (chunkSchema/finalSchema/payloadSchema/parameterSchema).

## 2) EventBridge Contract (packages/core)

1. Extend the EventBridge interface in `packages/core/src/core/EventBridge/types/EventBridge.ts`:
   - `openStream(...)`
   - `registerStream(...)`
   - `unregisterStream(...)`
2. Add new EventBridge events (optional but recommended):
   - `StreamOpened`, `StreamFrameReceived`, `StreamFrameSent`, `StreamClosed`, `StreamError`.
3. Update `EventBridgeBaseClass` to define common helpers for stream demux (optional).

## 3) StreamDefinition + Builder (packages/core)

1. Add builder types:
   - `packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilderTypes.ts`
2. Add builder implementation:
   - `packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts`
   - Mirror `CommandDefinitionBuilder` structure:
     - payload/params schema
     - hooks (transform input at minimum)
     - HTTP exposure metadata
     - `canInvoke`, `canEmit`, `canConsumeStream`
     - `addChunkSchema(schema, validate=true)`
     - aggregation config + reducer
     - final event name config
3. Add `StreamDefinition` type:
   - `packages/core/src/core/types/stream/StreamDefinition.ts`
   - Should mirror `CommandDefinition` layout:
     - name/description
     - schemas exposed in metadata
     - eventBridgeConfig (shared/durable/autoack)
     - chunk/final schemas and validation toggles
     - http expose metadata (SSE)
     - invokes + consume-stream invokes + emitList
4. Add mocks for tests:
   - `getStreamContext.mock.ts`
   - `getStreamTransformContext.mock.ts` (if transform hooks exist)

## 4) ServiceBuilder Integration (packages/core)

1. Add stream definition storage:
   - `ServiceBuilder` adds:
     - `streamDefinitionList`
     - `streamDefinitionListResolved`
2. Add methods:
   - `addStreamDefinition(...)`
   - `getStreamBuilder(...)`
   - `getStreamDefinitions()` after resolve
3. Update `resolveDefinitions()` to return `{ commands, subscriptions, streams }`.
4. Update any service definition export helpers to include streams (for ClientBuilder/CLI later).

## 5) Service Runtime (packages/core)

1. Add stream registration during startup:
   - `Service.start()` should register streams with eventBridge similar to commands/subscriptions.
2. Add stream execution path:
   - On receiving StreamOpenRequest:
     - validate input payload/params
     - build `StreamFunctionContext`:
       - `message` (original open request)
       - `emit` (custom events)
       - `service` (command invoke proxy)
       - `stream` (consume-stream proxy)
       - `resources`
       - `getContextFunctions(logger)` output
     - run handler and send frames
   - Handle:
     - chunk validation toggle
     - aggregation (default + custom reducer)
     - final event emission as `CustomMessage` (subscribable)
     - cancellation (from control frames)
     - errors -> error frame
3. Extend `CommandFunctionContext` + `SubscriptionFunctionContext` to include `stream` consume functions:
   - update types in:
     - `packages/core/src/core/types/commandType/CommandFunctionContext.ts`
     - `packages/core/src/core/types/subscription/SubscriptionFunctionContext.ts`
   - update mocks:
     - `packages/core/src/mocks/getCommandContext.mock.ts`
     - `packages/core/src/mocks/getSubscriptionContext.mock.ts`

## 6) Bridges (packages/*bridge)

For each bridge: implement the new EventBridge methods and ensure no cross-talk across instances.

### NATS (packages/natsbridge)

- Add:
  - topic function for stream open requests (like `getCommandSubscriptionTopic` but `stream`)
  - per-instance subscription for stream frames addressed to this instance (receiver.instanceId)
  - per-instance subscription for stream control frames addressed to this instance (receiver.instanceId)
- Maintain:
  - `activeStreams: Map<sessionId, { pushFrame, cancel, ... }>`
  - demux incoming frames by `correlationId`

### MQTT (packages/mqttbridge)

- Same as NATS but topic separators are `/` and wildcards differ.

### AMQP (packages/amqpbridge)

- Define routing keys for stream open / frame / control.
- Ensure frames are routed to the correct consumer instance.

### base-http-bridge / others

- If a bridge is HTTP-only, define whether it supports streaming or throws `not supported`.

## 7) HTTP Servers (packages/httpserver + packages/hono-http-server)

1. Update Info-message handling:
   - Decide how streams are announced:
     - new info type `InfoServiceStreamAdded`, or
     - reuse `InfoServiceFunctionAdded` with discriminator
2. Add route creation for stream endpoints:
   - content type `text/event-stream`
   - implement GET (EventSource) and POST (fetch streaming) behavior
   - connect to `eventBridge.openStream` and pipe frames to SSE
3. Update OpenAPI generation:
   - include stream endpoints in `routeDefinitions`
   - emit response content type `text/event-stream`
   - model responses as stream frame schema
   - keep handshake error responses as JSON (400/401/etc.)

## 8) ClientBuilder + CLI (later phase)

- Extend definition export schema to include streams.
- Update client generation to output `stream()` APIs returning `StreamHandle`.
- Update CLI templates to generate stream skeletons.

## 9) Tests (required)

1. Core unit tests:
   - StreamDefinitionBuilder typing (chunk/final inference)
   - context.stream consumption typing for command/subscription
   - aggregation behavior + validation toggle
2. Bridge tests:
   - open stream -> receive frames -> complete
   - cancel -> producer stops -> consumer ends
3. HTTP tests:
   - SSE route returns correct event-stream frames
   - handshake validation errors return HTTP errors
4. Documentation tests/checks:
   - handbook links resolve for new stream docs
   - generated API docs include new stream public interfaces (no missing exports)
5. Coverage gates:
   - add a streaming-focused coverage task and enforce `>=80%` in CI for streaming modules.

## 10) Acceptance Criteria (v1)

- Multiple concurrent streams do not cross-talk across instances.
- Cancel reliably stops production and frees resources.
- Chunk validation toggle works without type loss.
- Optional final aggregate:
  - is sent on stream completion
  - can be emitted as CustomMessage event when `finalEventName` is set
- SSE exposure works in:
  - browser `EventSource` (GET)
  - server `fetch` streaming (POST)
- Documentation is added for:
  - StreamBuilder and stream definitions
  - Consuming streams via `context.stream` (commands/subscriptions)
  - HTTP/SSE exposure (GET vs POST) with client snippets
  - Cancellation, errors, limits, and aggregation behavior
- Examples are added and runnable:
  - one minimal stream service + client (broker-based)
  - one HTTP-exposed SSE example (GET/EventSource and POST/fetch streaming)
- Inline documentation exists for all new public stream APIs for API docs + IDE hints.
