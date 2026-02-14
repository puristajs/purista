# Risks and Mitigations (Streaming v1)

This document lists likely failure modes when integrating streaming into Purista’s current architecture and proposes mitigations aligned with existing patterns.

## 1) Cross-talk between concurrent streams

Risk:
- frames for different sessions get delivered to the wrong consumer, or interleave incorrectly.

Mitigations:
- session identity is mandatory (`sessionId`/`correlationId`) on all stream frames and control messages.
- consumer-side demux uses `sessionId` as the only routing key for `StreamHandle`.
- include `receiver.instanceId` in routing so frames are scoped to the target instance.
- enforce a “frame belongs to session” check at runtime; drop/flag invalid frames.

## 2) NATS queue group vs instance targeting

Risk:
- if we attempt to use queue groups for control messages, cancel could be delivered to the wrong instance.

Mitigations:
- open requests are load-balanced (shared queue group).
- control messages are delivered to a per-instance subscription keyed by `receiver.instanceId` (no queue group).
- owner instance id is learned from the first `start` frame (sender.instanceId).

## 3) Memory leaks and resource cleanup

Risks:
- `activeStreams` map grows forever on producer or consumer.
- aggregated chunk buffer grows unbounded.
- per-session subscriptions (if used) leak.

Mitigations:
- always `finally` cleanup session state on:
  - complete
  - error
  - cancel
  - timeout
  - service destroy/drain
- aggregation is opt-in and MUST enforce:
  - `maxAggregatedChunks` (default + configurable)
  - optional `maxAggregatedBytes`
- prefer one per-instance stream-frame subscription + demux (avoid per-session broker subscriptions).

## 4) Backpressure and overload

Risks:
- producers can publish faster than consumer can process.
- HTTP SSE connections can stall while producer continues sending.

Mitigations:
- define `StreamWriter.write()` as async and allow bridges to apply backpressure if supported.
- add runtime limits:
  - max concurrent sessions
  - max chunk rate or max in-flight writes
- provide a “best-effort” fallback for brokers without backpressure and document it.

## 5) Error model inconsistency

Risks:
- consumers cannot reliably distinguish handled vs unhandled errors.
- errors mid-stream are lost or not observable.

Mitigations:
- standardize stream error payload to mirror `CommandErrorResponse` fields:
  - `status`, `message`, `isHandledError`, optional `data`, `traceId`
- always send an `error` frame before termination when failures occur after start.
- handshake validation failures should be delivered as:
  - HTTP error response for HTTP exposure
  - `error` frame for broker-based consumption

Cancel is not an error (v1):
- define `cancel` as a distinct terminal frame type
- metrics should count cancels separately from errors

## 6) Breaking changes to EBMessage / EBMessageType

Risks:
- adding `EBMessageType.Stream` expands unions and may break exhaustive checks.

Mitigations:
- treat as a new minor-version feature only if semver policy allows; otherwise major.
- provide type guards (`isStreamMessage`) so downstream code can ignore by default.
- ensure existing bridges ignore unknown message types gracefully during rollout (if possible).

## 7) HTTP/SSE reality mismatch

Risks:
- expecting POST + EventSource to work (it won’t).
- proxies buffering SSE responses.

Mitigations:
- explicitly support:
  - GET (EventSource compatible, query params only)
  - POST (fetch streaming client)
- always set `content-type: text/event-stream` and disable buffering headers where possible.
- send heartbeats to keep connections alive.

## 8) Subscription semantics confusion (1:1 vs 1:N)

Risks:
- users assume per-chunk subscription is the default.
- streaming invocation sessions accidentally become broadcast topics.

Mitigations:
- clearly separate:
  - invocation stream (1 caller -> 1 session)
  - optional final aggregate event (broadcast) via `finalEventName`
  - optional chunk broadcast feature (explicit opt-in)
