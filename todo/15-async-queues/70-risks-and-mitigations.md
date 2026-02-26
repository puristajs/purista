# Risks & Mitigations

- **Provider feature gaps**: Some brokers lack delayed delivery or partitioned ordering. *Mitigation*: capabilities handshake, compile-time warnings, and a hard rule that we only ship QueueBridge packages for transports that natively satisfy pull + lease + DLQ semantics (e.g., Redis lists, JetStream, SQS) while clearly documenting that push-only brokers like classic RabbitMQ are unsupported.
- **Lease starvation**: Slow handlers might never release jobs, blocking others. *Mitigation*: automatic lease renewal with heartbeat plus configurable `maxLeaseExtensions` forcing requeue.
- **Poison messages**: Repeated retries can clog queues. *Mitigation*: max-attempt enforcement, dead-letter queues, auto-pause after repeated identical failures.
- **Clock skew**: Delay scheduling relies on timestamps. *Mitigation*: keep scheduling calculations in provider when possible; otherwise, rely on monotonic timers per instance.
- **Back-pressure mismatch**: Over-eager workers may overload downstream services. *Mitigation*: concurrency + batch size per worker, ability to dynamically tune via config store, metrics to alert.
- **Telemetry overhead**: Per-job spans could overwhelm exporters. *Mitigation*: sampling knobs per queue, aggregated metrics for high-volume workloads.
- **Breaking existing services**: Additional builder methods risk type regressions. *Mitigation*: additive APIs, default no-op queue namespace when no definitions exist, comprehensive unit tests around `context.queue` typing.
- **Operational complexity**: Introducing new bridges adds deployment surface. *Mitigation*: ship opinionated defaults (in-memory + Redis), templates, and docs guiding provider selection.
