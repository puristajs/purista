const canonicalContentManifest = [
  {
    "product": "framework",
    "topicId": "framework/apply-patterns-and-recipes/asynchronous-request-processing",
    "parentTopicId": "framework/apply-patterns-and-recipes",
    "order": 820,
    "title": "Asynchronous request processing",
    "description": "Accept a request quickly, return job acceptance, and process durable work through a worker.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/apply-patterns-and-recipes/distributed-microservices",
    "parentTopicId": "framework/apply-patterns-and-recipes",
    "order": 850,
    "title": "Build distributed microservices",
    "description": "Split PURISTA services only when independent ownership, scaling, security, or deployment justifies a network boundary.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/apply-patterns-and-recipes/cqrs-and-projections",
    "parentTopicId": "framework/apply-patterns-and-recipes",
    "order": 835,
    "title": "CQRS and projections",
    "description": "Separate a write model from a purpose-built read model when their data shape, scale, or ownership must differ.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/apply-patterns-and-recipes/enterprise-interoperability",
    "parentTopicId": "framework/apply-patterns-and-recipes",
    "order": 830,
    "title": "Enterprise interoperability",
    "description": "Exchange versioned business messages with external systems without making internal service details their contract.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/apply-patterns-and-recipes/event-sourcing",
    "parentTopicId": "framework/apply-patterns-and-recipes",
    "order": 836,
    "title": "Event sourcing",
    "description": "Use a durable, application-owned event log as the source of truth only when its replay and audit value outweigh the added operational cost.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/apply-patterns-and-recipes",
    "parentTopicId": "framework",
    "order": 800,
    "title": "Apply patterns and recipes",
    "description": "Combine established PURISTA primitives for common enterprise workflows without replacing their canonical guides.",
    "pageRole": "chapter"
  },
  {
    "product": "framework",
    "topicId": "framework/apply-patterns-and-recipes/modular-monolith",
    "parentTopicId": "framework/apply-patterns-and-recipes",
    "order": 840,
    "title": "Build a modular monolith",
    "description": "Keep service boundaries and contracts inside one deployable before independent deployment becomes necessary.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/build-services/schedule-event-queue-result",
    "parentTopicId": "framework/build-services",
    "order": 360,
    "title": "Schedule work",
    "description": "Export a provider-neutral schedule contract, then keep time, delivery, execution, and recovery owned by the right component.",
    "pageRole": "chapter"
  },
  {
    "product": "framework",
    "topicId": "framework/build-services/schedule-event-queue-result/create-a-schedule-and-choose-a-target",
    "parentTopicId": "framework/build-services/schedule-event-queue-result",
    "order": 361,
    "title": "Create a schedule and choose a target",
    "description": "Define an external schedule contract and select the event, queue, or command target that matches the scheduled outcome.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/build-services/schedule-event-queue-result/emit-enqueue-or-invoke-on-a-schedule",
    "parentTopicId": "framework/build-services/schedule-event-queue-result",
    "order": 362,
    "title": "Emit, enqueue, or invoke on a schedule",
    "description": "Turn a scheduled trigger into an observable event, a durable job, or short command logic without making the scheduler own business recovery.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/build-services/schedule-event-queue-result/export-and-deploy-schedules",
    "parentTopicId": "framework/build-services/schedule-event-queue-result",
    "order": 363,
    "title": "Export and deploy schedules",
    "description": "Treat schedule definitions as external-platform input, then make installation, deployment, enablement, and verification explicit for the selected scheduler.",
    "pageRole": "operations"
  },
  {
    "product": "framework",
    "topicId": "framework/build-services/schedule-event-queue-result/handle-missed-runs-concurrency-and-duplicates",
    "parentTopicId": "framework/build-services/schedule-event-queue-result",
    "order": 364,
    "title": "Handle missed runs, concurrency, and duplicates",
    "description": "Express scheduling intent clearly, then design the target business effect to remain safe when the platform, event path, or queue repeats work.",
    "pageRole": "operations"
  },
  {
    "product": "framework",
    "topicId": "framework/build-services/schedule-event-queue-result/test-scheduled-behavior",
    "parentTopicId": "framework/build-services/schedule-event-queue-result",
    "order": 365,
    "title": "Test scheduled behavior",
    "description": "Prove schedule metadata, event-to-queue mapping, worker idempotency, and the selected scheduler platform at the boundaries that actually own them.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/build-ai-powered-services",
    "parentTopicId": "framework",
    "order": 390,
    "title": "Build AI-powered services",
    "description": "Build model-assisted business behavior as a normal PURISTA service boundary, then choose the execution, runtime, delivery, and safety controls it needs.",
    "pageRole": "chapter"
  },
  {
    "product": "framework",
    "topicId": "framework/build-ai-powered-services/architecture-and-lifecycle",
    "parentTopicId": "framework/build-ai-powered-services",
    "order": 391,
    "title": "AI-powered service architecture and lifecycle",
    "description": "Decide whether an attached agent fits the business boundary, then understand the generated Framework primitives and the separate Harness runtime before configuring either.",
    "pageRole": "concept"
  },
  {
    "product": "framework",
    "topicId": "framework/build-ai-powered-services/build-the-first-attached-agent",
    "parentTopicId": "framework/build-ai-powered-services",
    "order": 392,
    "title": "Build the first attached agent",
    "description": "Generate or define a small attached agent, register all of its Framework projections, bind a compatible runtime, and verify a typed result.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/build-ai-powered-services/configure-agent-builder-and-runtime-binding",
    "parentTopicId": "framework/build-ai-powered-services",
    "order": 393,
    "title": "Configure AgentBuilder and runtime binding",
    "description": "Configure the attached-agent contract and generated projections precisely, then bind compatible runtime capabilities at service composition.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/build-ai-powered-services/choose-command-stream-or-queued-execution",
    "parentTopicId": "framework/build-ai-powered-services",
    "order": 394,
    "title": "Choose command, stream, or queued execution",
    "description": "Choose the generated attached-agent projection from the caller’s completion requirement, not from whether the provider happens to support streaming.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/build-ai-powered-services/use-tools-skills-resources-stores-and-context",
    "parentTopicId": "framework/build-ai-powered-services",
    "order": 395,
    "title": "Use tools, skills, resources, stores, and context",
    "description": "Use the attached-agent handler context safely, declare every reachable Framework capability, and keep authority at the underlying business boundary.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/build-ai-powered-services/manage-sessions-workspaces-and-durable-work",
    "parentTopicId": "framework/build-ai-powered-services",
    "order": 396,
    "title": "Manage sessions, workspaces, and durable work",
    "description": "Choose session scope and explicitly enable persistent storage, workflow recovery, durable workspace capabilities, and sandbox policy only when the business outcome needs them.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/build-ai-powered-services/publish-results-and-react-through-subscriptions",
    "parentTopicId": "framework/build-ai-powered-services",
    "order": 397,
    "title": "Publish results and react through subscriptions",
    "description": "Publish queued attached-agent completion deliberately and react through ordinary PURISTA subscriptions without confusing result delivery with atomic business completion.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/build-ai-powered-services/coordinate-workflows-and-human-review",
    "parentTopicId": "framework/build-ai-powered-services",
    "order": 398,
    "title": "Coordinate workflows and human review",
    "description": "Attach a Harness workflow to a service boundary, keep local agent delegation explicit, and hand a durable review pause to application-owned records and delivery.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/build-ai-powered-services/expose-and-invoke-an-attached-agent",
    "parentTopicId": "framework/build-ai-powered-services",
    "order": 399,
    "title": "Expose and invoke an attached agent",
    "description": "Project an attached agent as a secured aggregate HTTP command or stream, or invoke its generated service contract internally while retaining the normal HTTP runtime topology.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/build-ai-powered-services/secure-the-service-boundary",
    "parentTopicId": "framework/build-ai-powered-services",
    "order": 3991,
    "title": "Secure the service boundary",
    "description": "Protect attached-agent input, trusted identity, resources, tools, HTTP exposure, and output at the normal PURISTA boundary before model behavior is involved.",
    "pageRole": "operations"
  },
  {
    "product": "framework",
    "topicId": "framework/build-ai-powered-services/test-an-ai-powered-service-deterministically",
    "parentTopicId": "framework/build-ai-powered-services",
    "order": 3992,
    "title": "Test an AI-powered service deterministically",
    "description": "Prove the implementation and service flow with deterministic adapters, then test selected real adapters separately; use Harness evaluations for non-deterministic agent quality.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/build-services/commands",
    "parentTopicId": "framework/build-services",
    "order": 320,
    "title": "Commands",
    "description": "Build a validated request-response operation, understand every runtime stage, and add only the capabilities the operation needs.",
    "pageRole": "hub"
  },
  {
    "product": "framework",
    "topicId": "framework/build-services/commands/create-and-validate",
    "parentTopicId": "framework/build-services/commands",
    "order": 321,
    "title": "Create and validate a command",
    "description": "Define a command contract and a service-bound handler that receives validated input and returns a verified result.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/build-services/commands/transform-and-guard",
    "parentTopicId": "framework/build-services/commands",
    "order": 322,
    "title": "Transform and guard command execution",
    "description": "Validate wire data before transforming it, then add independent guards at the safe points around command behavior.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/build-services/commands/handle-errors",
    "parentTopicId": "framework/build-services/commands",
    "order": 323,
    "title": "Handle command errors",
    "description": "Keep invalid input, expected business rejection, and unexpected failure distinct so callers and operators receive the right signal.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/build-services/commands/publish-success-event",
    "parentTopicId": "framework/build-services/commands",
    "order": 324,
    "title": "Publish the success event",
    "description": "Name the canonical successful command response so subscriptions can react without coupling the command to their work.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/build-services/commands/call-other-capabilities",
    "parentTopicId": "framework/build-services/commands",
    "order": 325,
    "title": "Call other capabilities",
    "description": "Declare the command, stream, queue, or event capability your handler needs, then choose the coupling and delivery boundary deliberately.",
    "pageRole": "hub"
  },
  {
    "product": "framework",
    "topicId": "framework/build-services/commands/call-other-capabilities/invoke-command",
    "parentTopicId": "framework/build-services/commands/call-other-capabilities",
    "order": 326,
    "title": "Invoke another command",
    "description": "Declare a synchronous command dependency, validate its narrow contract, and await its result only when the current outcome needs it.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/build-services/commands/call-other-capabilities/enqueue-work",
    "parentTopicId": "framework/build-services/commands/call-other-capabilities",
    "order": 327,
    "title": "Enqueue background work",
    "description": "Declare a queue, enqueue or schedule accepted work from a command, and keep acceptance separate from worker completion.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/build-services/commands/call-other-capabilities/emit-custom-events",
    "parentTopicId": "framework/build-services/commands/call-other-capabilities",
    "order": 328,
    "title": "Emit custom events",
    "description": "Declare and publish a distinct domain fact from a command without confusing it with the command’s canonical success event.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/build-services/commands/call-other-capabilities/consume-a-stream",
    "parentTopicId": "framework/build-services/commands/call-other-capabilities",
    "order": 329,
    "title": "Consume a stream",
    "description": "Declare a progressive upstream dependency, validate its frames, and cancel the session deliberately when the command no longer needs it.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/build-services/commands/resources-stores-and-context",
    "parentTopicId": "framework/build-services/commands",
    "order": 330,
    "title": "Use command resources, stores, and context",
    "description": "Read trusted message metadata and use only the resource, store, client, metric, and telemetry capabilities that the service and command declare.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/build-services/commands/expose-a-command",
    "parentTopicId": "framework/build-services/commands",
    "order": 331,
    "title": "Expose a command",
    "description": "Add HTTP projection and OpenAPI metadata to a command while leaving service ownership, startup, and transport behavior in the HTTP runtime.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/build-services/commands/test-a-command",
    "parentTopicId": "framework/build-services/commands",
    "order": 332,
    "title": "Test a command",
    "description": "Test command logic with typed context stubs, then prove deterministic validation and lifecycle behavior through the real PURISTA service runtime.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/build-services",
    "parentTopicId": "framework",
    "order": 300,
    "title": "Build services",
    "description": "Choose the service primitive that matches the business outcome, then grow from a small verified result.",
    "pageRole": "chapter"
  },
  {
    "product": "framework",
    "topicId": "framework/build-services/handler-context",
    "parentTopicId": "framework/build-services",
    "order": 305,
    "title": "Use handler inputs and context",
    "description": "Understand the validated handler arguments and the declared capabilities that PURISTA places on each command, subscription, stream, and queue-worker context.",
    "pageRole": "concept"
  },
  {
    "product": "framework",
    "topicId": "framework/build-services/use-stores-in-a-service",
    "parentTopicId": "framework/build-services",
    "order": 306,
    "title": "Use stores in a service",
    "description": "Choose the data boundary, wire state, configuration, and secret stores at startup, and use the typed store APIs safely from a handler.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/build-services/handle-service-errors",
    "parentTopicId": "framework/build-services",
    "order": 307,
    "title": "Handle service errors",
    "description": "Classify safe business rejections, unexpected failures, and primitive-specific recovery without leaking internal details or claiming delivery guarantees the runtime does not own.",
    "pageRole": "concept"
  },
  {
    "product": "framework",
    "topicId": "framework/build-services/queues-and-workers",
    "parentTopicId": "framework/build-services",
    "order": 350,
    "title": "Queues and workers",
    "description": "Accept work now, process it later with a QueueBridge, and make duplicate-safe completion and recovery explicit.",
    "pageRole": "hub"
  },
  {
    "product": "framework",
    "topicId": "framework/build-services/queues-and-workers/create-a-queue-and-worker",
    "parentTopicId": "framework/build-services/queues-and-workers",
    "order": 351,
    "title": "Create a queue and worker",
    "description": "Define a typed job contract, register both definitions, and implement one idempotent worker with deliberate execution settings.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/build-services/queues-and-workers/enqueue-and-schedule-jobs",
    "parentTopicId": "framework/build-services/queues-and-workers",
    "order": 352,
    "title": "Enqueue and schedule jobs",
    "description": "Declare a queue client, submit a validated job with safe delivery options, and distinguish delayed work from scheduler metadata.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/build-services/queues-and-workers/return-results-and-publish-result-events",
    "parentTopicId": "framework/build-services/queues-and-workers",
    "order": 353,
    "title": "Return results and publish result events",
    "description": "Choose a worker outcome, avoid competing settlement paths, and make completion observable with an explicitly configured result policy.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/build-services/queues-and-workers/invoke-enqueue-emit-stream-and-call-agents",
    "parentTopicId": "framework/build-services/queues-and-workers",
    "order": 354,
    "title": "Invoke, enqueue, emit, consume streams, and call agents",
    "description": "Declare every dependency a worker uses, then choose synchronous, streaming, durable, event, or agent composition deliberately.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/build-services/queues-and-workers/resources-stores-context-and-job-controls",
    "parentTopicId": "framework/build-services/queues-and-workers",
    "order": 355,
    "title": "Use worker resources, stores, context, and job controls",
    "description": "Use the leased message, declared dependencies, service resources, stores, telemetry, and cooperative cancellation without leaking transport assumptions.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/build-services/queues-and-workers/configure-leases-retries-idempotency-and-dead-letters",
    "parentTopicId": "framework/build-services/queues-and-workers",
    "order": 356,
    "title": "Configure leases, retries, idempotency, and dead letters",
    "description": "Set a bounded recovery policy, choose a bridge that can meet it, and make business effects safe under repeated delivery.",
    "pageRole": "operations"
  },
  {
    "product": "framework",
    "topicId": "framework/build-services/queues-and-workers/expose-queued-work",
    "parentTopicId": "framework/build-services/queues-and-workers",
    "order": 357,
    "title": "Expose queued work",
    "description": "Accept a request through an async command, return a durable job handle, and keep HTTP topology and result retrieval at their proper boundaries.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/build-services/queues-and-workers/test-queued-work",
    "parentTopicId": "framework/build-services/queues-and-workers",
    "order": 358,
    "title": "Test queued work",
    "description": "Separate direct worker logic, deterministic Framework runtime flow, and the selected QueueBridge's delivery guarantees.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/build-services/services",
    "parentTopicId": "framework/build-services",
    "order": 310,
    "title": "Services",
    "description": "Define a versioned business boundary, assemble its declarations, then wire and run it with explicit runtime ownership.",
    "pageRole": "hub"
  },
  {
    "product": "framework",
    "topicId": "framework/build-services/services/create-and-version-a-service",
    "parentTopicId": "framework/build-services/services",
    "order": 311,
    "title": "Create and version a service",
    "description": "Define one stable business boundary, make its public version explicit, and keep deployment concerns outside the service contract.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/build-services/services/add-definitions-to-a-service",
    "parentTopicId": "framework/build-services/services",
    "order": 312,
    "title": "Add definitions to a service",
    "description": "Register the service's declared capabilities once, bind event-to-queue work deliberately, and resolve the aggregate only after it is complete.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/build-services/services/provide-resources-and-metrics",
    "parentTopicId": "framework/build-services/services",
    "order": 313,
    "title": "Provide resources and metrics",
    "description": "Declare narrow application dependencies and custom metrics on a service, then supply concrete implementations at the composition root.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/build-services/services/configure-a-service",
    "parentTopicId": "framework/build-services/services",
    "order": 314,
    "title": "Configure a service",
    "description": "Validate static service-owned settings at creation and startup, while keeping secrets, tenant identity, and mutable runtime data in their correct boundaries.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/build-services/services/customize-service-lifecycle",
    "parentTopicId": "framework/build-services/services",
    "order": 315,
    "title": "Customize service lifecycle",
    "description": "Extend the Service class only when a long-lived business boundary must start and stop with the service rather than a normal injected resource.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/build-services/services/instantiate-and-start-a-service",
    "parentTopicId": "framework/build-services/services",
    "order": 316,
    "title": "Instantiate and start a service",
    "description": "Construct concrete dependencies at the composition root, create the service with its runtime bindings, then start and stop it in the required order.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/build-services/services/test-a-service",
    "parentTopicId": "framework/build-services/services",
    "order": 317,
    "title": "Test a service",
    "description": "Validate the assembled service contract, then prove handler logic, deterministic runtime behavior, and real adapter behavior at separate boundaries.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/build-services/streams",
    "parentTopicId": "framework/build-services",
    "order": 340,
    "title": "Streams",
    "description": "Produce progressive results for a connected caller, understand the exact frame lifecycle, and make cancellation and completion deliberate.",
    "pageRole": "hub"
  },
  {
    "product": "framework",
    "topicId": "framework/build-services/streams/create-and-validate",
    "parentTopicId": "framework/build-services/streams",
    "order": 341,
    "title": "Create and validate a stream",
    "description": "Generate and register a stream definition, make its public contracts explicit, and implement the service-bound writer handler.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/build-services/streams/write-chunks-and-complete",
    "parentTopicId": "framework/build-services/streams",
    "order": 342,
    "title": "Write chunks and complete the stream",
    "description": "Emit validated progress frames, choose an explicit or aggregate final value, and publish a final event only after successful completion.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/build-services/streams/invoke-enqueue-emit-and-consume",
    "parentTopicId": "framework/build-services/streams",
    "order": 343,
    "title": "Invoke, enqueue, emit, and consume",
    "description": "Declare every downstream command, stream, queue, or custom event before the stream handler uses it.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/build-services/streams/resources-stores-context-and-cancellation",
    "parentTopicId": "framework/build-services/streams",
    "order": 344,
    "title": "Use stream resources, stores, context, and cancellation",
    "description": "Use the stream handler’s declared context safely and stop upstream work cooperatively when the connected caller cancels.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/build-services/streams/expose-a-stream",
    "parentTopicId": "framework/build-services/streams",
    "order": 345,
    "title": "Expose a stream",
    "description": "Declare a secure HTTP stream projection, choose incremental SSE or aggregate response, and keep server topology separate from builder metadata.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/build-services/streams/termination-and-failures",
    "parentTopicId": "framework/build-services/streams",
    "order": 346,
    "title": "Handle stream termination and failures",
    "description": "Stop work cooperatively when the caller cancels, throw terminal failures safely, and move durable work out of the connected-stream boundary.",
    "pageRole": "operations"
  },
  {
    "product": "framework",
    "topicId": "framework/build-services/streams/test-a-stream",
    "parentTopicId": "framework/build-services/streams",
    "order": 347,
    "title": "Test a stream",
    "description": "Prove direct handler logic, deterministic stream runtime behavior, and the selected adapter/HTTP boundary separately.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/build-services/subscriptions",
    "parentTopicId": "framework/build-services",
    "order": 330,
    "title": "Subscriptions",
    "description": "React independently to a business event, understand the delivery lifecycle, and make every dependency and recovery decision explicit.",
    "pageRole": "hub"
  },
  {
    "product": "framework",
    "topicId": "framework/build-services/subscriptions/create-and-validate",
    "parentTopicId": "framework/build-services/subscriptions",
    "order": 331,
    "title": "Create and validate a subscription",
    "description": "Define a narrow event contract and a service-bound handler whose normal result is validated before it can become an event.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/build-services/subscriptions/match-and-filter-events",
    "parentTopicId": "framework/build-services/subscriptions",
    "order": 332,
    "title": "Match and filter events",
    "description": "Receive only the event/message shape a subscription owns, while keeping routing metadata separate from authorization.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/build-services/subscriptions/transform-and-guard",
    "parentTopicId": "framework/build-services/subscriptions",
    "order": 333,
    "title": "Transform and guard a subscription",
    "description": "Convert a supported wire shape once, then use short guards to stop invalid or disallowed work before its side effect.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/build-services/subscriptions/acknowledge-and-control-delivery",
    "parentTopicId": "framework/build-services/subscriptions",
    "order": 334,
    "title": "Acknowledge and control delivery",
    "description": "Complete normally or request retry, dead-letter, drop, or pause behavior without confusing framework controls with broker guarantees.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/build-services/subscriptions/publish-result-and-custom-events",
    "parentTopicId": "framework/build-services/subscriptions",
    "order": 335,
    "title": "Publish result and custom events",
    "description": "Return one validated result event from the subscription or declare and emit a separate business fact for an independent reaction.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/build-services/subscriptions/call-other-capabilities",
    "parentTopicId": "framework/build-services/subscriptions",
    "order": 336,
    "title": "Call other capabilities",
    "description": "Make synchronous dependencies, stream consumption, and event-to-queue handoffs explicit before a subscription performs them.",
    "pageRole": "hub"
  },
  {
    "product": "framework",
    "topicId": "framework/build-services/subscriptions/call-other-capabilities/invoke-command",
    "parentTopicId": "framework/build-services/subscriptions/call-other-capabilities",
    "order": 337,
    "title": "Invoke a command from a subscription",
    "description": "Declare and await one typed command dependency only when the event reaction needs its bounded result now.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/build-services/subscriptions/call-other-capabilities/consume-a-stream",
    "parentTopicId": "framework/build-services/subscriptions/call-other-capabilities",
    "order": 338,
    "title": "Consume a stream from a subscription",
    "description": "Declare a typed stream dependency, process its frames deliberately, and cancel it when the event reaction no longer needs it.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/build-services/subscriptions/call-other-capabilities/queue-work-from-an-event",
    "parentTopicId": "framework/build-services/subscriptions/call-other-capabilities",
    "order": 339,
    "title": "Queue work from an event",
    "description": "Bind an event to durable queue work at the service boundary, with explicit payload mapping, idempotency, and enqueue-failure behavior.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/build-services/subscriptions/resources-stores-and-context",
    "parentTopicId": "framework/build-services/subscriptions",
    "order": 340,
    "title": "Use subscription resources, stores, and context",
    "description": "Read the message and use only the resources, stores, and cross-service capabilities that the service and subscription explicitly provide.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/build-services/subscriptions/delivery-failures-and-idempotency",
    "parentTopicId": "framework/build-services/subscriptions",
    "order": 341,
    "title": "Configure delivery failures and idempotency",
    "description": "Request consumer behavior the selected EventBridge can honor, and make the business side effect safe when delivery repeats.",
    "pageRole": "operations"
  },
  {
    "product": "framework",
    "topicId": "framework/build-services/subscriptions/test-subscriptions",
    "parentTopicId": "framework/build-services/subscriptions",
    "order": 342,
    "title": "Test subscriptions",
    "description": "Prove direct handler logic, deterministic framework behavior, and the selected EventBridge boundary separately.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/configure-applications/configuration-model-defaults-validation-and-precedence",
    "parentTopicId": "framework/configure-applications",
    "order": 501,
    "title": "Configuration defaults, validation, and precedence",
    "description": "Validate service-instance settings at composition time and retrieve changing non-secret values explicitly through the runtime configuration store.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/configure-applications/configuration-stores/aws-systems-manager",
    "parentTopicId": "framework/configure-applications/configuration-stores",
    "order": 513,
    "title": "Store configuration in AWS Systems Manager",
    "description": "Enable AWS Systems Manager Parameter Store through the first-party configuration-store adapter.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/configure-applications/configuration-stores/dapr",
    "parentTopicId": "framework/configure-applications/configuration-stores",
    "order": 515,
    "title": "Store configuration through Dapr",
    "description": "Use a Dapr configuration component from PURISTA without coupling service definitions to the backing vendor.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/configure-applications/configuration-stores/custom-configuration-store",
    "parentTopicId": "framework/configure-applications/configuration-stores",
    "order": 516,
    "title": "Build a custom configuration store",
    "description": "Add a platform-specific non-secret configuration backend while preserving PURISTA's guarded lookup contract and explicit shutdown lifecycle.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/configure-applications/configuration-stores/default",
    "parentTopicId": "framework/configure-applications/configuration-stores",
    "order": 511,
    "title": "Use the default configuration store",
    "description": "Seed the included in-memory store for local development and deterministic tests, then pass it explicitly to the service.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/configure-applications/configuration-stores",
    "parentTopicId": "framework/configure-applications",
    "order": 510,
    "title": "Configuration stores",
    "description": "Select a non-sensitive configuration backend and wire it at the application composition root.",
    "pageRole": "hub"
  },
  {
    "product": "framework",
    "topicId": "framework/configure-applications/configuration-stores/nats-jetstream-kv",
    "parentTopicId": "framework/configure-applications/configuration-stores",
    "order": 514,
    "title": "Store configuration in NATS JetStream KV",
    "description": "Enable the NATS configuration-store adapter when JetStream is part of the operating platform.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/configure-applications/configuration-stores/redis",
    "parentTopicId": "framework/configure-applications/configuration-stores",
    "order": 512,
    "title": "Store configuration in Redis",
    "description": "Enable the Redis configuration-store adapter for shared low-latency configuration.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/configure-applications/environment-specific-configuration",
    "parentTopicId": "framework/configure-applications",
    "order": 502,
    "title": "Environment-specific configuration",
    "description": "Separate portable service definitions from deployment-specific values, credentials, and infrastructure endpoints.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/configure-applications",
    "parentTopicId": "framework",
    "order": 500,
    "title": "Use stores and configuration",
    "description": "Choose and wire configuration, secret, and state stores as essential runtime building blocks at explicit application boundaries.",
    "pageRole": "chapter"
  },
  {
    "product": "framework",
    "topicId": "framework/configure-applications/wire-stores-at-the-composition-root",
    "parentTopicId": "framework/configure-applications",
    "order": 503,
    "title": "Wire stores at the composition root",
    "description": "Construct state, configuration, and secret adapters once at application startup, pass them to each service intentionally, and prove the selected process can use them before serving traffic.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/configure-applications/configure-store-operations-and-secret-cache",
    "parentTopicId": "framework/configure-applications",
    "order": 504,
    "title": "Configure store operations and secret caching",
    "description": "Control read, write, and removal operations deliberately, use scoped logging safely, and enable the built-in secret cache only when its rotation and exposure trade-off is acceptable.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/configure-applications/secret-stores/aws-secrets-manager",
    "parentTopicId": "framework/configure-applications/secret-stores",
    "order": 522,
    "title": "Store secrets in AWS Secrets Manager",
    "description": "Enable AWS Secrets Manager with workload identity and a narrowly scoped read policy.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/configure-applications/secret-stores/azure-key-vault",
    "parentTopicId": "framework/configure-applications/secret-stores",
    "order": 523,
    "title": "Store secrets in Azure Key Vault",
    "description": "Enable Azure Key Vault through DefaultAzureCredential and a production HTTPS vault endpoint.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/configure-applications/secret-stores/dapr",
    "parentTopicId": "framework/configure-applications/secret-stores",
    "order": 527,
    "title": "Store secrets through Dapr",
    "description": "Resolve secrets through a Dapr secret-store component and platform-managed identity.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/configure-applications/secret-stores/custom-secret-store",
    "parentTopicId": "framework/configure-applications/secret-stores",
    "order": 528,
    "title": "Build a custom secret store",
    "description": "Implement a provider-specific secret adapter without weakening PURISTA's no-leak, read-only-by-default, and explicit cache boundaries.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/configure-applications/secret-stores/default",
    "parentTopicId": "framework/configure-applications/secret-stores",
    "order": 521,
    "title": "Use the default secret store locally",
    "description": "Seed the included in-memory secret store for local development and tests, then replace it with an audited backend before deployment.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/configure-applications/secret-stores/gcloud-secret-manager",
    "parentTopicId": "framework/configure-applications/secret-stores",
    "order": 524,
    "title": "Store secrets in Google Cloud Secret Manager",
    "description": "Enable Google Cloud Secret Manager with application default credentials or workload identity.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/configure-applications/secret-stores",
    "parentTopicId": "framework/configure-applications",
    "order": 520,
    "title": "Secret stores",
    "description": "Select a secret backend that matches your identity, rotation, audit, and deployment controls.",
    "pageRole": "hub"
  },
  {
    "product": "framework",
    "topicId": "framework/configure-applications/secret-stores/infisical",
    "parentTopicId": "framework/configure-applications/secret-stores",
    "order": 526,
    "title": "Store secrets in Infisical",
    "description": "Enable the Infisical secret-store adapter with a scoped machine identity or token.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/configure-applications/secret-stores/vault",
    "parentTopicId": "framework/configure-applications/secret-stores",
    "order": 525,
    "title": "Store secrets in HashiCorp Vault",
    "description": "Enable a Vault KV v2 backend with short-lived runtime credentials and a narrow policy.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/connect-distributed-infrastructure/event-delivery/amqp-rabbitmq",
    "parentTopicId": "framework/connect-distributed-infrastructure/event-delivery",
    "order": 712,
    "title": "Deliver events through AMQP and RabbitMQ",
    "description": "Enable the AMQP EventBridge with broker-backed queues, acknowledgements, and application-owned payload protection.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/connect-distributed-infrastructure/event-delivery/custom-event-bridge",
    "parentTopicId": "framework/connect-distributed-infrastructure/event-delivery",
    "order": 717,
    "title": "Build a custom EventBridge",
    "description": "Implement a transport adapter only when the supported bridges do not meet the deployment boundary, and report its real behavior through capabilities.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/connect-distributed-infrastructure/event-delivery/dapr",
    "parentTopicId": "framework/connect-distributed-infrastructure/event-delivery",
    "order": 715,
    "title": "Deliver events through Dapr",
    "description": "Enable Dapr command, subscription, and event delivery through an approved sidecar and pub/sub component.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/connect-distributed-infrastructure/event-delivery/default",
    "parentTopicId": "framework/connect-distributed-infrastructure/event-delivery",
    "order": 711,
    "title": "Use the default EventBridge",
    "description": "Use the included in-process bridge for local development and deterministic service tests.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/connect-distributed-infrastructure/event-delivery",
    "parentTopicId": "framework/connect-distributed-infrastructure",
    "order": 710,
    "title": "Event delivery",
    "description": "Choose an EventBridge for commands, events, subscriptions, and streams across the required runtime boundary.",
    "pageRole": "hub"
  },
  {
    "product": "framework",
    "topicId": "framework/connect-distributed-infrastructure/event-delivery/mqtt",
    "parentTopicId": "framework/connect-distributed-infrastructure/event-delivery",
    "order": 714,
    "title": "Deliver events through MQTT",
    "description": "Enable MQTT 5 transport for IoT-oriented pub/sub while owning retry and recovery outside the bridge.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/connect-distributed-infrastructure/event-delivery/nats",
    "parentTopicId": "framework/connect-distributed-infrastructure/event-delivery",
    "order": 713,
    "title": "Deliver events through NATS",
    "description": "Enable the NATS EventBridge and make JetStream durability an explicit production decision.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/connect-distributed-infrastructure",
    "parentTopicId": "framework",
    "order": 700,
    "title": "Connect distributed infrastructure",
    "description": "Select the EventBridge, QueueBridge, HTTP server, and platform integration that matches the deployment boundary.",
    "pageRole": "chapter"
  },
  {
    "product": "framework",
    "topicId": "framework/connect-distributed-infrastructure/platform-integrations/dapr",
    "parentTopicId": "framework/connect-distributed-infrastructure",
    "order": 740,
    "title": "Run with Dapr",
    "description": "Use the Dapr SDK for sidecar-based event delivery, stores, and service invocation while preserving service contracts.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/connect-distributed-infrastructure/platform-integrations/kubernetes",
    "parentTopicId": "framework/connect-distributed-infrastructure",
    "order": 741,
    "title": "Run with Kubernetes",
    "description": "Add the Kubernetes HTTP helper for health probes and selected command endpoints.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/connect-distributed-infrastructure/queue-delivery/custom-queue-bridge",
    "parentTopicId": "framework/connect-distributed-infrastructure/queue-delivery",
    "order": 724,
    "title": "Build a custom QueueBridge",
    "description": "Implement a queue adapter only when its leasing, retry, dead-letter, and idempotency guarantees can be represented honestly.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/connect-distributed-infrastructure/queue-delivery/default",
    "parentTopicId": "framework/connect-distributed-infrastructure/queue-delivery",
    "order": 721,
    "title": "Use the default QueueBridge",
    "description": "Use the included in-memory QueueBridge to develop and test a queue/worker flow.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/connect-distributed-infrastructure/queue-delivery",
    "parentTopicId": "framework/connect-distributed-infrastructure",
    "order": 720,
    "title": "Queue delivery",
    "description": "Choose a QueueBridge for jobs that must outlive the request path and recover safely from failure.",
    "pageRole": "hub"
  },
  {
    "product": "framework",
    "topicId": "framework/connect-distributed-infrastructure/queue-delivery/nats",
    "parentTopicId": "framework/connect-distributed-infrastructure/queue-delivery",
    "order": 723,
    "title": "Deliver queue jobs through NATS JetStream",
    "description": "Enable JetStream-backed queues for durable pull workers, replay, and idempotent job publishing.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/connect-distributed-infrastructure/queue-delivery/redis",
    "parentTopicId": "framework/connect-distributed-infrastructure/queue-delivery",
    "order": 722,
    "title": "Deliver queue jobs through Redis",
    "description": "Enable Redis-backed queues with leases, delayed delivery, dead-letter inspection, and stable idempotency keys.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/expose-and-consume-services/graphql",
    "parentTopicId": "framework/expose-and-consume-services",
    "order": 420,
    "title": "GraphQL",
    "description": "Add GraphQL as an application-owned adapter over selected PURISTA contracts while keeping resolvers small, authorized, and observable.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/expose-and-consume-services/http-and-rest/runtime-architecture",
    "parentTopicId": "framework/expose-and-consume-services/http-and-rest",
    "order": 415,
    "title": "HTTP runtime architecture and startup",
    "description": "Choose direct definition registration for a monolith or event-driven endpoint discovery for a separately deployed Hono process.",
    "pageRole": "concept"
  },
  {
    "product": "framework",
    "topicId": "framework/expose-and-consume-services/http-and-rest/hono",
    "parentTopicId": "framework/expose-and-consume-services/http-and-rest",
    "order": 420,
    "title": "Configure Hono",
    "description": "Install and configure the optional Hono projection service, its public boundary, and its OpenAPI and health surfaces.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/expose-and-consume-services/http-and-rest",
    "parentTopicId": "framework/expose-and-consume-services",
    "order": 410,
    "title": "HTTP and REST",
    "description": "Project selected commands and streams through an independently composed HTTP server without moving business behavior into routes.",
    "pageRole": "hub"
  },
  {
    "product": "framework",
    "topicId": "framework/expose-and-consume-services",
    "parentTopicId": "framework",
    "order": 400,
    "title": "Expose and consume services",
    "description": "Choose HTTP, direct calls, or generated clients without moving business contracts into transport code.",
    "pageRole": "chapter"
  },
  {
    "product": "framework",
    "topicId": "framework/expose-and-consume-services/service-clients",
    "parentTopicId": "framework/expose-and-consume-services",
    "order": 440,
    "title": "Service clients",
    "description": "Choose a direct, EventBridge, REST, or fetch client based on the actual process and failure boundary.",
    "pageRole": "hub"
  },
  {
    "product": "framework",
    "topicId": "framework/expose-and-consume-services/service-discovery",
    "parentTopicId": "framework/expose-and-consume-services",
    "order": 450,
    "title": "Service discovery and contracts",
    "description": "Use application/platform discovery with exported contracts; the Framework does not ship a service registry.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/persist-application-state/dapr",
    "parentTopicId": "framework/persist-application-state",
    "order": 650,
    "title": "Persist state through Dapr",
    "description": "Use a Dapr state component while keeping the service definition independent of the backing provider.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/persist-application-state/keys-namespaces-isolation-and-consistency",
    "parentTopicId": "framework/persist-application-state",
    "order": 610,
    "title": "Design keys, isolation, and consistency",
    "description": "Make state records safe to find, validate, migrate, and recover without mistaking a key prefix for authorization or a read/write pair for a transaction.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/persist-application-state/default",
    "parentTopicId": "framework/persist-application-state",
    "order": 620,
    "title": "Use the default state store locally",
    "description": "Seed and wire the included in-memory state store for a local result or deterministic test, never as a production source of truth.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/persist-application-state",
    "parentTopicId": "framework/configure-applications",
    "order": 530,
    "title": "State stores",
    "description": "Choose a state-store adapter for service state that must survive restart or be shared across processes.",
    "pageRole": "chapter"
  },
  {
    "product": "framework",
    "topicId": "framework/persist-application-state/nats-jetstream-kv",
    "parentTopicId": "framework/persist-application-state",
    "order": 640,
    "title": "Persist state in NATS JetStream KV",
    "description": "Enable JetStream key-value storage for state in a NATS-operated deployment.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/persist-application-state/redis",
    "parentTopicId": "framework/persist-application-state",
    "order": 630,
    "title": "Persist state in Redis",
    "description": "Enable Redis-backed state for a protected, shared application runtime.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/persist-application-state/custom-state-store",
    "parentTopicId": "framework/persist-application-state",
    "order": 660,
    "title": "Build a custom state store",
    "description": "Implement PURISTA's small state-store contract when the supported adapters do not match the platform, while preserving explicit lifecycle and safe value handling.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/persist-application-state/test-and-migrate-state",
    "parentTopicId": "framework/persist-application-state",
    "order": 670,
    "title": "Test and migrate state",
    "description": "Verify handler logic deterministically, prove a durable adapter separately, and change key or value formats without corrupting delayed work or blocking rollback.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/reference/adapter-compatibility",
    "parentTopicId": "framework/reference",
    "order": 1240,
    "title": "Adapter compatibility",
    "description": "Choose an adapter from the business guarantee and operational ownership, not from the package name alone.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/reference/api",
    "parentTopicId": "framework/reference",
    "order": 1250,
    "title": "API reference",
    "description": "Use generated API documentation for current public signatures and this handbook for architecture and operational guidance.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/reference/cli-and-project-structure",
    "parentTopicId": "framework/reference",
    "order": 1210,
    "title": "CLI and project structure",
    "description": "Use the project-local CLI to create consistent services, commands, subscriptions, streams, workers, and agents.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/reference/glossary",
    "parentTopicId": "framework/reference",
    "order": 1260,
    "title": "Glossary",
    "description": "Short definitions for the Framework terms used throughout the handbook.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/reference",
    "parentTopicId": "framework",
    "order": 1200,
    "title": "Framework reference",
    "description": "Find package availability, CLI guidance, contracts, compatibility, and generated API documentation.",
    "pageRole": "chapter"
  },
  {
    "product": "framework",
    "topicId": "framework/reference/messages-schemas-and-errors",
    "parentTopicId": "framework/reference",
    "order": 1220,
    "title": "Messages, schemas, and errors",
    "description": "Keep command, event, subscription, and HTTP boundaries typed, intentional, and diagnosable.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/reference/packages-and-feature-availability",
    "parentTopicId": "framework/reference",
    "order": 1230,
    "title": "Packages and feature availability",
    "description": "Identify what runs with core defaults and which optional package and external dependency enable each infrastructure capability.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/secure-and-operate/deployment",
    "parentTopicId": "framework/secure-and-operate",
    "order": 1040,
    "title": "Deployment",
    "description": "Select a deployment shape from runtime, identity, durability, and operational requirements.",
    "pageRole": "hub"
  },
  {
    "product": "framework",
    "topicId": "framework/secure-and-operate/deployment/kubernetes-and-dapr",
    "parentTopicId": "framework/secure-and-operate/deployment",
    "order": 1041,
    "title": "Deploy to Kubernetes or Dapr",
    "description": "Operate PURISTA with explicit probes, graceful termination, workload identity, and platform components.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/secure-and-operate",
    "parentTopicId": "framework",
    "order": 1000,
    "title": "Secure and operate",
    "description": "Make identity, delivery, telemetry, recovery, and deployment controls part of the service design.",
    "pageRole": "chapter"
  },
  {
    "product": "framework",
    "topicId": "framework/secure-and-operate/observability/backend-guides",
    "parentTopicId": "framework/secure-and-operate/observability",
    "order": 1022,
    "title": "Choose and transition an OpenTelemetry backend",
    "description": "Select a telemetry backend without coupling PURISTA services to vendor endpoints, credentials, or retention settings.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/secure-and-operate/observability",
    "parentTopicId": "framework/secure-and-operate",
    "order": 1020,
    "title": "Observability",
    "description": "Use structured logs, OpenTelemetry traces, and low-cardinality metrics to operate message-driven services safely.",
    "pageRole": "hub"
  },
  {
    "product": "framework",
    "topicId": "framework/secure-and-operate/observability/logging",
    "parentTopicId": "framework/secure-and-operate/observability",
    "order": 1023,
    "title": "Configure structured logging",
    "description": "Use PURISTA’s Pino-backed logger, scoped child fields, and safe event-level practices without leaking payloads, credentials, or tenant data.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/secure-and-operate/observability/opentelemetry",
    "parentTopicId": "framework/secure-and-operate/observability",
    "order": 1021,
    "title": "Instrument with OpenTelemetry",
    "description": "Choose the service, monolith, or distributed setup that gives every PURISTA process trace export and safe metrics without coupling service definitions to a telemetry backend.",
    "pageRole": "hub"
  },
  {
    "product": "framework",
    "topicId": "framework/secure-and-operate/observability/opentelemetry/one-service",
    "parentTopicId": "framework/secure-and-operate/observability/opentelemetry",
    "order": 10211,
    "title": "Configure OpenTelemetry for one service",
    "description": "Create one exporter-backed span processor and Meter, pass them to one event bridge and service instance, then prove a trace and metric from a controlled command.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/secure-and-operate/observability/opentelemetry/monolith",
    "parentTopicId": "framework/secure-and-operate/observability/opentelemetry",
    "order": 10212,
    "title": "Configure OpenTelemetry for a monolith",
    "description": "Wire one monolith's EventBridge, business services, Hono projection, processor shutdown, and Meter lifecycle so traces and metrics cover the complete local request path.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/secure-and-operate/observability/opentelemetry/distributed-services",
    "parentTopicId": "framework/secure-and-operate/observability/opentelemetry",
    "order": 10213,
    "title": "Configure OpenTelemetry for distributed services",
    "description": "Give each independently deployed service, worker, and Hono process its own telemetry composition and prove trace continuity across the selected transport and collector.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/secure-and-operate/performance-and-scaling",
    "parentTopicId": "framework/secure-and-operate",
    "order": 1050,
    "title": "Performance and scaling",
    "description": "Measure queue age, concurrency, resource latency, and backpressure before changing topology or parallelism.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/secure-and-operate/reliability/delivery-semantics",
    "parentTopicId": "framework/secure-and-operate/reliability",
    "order": 1031,
    "title": "Delivery semantics",
    "description": "Match the business promise to the guarantees of the selected EventBridge and QueueBridge.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/secure-and-operate/reliability/graceful-shutdown",
    "parentTopicId": "framework/secure-and-operate/reliability",
    "order": 1033,
    "title": "Graceful shutdown",
    "description": "Drain services and close listeners with a bounded shutdown policy rather than terminating in-flight work blindly.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/secure-and-operate/reliability",
    "parentTopicId": "framework/secure-and-operate",
    "order": 1030,
    "title": "Reliability",
    "description": "Design explicit timeout, retry, idempotency, shutdown, and recovery behavior for every service path.",
    "pageRole": "hub"
  },
  {
    "product": "framework",
    "topicId": "framework/secure-and-operate/reliability/recovery-and-replay",
    "parentTopicId": "framework/secure-and-operate/reliability",
    "order": 1034,
    "title": "Recovery and replay",
    "description": "Recover failed message and queue work through adapter-supported repair paths with idempotency and audit controls.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/secure-and-operate/reliability/retries-timeouts-and-idempotency",
    "parentTopicId": "framework/secure-and-operate/reliability",
    "order": 1032,
    "title": "Retries, timeouts, and idempotency",
    "description": "Retry only transient, repeat-safe work and make the idempotency boundary visible in the contract.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/secure-and-operate/security/authentication-and-authorization",
    "parentTopicId": "framework/secure-and-operate/security",
    "order": 1011,
    "title": "Authentication and authorization",
    "description": "Establish trusted identity in the transport and enforce business authorization with service guards and resources.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/secure-and-operate/security",
    "parentTopicId": "framework/secure-and-operate",
    "order": 1010,
    "title": "Security model",
    "description": "Enforce authorization at service boundaries and keep infrastructure identity, secrets, and tenant data under explicit control.",
    "pageRole": "hub"
  },
  {
    "product": "framework",
    "topicId": "framework/secure-and-operate/security/infrastructure-permissions",
    "parentTopicId": "framework/secure-and-operate/security",
    "order": 1014,
    "title": "Infrastructure permissions",
    "description": "Give each workload the smallest broker, store, cloud, and sidecar permission set that can operate its intended service.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/secure-and-operate/security/secrets-and-sensitive-data",
    "parentTopicId": "framework/secure-and-operate/security",
    "order": 1013,
    "title": "Secrets and sensitive data",
    "description": "Keep credentials and sensitive payloads out of source, messages, logs, traces, and metrics.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/secure-and-operate/security/tenant-isolation",
    "parentTopicId": "framework/secure-and-operate/security",
    "order": 1012,
    "title": "Tenant isolation",
    "description": "Carry tenant context through trusted calls and isolate data, queues, subjects, and stores by policy rather than naming convention alone.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/secure-and-operate/troubleshooting-and-runbooks",
    "parentTopicId": "framework/secure-and-operate",
    "order": 1060,
    "title": "Troubleshooting and runbooks",
    "description": "Diagnose production symptoms from safe evidence and correct the boundary that actually failed.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/start/add-a-command",
    "parentTopicId": "framework/start",
    "order": 140,
    "title": "Add a command",
    "description": "Add a typed request-response operation to the incident service.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/start/add-a-subscription",
    "parentTopicId": "framework/start",
    "order": 150,
    "title": "Add a subscription",
    "description": "React to an incident event without coupling the notification service to the command.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/start/create-the-first-service",
    "parentTopicId": "framework/start",
    "order": 130,
    "title": "Create the first service",
    "description": "Create a versioned incident service and start it through the application composition root.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/start/from-zero-to-production",
    "parentTopicId": "framework/start",
    "order": 170,
    "title": "From local service to production",
    "description": "Move a working local PURISTA service through explicit infrastructure, release, and operating decisions without duplicating the detailed guides.",
    "pageRole": "tutorial"
  },
  {
    "product": "framework",
    "topicId": "framework/start",
    "parentTopicId": "framework",
    "order": 100,
    "title": "Start with PURISTA",
    "description": "Create a local service, handle a command, react to an event, and verify the result.",
    "pageRole": "chapter"
  },
  {
    "product": "framework",
    "topicId": "framework/start/requirements-and-installation",
    "parentTopicId": "framework/start",
    "order": 110,
    "title": "Requirements and installation",
    "description": "Create a supported Node.js or Bun project with the PURISTA generator.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/start/run-and-verify",
    "parentTopicId": "framework/start",
    "order": 160,
    "title": "Run and verify the application",
    "description": "Prove that the generated project builds, tests, and starts before adding infrastructure.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/start/understand-the-generated-project",
    "parentTopicId": "framework/start",
    "order": 120,
    "title": "Understand the generated project",
    "description": "Find the composition root, service definitions, generated artifacts, and local CLI commands.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/test-applications/business-logic-and-service-contracts",
    "parentTopicId": "framework/test-applications",
    "order": 910,
    "title": "Test business logic and service contracts",
    "description": "Use generated tests and core harnesses to prove schemas, guards, handler results, and emitted events.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/test-applications/end-to-end",
    "parentTopicId": "framework/test-applications",
    "order": 940,
    "title": "End-to-end testing",
    "description": "Verify the authenticated public path, real infrastructure wiring, and operational evidence before release.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/test-applications",
    "parentTopicId": "framework",
    "order": 900,
    "title": "Test applications",
    "description": "Test contracts and failure behavior at the smallest boundary that can prove the claim.",
    "pageRole": "chapter"
  },
  {
    "product": "framework",
    "topicId": "framework/test-applications/local-infrastructure-and-production-adapters",
    "parentTopicId": "framework/test-applications",
    "order": 930,
    "title": "Test local infrastructure and production adapters",
    "description": "Use local defaults for fast feedback and real adapter integration tests for production guarantees.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/test-applications/message-flows-queues-and-retries",
    "parentTopicId": "framework/test-applications",
    "order": 920,
    "title": "Test message flows, queues, and retries",
    "description": "Prove idempotency and recovery before enabling retries against a real adapter.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/understand-the-framework/commands-events-and-execution-flow",
    "parentTopicId": "framework/understand-the-framework",
    "order": 230,
    "title": "Commands, events, and execution flow",
    "description": "Choose synchronous, event-driven, streaming, or queued execution based on the caller's required outcome.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/understand-the-framework/distribution-and-deployment-models",
    "parentTopicId": "framework/understand-the-framework",
    "order": 250,
    "title": "Distribution and deployment models",
    "description": "Keep service definitions stable while changing the process and infrastructure topology around them.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/understand-the-framework",
    "parentTopicId": "framework",
    "order": 200,
    "title": "How PURISTA works",
    "description": "Build a durable mental model for service ownership, contracts, execution primitives, runtime composition, topology, and delivery behavior.",
    "pageRole": "chapter"
  },
  {
    "product": "framework",
    "topicId": "framework/understand-the-framework/messages-schemas-and-contracts",
    "parentTopicId": "framework/understand-the-framework",
    "order": 220,
    "title": "Messages, schemas, and contracts",
    "description": "Define validated inputs and outputs that can survive service, process, and deployment boundaries.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/understand-the-framework/reliability-and-delivery-guarantees",
    "parentTopicId": "framework/understand-the-framework",
    "order": 260,
    "title": "Reliability and delivery guarantees",
    "description": "Design handlers for timeouts, duplicate delivery, retries, and recovery instead of assuming exactly-once execution.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/understand-the-framework/runtime-composition-and-lifecycle",
    "parentTopicId": "framework/understand-the-framework",
    "order": 240,
    "title": "Runtime composition and lifecycle",
    "description": "Start adapters first, then instantiate and start services with explicit dependencies.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/understand-the-framework/services-and-boundaries",
    "parentTopicId": "framework/understand-the-framework",
    "order": 210,
    "title": "Services and boundaries",
    "description": "Use versioned services to keep business ownership, dependencies, and change boundaries explicit.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/upgrade-and-migrate/contract-compatibility",
    "parentTopicId": "framework/upgrade-and-migrate",
    "order": 1130,
    "title": "Preserve message and service contracts",
    "description": "Evolve versioned services without breaking callers, subscribers, or messages waiting in a broker.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/upgrade-and-migrate/framework-and-adapter-migrations",
    "parentTopicId": "framework/upgrade-and-migrate",
    "order": 1120,
    "title": "Migrate Framework and infrastructure adapters",
    "description": "Move a service between local and distributed runtime adapters without assuming equal delivery guarantees.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/upgrade-and-migrate",
    "parentTopicId": "framework",
    "order": 1100,
    "title": "Upgrade and migrate",
    "description": "Change PURISTA, its adapters, and service contracts with a staged, observable rollout.",
    "pageRole": "chapter"
  },
  {
    "product": "framework",
    "topicId": "framework/upgrade-and-migrate/verification-and-rollback",
    "parentTopicId": "framework/upgrade-and-migrate",
    "order": 1140,
    "title": "Verify and roll back a migration",
    "description": "Define acceptance evidence and a safe exit before changing a production Framework boundary.",
    "pageRole": "task"
  },
  {
    "product": "framework",
    "topicId": "framework/upgrade-and-migrate/version-policy-and-preparation",
    "parentTopicId": "framework/upgrade-and-migrate",
    "order": 1110,
    "title": "Prepare a Framework or adapter upgrade",
    "description": "Inventory the application boundary, align official packages, and test the target runtime before rollout.",
    "pageRole": "task"
  },
  {
    "product": "harness",
    "topicId": "harness/add-capabilities/agent-plugins",
    "parentTopicId": "harness/add-capabilities",
    "order": 440,
    "title": "Load agent plugins",
    "description": "Review declarative skill and MCP packages before explicitly binding them to agents.",
    "pageRole": "task"
  },
  {
    "product": "harness",
    "topicId": "harness/add-capabilities",
    "parentTopicId": "handbook-harness",
    "order": 400,
    "title": "Add capabilities",
    "description": "Give each agent only the tools, methods, and integrations needed for one job.",
    "pageRole": "chapter"
  },
  {
    "product": "harness",
    "topicId": "harness/add-capabilities/mcp",
    "parentTopicId": "harness/add-capabilities",
    "order": 430,
    "title": "Connect MCP tools",
    "description": "Use an explicit MCP boundary for separately operated tool servers.",
    "pageRole": "task"
  },
  {
    "product": "harness",
    "topicId": "harness/add-capabilities/skills",
    "parentTopicId": "harness/add-capabilities",
    "order": 420,
    "title": "Add skills",
    "description": "Mount reviewed procedures and references without turning them into implicit authority.",
    "pageRole": "task"
  },
  {
    "product": "harness",
    "topicId": "harness/add-capabilities/tools",
    "parentTopicId": "harness/add-capabilities",
    "order": 410,
    "title": "Create typed tools",
    "description": "Expose narrow, application-authorized operations to an agent.",
    "pageRole": "task"
  },
  {
    "product": "harness",
    "topicId": "harness/build-agents/agent-definition",
    "parentTopicId": "harness/build-agents",
    "order": 310,
    "title": "Define an agent",
    "description": "Keep one model-driven job small, typed, and explicit about its allowed capabilities.",
    "pageRole": "task"
  },
  {
    "product": "harness",
    "topicId": "harness/build-agents/errors-and-failure-behavior",
    "parentTopicId": "harness/build-agents",
    "order": 360,
    "title": "Errors and failure behavior",
    "description": "Handle validation, capability, cancellation, provider, and tool failures at the application boundary.",
    "pageRole": "task"
  },
  {
    "product": "harness",
    "topicId": "harness/build-agents",
    "parentTopicId": "handbook-harness",
    "order": 300,
    "title": "Build agents",
    "description": "Define a bounded model loop with schemas, a session lifecycle, streaming, and deterministic tests.",
    "pageRole": "chapter"
  },
  {
    "product": "harness",
    "topicId": "harness/build-agents/inputs-and-structured-outputs",
    "parentTopicId": "harness/build-agents",
    "order": 330,
    "title": "Inputs and structured outputs",
    "description": "Make the application contract explicit with schemas before a model call and after its result.",
    "pageRole": "task"
  },
  {
    "product": "harness",
    "topicId": "harness/build-agents/instructions-and-runtime-context",
    "parentTopicId": "harness/build-agents",
    "order": 320,
    "title": "Instructions and runtime context",
    "description": "Use instructions for behavior, not for caller authority or hidden infrastructure configuration.",
    "pageRole": "task"
  },
  {
    "product": "harness",
    "topicId": "harness/build-agents/sessions-and-execution",
    "parentTopicId": "harness/build-agents",
    "order": 340,
    "title": "Sessions and execution",
    "description": "Open a session at the application boundary and invoke agents through its typed API.",
    "pageRole": "task"
  },
  {
    "product": "harness",
    "topicId": "harness/build-agents/streaming-cancellation-and-timeouts",
    "parentTopicId": "harness/build-agents",
    "order": 350,
    "title": "Streaming, cancellation, and timeouts",
    "description": "Stream typed run events and propagate caller cancellation without turning streaming into an HTTP protocol.",
    "pageRole": "task"
  },
  {
    "product": "harness",
    "topicId": "harness/build-agents/test-a-basic-agent",
    "parentTopicId": "harness/build-agents",
    "order": 370,
    "title": "Test a basic agent",
    "description": "Inject a deterministic provider to test schemas, session wiring, and error behavior without a live model.",
    "pageRole": "task"
  },
  {
    "product": "harness",
    "topicId": "harness/configure-the-runtime/amazon-bedrock",
    "parentTopicId": "harness/configure-the-runtime",
    "order": 260,
    "title": "Configure Amazon Bedrock",
    "description": "Use the Bedrock adapter with an AWS credential chain, explicit region, and application-owned model access policy.",
    "pageRole": "task"
  },
  {
    "product": "harness",
    "topicId": "harness/configure-the-runtime/anthropic",
    "parentTopicId": "harness/configure-the-runtime",
    "order": 250,
    "title": "Configure Anthropic",
    "description": "Enable the Anthropic provider adapter and keep API credentials and model selection in the application composition root.",
    "pageRole": "task"
  },
  {
    "product": "harness",
    "topicId": "harness/configure-the-runtime/azure-ai-foundry",
    "parentTopicId": "harness/configure-the-runtime",
    "order": 270,
    "title": "Configure Azure AI Foundry",
    "description": "Enable the Azure AI Foundry adapter with an endpoint and either an API key or Azure credential.",
    "pageRole": "task"
  },
  {
    "product": "harness",
    "topicId": "harness/configure-the-runtime/configuration-and-model-settings",
    "parentTopicId": "harness/configure-the-runtime",
    "order": 210,
    "title": "Configuration and model settings",
    "description": "Declare model capabilities truthfully and use bounded defaults that match the execution path.",
    "pageRole": "task"
  },
  {
    "product": "harness",
    "topicId": "harness/configure-the-runtime/environment-variables-and-secrets",
    "parentTopicId": "harness/configure-the-runtime",
    "order": 220,
    "title": "Environment variables and secrets",
    "description": "Keep provider credentials and deployment configuration at the application boundary.",
    "pageRole": "task"
  },
  {
    "product": "harness",
    "topicId": "harness/configure-the-runtime",
    "parentTopicId": "handbook-harness",
    "order": 200,
    "title": "Configure the AI Harness runtime",
    "description": "Keep provider credentials, model capability declarations, defaults, and infrastructure wiring in one composition root.",
    "pageRole": "chapter"
  },
  {
    "product": "harness",
    "topicId": "harness/configure-the-runtime/grounded-retrieval",
    "parentTopicId": "harness/configure-the-runtime",
    "order": 280,
    "title": "Build grounded retrieval",
    "description": "Keep authorization, retrieval, reranking, and evidence assembly in typed application workflow code.",
    "pageRole": "task"
  },
  {
    "product": "harness",
    "topicId": "harness/configure-the-runtime/openai",
    "parentTopicId": "harness/configure-the-runtime",
    "order": 240,
    "title": "Configure OpenAI",
    "description": "Enable the OpenAI provider adapter, choose the API surface, and verify one bounded model call.",
    "pageRole": "task"
  },
  {
    "product": "harness",
    "topicId": "harness/configure-the-runtime/provider-selection",
    "parentTopicId": "harness/configure-the-runtime",
    "order": 230,
    "title": "Choose a model provider",
    "description": "Select a provider based on deployment, identity, model access, and operational ownership—not on agent code.",
    "pageRole": "task"
  },
  {
    "product": "harness",
    "topicId": "harness/manage-context-and-state/conversation-history",
    "parentTopicId": "harness/manage-context-and-state",
    "order": 610,
    "title": "Bound conversation history",
    "description": "Retain complete turns deliberately and make direct delivery retries safe.",
    "pageRole": "task"
  },
  {
    "product": "harness",
    "topicId": "harness/manage-context-and-state/durable-workspaces",
    "parentTopicId": "harness/manage-context-and-state",
    "order": 640,
    "title": "Use durable workspaces",
    "description": "Persist run artifacts separately from session history and sandbox execution.",
    "pageRole": "task"
  },
  {
    "product": "harness",
    "topicId": "harness/manage-context-and-state",
    "parentTopicId": "handbook-harness",
    "order": 600,
    "title": "Manage context and state",
    "description": "Choose what belongs in a session, an application store, memory, or a durable workspace.",
    "pageRole": "chapter"
  },
  {
    "product": "harness",
    "topicId": "harness/manage-context-and-state/memory/in-memory",
    "parentTopicId": "harness/manage-context-and-state/memory",
    "order": 631,
    "title": "Use in-memory memory",
    "description": "Use the default ephemeral memory engine for tests and single-process runs.",
    "pageRole": "task"
  },
  {
    "product": "harness",
    "topicId": "harness/manage-context-and-state/memory",
    "parentTopicId": "harness/manage-context-and-state",
    "order": 630,
    "title": "Select a memory backend",
    "description": "Enable only the scoped memory capabilities and operational service your application needs.",
    "pageRole": "hub"
  },
  {
    "product": "harness",
    "topicId": "harness/manage-context-and-state/memory/nats",
    "parentTopicId": "harness/manage-context-and-state/memory",
    "order": 635,
    "title": "Use NATS memory",
    "description": "Add JetStream KV memory for persistent multi-instance key/value coordination.",
    "pageRole": "task"
  },
  {
    "product": "harness",
    "topicId": "harness/manage-context-and-state/memory/postgres",
    "parentTopicId": "harness/manage-context-and-state/memory",
    "order": 633,
    "title": "Use PostgreSQL memory",
    "description": "Add multi-instance memory with PostgreSQL full-text, vector, and hybrid search.",
    "pageRole": "task"
  },
  {
    "product": "harness",
    "topicId": "harness/manage-context-and-state/memory/redis",
    "parentTopicId": "harness/manage-context-and-state/memory",
    "order": 634,
    "title": "Use Redis memory",
    "description": "Add Redis Search memory with a versioned namespace and optional fixed-dimension vectors.",
    "pageRole": "task"
  },
  {
    "product": "harness",
    "topicId": "harness/manage-context-and-state/memory/sqlite",
    "parentTopicId": "harness/manage-context-and-state/memory",
    "order": 632,
    "title": "Use SQLite memory",
    "description": "Persist one application's scoped memory on a single host, with FTS5 text search and an explicit vector-search opt-in.",
    "pageRole": "task"
  },
  {
    "product": "harness",
    "topicId": "harness/manage-context-and-state/retention-recovery-and-migration",
    "parentTopicId": "harness/manage-context-and-state",
    "order": 650,
    "title": "Plan retention, recovery, and migration",
    "description": "Operate state with explicit ownership, versioning, deletion, and restore paths.",
    "pageRole": "task"
  },
  {
    "product": "harness",
    "topicId": "harness/manage-context-and-state/shared-context",
    "parentTopicId": "harness/manage-context-and-state",
    "order": 620,
    "title": "Share context between workers",
    "description": "Build a compact, provenance-aware coordination surface in application workflow code.",
    "pageRole": "task"
  },
  {
    "product": "harness",
    "topicId": "harness/orchestrate-work/child-tasks-and-data-flow",
    "parentTopicId": "harness/orchestrate-work",
    "order": 520,
    "title": "Use child tasks and data flow",
    "description": "Start isolated agent work with bounded concurrency and explicit result retrieval.",
    "pageRole": "task"
  },
  {
    "product": "harness",
    "topicId": "harness/orchestrate-work/durable-workflows",
    "parentTopicId": "harness/orchestrate-work",
    "order": 540,
    "title": "Run durable workflows",
    "description": "Resume stable workflow runs from committed checkpoints after interruption.",
    "pageRole": "task"
  },
  {
    "product": "harness",
    "topicId": "harness/orchestrate-work/human-review",
    "parentTopicId": "harness/orchestrate-work",
    "order": 530,
    "title": "Add human review",
    "description": "Pause a durable workflow while the application manages reviewers and the actual decision.",
    "pageRole": "task"
  },
  {
    "product": "harness",
    "topicId": "harness/orchestrate-work",
    "parentTopicId": "handbook-harness",
    "order": 500,
    "title": "Orchestrate work",
    "description": "Coordinate typed agents, decisions, and durable steps in application-owned workflows.",
    "pageRole": "chapter"
  },
  {
    "product": "harness",
    "topicId": "harness/orchestrate-work/retries-compensation-and-testing",
    "parentTopicId": "harness/orchestrate-work",
    "order": 550,
    "title": "Retry, compensate, and test workflows",
    "description": "Make failure behavior explicit before a workflow touches an external system.",
    "pageRole": "task"
  },
  {
    "product": "harness",
    "topicId": "harness/orchestrate-work/workflows",
    "parentTopicId": "harness/orchestrate-work",
    "order": 510,
    "title": "Build a workflow",
    "description": "Coordinate a small number of typed steps with explicit data flow and policy.",
    "pageRole": "task"
  },
  {
    "product": "harness",
    "topicId": "harness/reference",
    "parentTopicId": "handbook-harness",
    "order": 1400,
    "title": "Harness reference",
    "description": "Find first-party packages, optional peers, and the public API boundary quickly.",
    "pageRole": "chapter"
  },
  {
    "product": "harness",
    "topicId": "harness/secure-and-govern/guardrails",
    "parentTopicId": "harness/secure-and-govern",
    "order": 710,
    "title": "Add guardrails",
    "description": "Configure ordered, fail-closed input, output, tool, and retrieval checks around a default-loop agent.",
    "pageRole": "task"
  },
  {
    "product": "harness",
    "topicId": "harness/secure-and-govern",
    "parentTopicId": "handbook-harness",
    "order": 700,
    "title": "Secure and govern agents",
    "description": "Add content controls, data protection, and execution boundaries without confusing them with application authorization.",
    "pageRole": "chapter"
  },
  {
    "product": "harness",
    "topicId": "harness/secure-and-govern/privacy-detectors",
    "parentTopicId": "harness/secure-and-govern",
    "order": 720,
    "title": "Select a privacy detector",
    "description": "Install, configure, and bind the detector whose entity coverage and deployment boundary match the data you inspect.",
    "pageRole": "task"
  },
  {
    "product": "harness",
    "topicId": "harness/secure-and-govern/sandbox-and-mcp",
    "parentTopicId": "harness/secure-and-govern",
    "order": 730,
    "title": "Choose a sandbox and MCP boundary",
    "description": "Configure the smallest file, command, or MCP execution boundary that the agent actually needs.",
    "pageRole": "task"
  },
  {
    "product": "harness",
    "topicId": "harness/secure-and-govern/local-docker-sandbox",
    "parentTopicId": "harness/secure-and-govern/sandbox-and-mcp",
    "order": 731,
    "title": "Run a local Docker sandbox",
    "description": "Prepare a local Docker or OrbStack image, retain workspace files across attachments, and clean up owned resources.",
    "pageRole": "adapter"
  },
  {
    "product": "harness",
    "topicId": "harness/start/add-the-first-tool",
    "parentTopicId": "harness/start",
    "order": 50,
    "title": "Add the first tool",
    "description": "Give an agent one explicit, typed application capability without treating model instructions as authorization.",
    "pageRole": "task"
  },
  {
    "product": "harness",
    "topicId": "harness/start/build-the-first-agent",
    "parentTopicId": "harness/start",
    "order": 40,
    "title": "Build the first agent",
    "description": "Define one schema-validated agent, invoke it through a session, and observe a typed result.",
    "pageRole": "task"
  },
  {
    "product": "harness",
    "topicId": "harness/start/configure-the-first-model",
    "parentTopicId": "harness/start",
    "order": 30,
    "title": "Configure the first model",
    "description": "Register one provider behind a stable model alias before defining an agent.",
    "pageRole": "task"
  },
  {
    "product": "harness",
    "topicId": "harness/start",
    "parentTopicId": "handbook-harness",
    "order": 10,
    "title": "Start with AI Harness",
    "description": "Build one typed agent, prove it works, then add only the capabilities your application needs.",
    "pageRole": "chapter"
  },
  {
    "product": "harness",
    "topicId": "harness/start/requirements-and-installation",
    "parentTopicId": "harness/start",
    "order": 20,
    "title": "Requirements and installation",
    "description": "Install the core Harness runtime, one provider adapter, and the schema library used by your application.",
    "pageRole": "task"
  },
  {
    "product": "harness",
    "topicId": "harness/start/run-and-verify",
    "parentTopicId": "harness/start",
    "order": 60,
    "title": "Run and verify the agent",
    "description": "Prove the first live run and the deterministic test path separately.",
    "pageRole": "task"
  },
  {
    "product": "harness",
    "topicId": "harness/start/understand-the-project",
    "parentTopicId": "harness/start",
    "order": 70,
    "title": "Understand the project shape",
    "description": "Keep composition, application transport, and domain behavior separate from the first commit.",
    "pageRole": "task"
  },
  {
    "product": "harness",
    "topicId": "harness/test-and-evaluate/evaluate-prompts-and-outputs",
    "parentTopicId": "harness/test-and-evaluate",
    "order": 820,
    "title": "Run your first evaluation",
    "description": "Measure a small classification baseline, inspect a failure, make one change, and rerun the same reviewed cases.",
    "pageRole": "task"
  },
  {
    "product": "harness",
    "topicId": "harness/test-and-evaluate",
    "parentTopicId": "handbook-harness",
    "order": 800,
    "title": "Test and evaluate",
    "description": "Prove application behavior deterministically, then measure and improve real agent quality with reviewed cases and explicit evidence.",
    "pageRole": "chapter"
  },
  {
    "product": "harness",
    "topicId": "harness/test-and-evaluate/test-harness-applications",
    "parentTopicId": "harness/test-and-evaluate",
    "order": 810,
    "title": "Test Harness applications",
    "description": "Use fake providers and adapter contracts to make agent behavior repeatable.",
    "pageRole": "task"
  },
  {
    "product": "harness",
    "topicId": "harness/test-and-evaluate/evaluation-datasets-and-ci",
    "parentTopicId": "harness/test-and-evaluate",
    "order": 830,
    "title": "Build evaluation datasets and run them in CI",
    "description": "Create reviewed, versioned cases that expose important failures, then use explicit coverage and release policy in CI.",
    "pageRole": "task"
  },
  {
    "product": "harness",
    "topicId": "harness/test-and-evaluate/choose-and-calibrate-scorers",
    "parentTopicId": "harness/test-and-evaluate",
    "order": 840,
    "title": "Choose and calibrate scorers",
    "description": "Combine deterministic checks, calibrated model judges, and reviewed labels without hiding uncertainty or scorer failure.",
    "pageRole": "task"
  },
  {
    "product": "harness",
    "topicId": "harness/test-and-evaluate/recipes",
    "parentTopicId": "harness/test-and-evaluate",
    "order": 850,
    "title": "Evaluation recipes",
    "description": "Choose a measurement design for extraction, retrieval, translation, tool-using agents, subagents, or workflows.",
    "pageRole": "hub"
  },
  {
    "product": "harness",
    "topicId": "harness/test-and-evaluate/recipes/extraction",
    "parentTopicId": "harness/test-and-evaluate/recipes",
    "order": 851,
    "title": "Evaluate extraction",
    "description": "Measure valid structure separately from correct fields, normalized values, missing entities, and extra entities.",
    "pageRole": "task"
  },
  {
    "product": "harness",
    "topicId": "harness/test-and-evaluate/recipes/rag",
    "parentTopicId": "harness/test-and-evaluate/recipes",
    "order": 852,
    "title": "Evaluate RAG",
    "description": "Separate retrieval coverage, answer correctness, groundedness, citations, and unanswerable questions.",
    "pageRole": "task"
  },
  {
    "product": "harness",
    "topicId": "harness/test-and-evaluate/recipes/translation",
    "parentTopicId": "harness/test-and-evaluate/recipes",
    "order": 853,
    "title": "Evaluate translation",
    "description": "Assess meaning, terminology, fluency, and preserved placeholders without rejecting valid alternative wording.",
    "pageRole": "task"
  },
  {
    "product": "harness",
    "topicId": "harness/test-and-evaluate/recipes/tool-calling-agents",
    "parentTopicId": "harness/test-and-evaluate/recipes",
    "order": 854,
    "title": "Evaluate tool-calling agents",
    "description": "Verify actual effects, permissions, arguments, termination, and task success rather than trusting an agent's final text.",
    "pageRole": "task"
  },
  {
    "product": "harness",
    "topicId": "harness/test-and-evaluate/recipes/subagent-as-tool",
    "parentTopicId": "harness/test-and-evaluate/recipes",
    "order": 855,
    "title": "Evaluate subagents as tools",
    "description": "Test child contracts and the parent synthesis together, including delegation failures and information loss.",
    "pageRole": "task"
  },
  {
    "product": "harness",
    "topicId": "harness/test-and-evaluate/recipes/workflows",
    "parentTopicId": "harness/test-and-evaluate/recipes",
    "order": 856,
    "title": "Evaluate agent workflows",
    "description": "Measure terminal state and business invariants across branches, approvals, resumes, and duplicate-effect cases.",
    "pageRole": "task"
  },
  {
    "product": "harness",
    "topicId": "harness/test-and-evaluate/compare-and-diagnose-regressions",
    "parentTopicId": "harness/test-and-evaluate",
    "order": 860,
    "title": "Compare results and diagnose regressions",
    "description": "Compare matched cases honestly, distinguish trials from retries, and interpret coverage, latency, and cost changes.",
    "pageRole": "task"
  },
  {
    "product": "harness",
    "topicId": "harness/test-and-evaluate/operate-evaluations-safely",
    "parentTopicId": "harness/test-and-evaluate",
    "order": 870,
    "title": "Operate evaluations safely",
    "description": "Turn authorized failures into safer cases while keeping evaluation data, model usage, cost, and telemetry boundaries explicit.",
    "pageRole": "operations"
  },
  {
    "product": "harness",
    "topicId": "harness/test-and-evaluate/integrate-evaluations",
    "parentTopicId": "harness/test-and-evaluate",
    "order": 880,
    "title": "Extend and integrate evaluations",
    "description": "Reuse generic observations and scorer adapters with application-owned storage, OpenTelemetry, and optional experiment platforms.",
    "pageRole": "hub"
  },
  {
    "product": "harness",
    "topicId": "harness/test-and-evaluate/integrate-evaluations/langfuse",
    "parentTopicId": "harness/test-and-evaluate/integrate-evaluations",
    "order": 881,
    "title": "Use Langfuse with evaluations",
    "description": "Optionally submit application-selected traces and scores to Langfuse without making it a Harness dependency or second scheduler.",
    "pageRole": "adapter"
  },
  {
    "product": "harness",
    "topicId": "harness/test-and-evaluate/integrate-evaluations/phoenix",
    "parentTopicId": "harness/test-and-evaluate/integrate-evaluations",
    "order": 882,
    "title": "Use Phoenix with evaluations",
    "description": "Optionally map application-owned experiments and trace correlation to Phoenix while retaining Harness as a provider-neutral runtime.",
    "pageRole": "adapter"
  },
  {
    "product": "harness",
    "topicId": "harness/test-and-evaluate/integrate-evaluations/datadog",
    "parentTopicId": "harness/test-and-evaluate/integrate-evaluations",
    "order": 883,
    "title": "Use Datadog with evaluations",
    "description": "Optionally submit external evaluation results to Datadog with explicit correlation, privacy, and delivery policy.",
    "pageRole": "adapter"
  },
  {
    "product": "harness",
    "topicId": "harness/understand-the-harness/agents-sessions-and-lifecycle",
    "parentTopicId": "harness/understand-the-harness",
    "order": 120,
    "title": "Agents, sessions, and execution lifecycle",
    "description": "Use a session as the application API and an agent as one typed model-and-tool loop.",
    "pageRole": "task"
  },
  {
    "product": "harness",
    "topicId": "harness/understand-the-harness/capabilities-and-extension-points",
    "parentTopicId": "harness/understand-the-harness",
    "order": 140,
    "title": "Capabilities and extension points",
    "description": "Choose the smallest extension boundary that gives an agent the capability it needs.",
    "pageRole": "task"
  },
  {
    "product": "harness",
    "topicId": "harness/understand-the-harness/context-memory-and-persistence",
    "parentTopicId": "harness/understand-the-harness",
    "order": 150,
    "title": "Context, memory, and persistence",
    "description": "Keep conversation history, application memory, workspaces, and workflow state distinct.",
    "pageRole": "task"
  },
  {
    "product": "harness",
    "topicId": "harness/understand-the-harness/failure-and-durability-model",
    "parentTopicId": "harness/understand-the-harness",
    "order": 160,
    "title": "Failure and durability model",
    "description": "Understand what fails fast, what is retried, and which durability boundary your application must supply.",
    "pageRole": "task"
  },
  {
    "product": "harness",
    "topicId": "harness/understand-the-harness",
    "parentTopicId": "handbook-harness",
    "order": 100,
    "title": "Understand the AI Harness",
    "description": "Learn the runtime boundaries before adding models, tools, workflows, or persistence.",
    "pageRole": "chapter"
  },
  {
    "product": "harness",
    "topicId": "harness/understand-the-harness/mental-model-and-runtime-architecture",
    "parentTopicId": "harness/understand-the-harness",
    "order": 110,
    "title": "Mental model and runtime architecture",
    "description": "See where the Harness ends and where application responsibility begins.",
    "pageRole": "task"
  },
  {
    "product": "harness",
    "topicId": "harness/understand-the-harness/workflows-and-tasks",
    "parentTopicId": "harness/understand-the-harness",
    "order": 130,
    "title": "Workflows and tasks",
    "description": "Put deterministic application orchestration around agents instead of hiding it in the model loop.",
    "pageRole": "task"
  },
  {
    "product": "harness",
    "topicId": "harness/upgrade-and-migrate",
    "parentTopicId": "handbook-harness",
    "order": 1300,
    "title": "Upgrade and migrate",
    "description": "Upgrade packages and durable data with explicit compatibility checks and rollback evidence.",
    "pageRole": "chapter"
  },
  {
    "product": "harness",
    "topicId": "harness/upgrade-and-migrate/migrate-to-v3",
    "parentTopicId": "harness/upgrade-and-migrate",
    "order": 1310,
    "title": "Migrate to Harness 3",
    "description": "Replace split durability APIs with one storage boundary and perform an explicit data migration.",
    "pageRole": "migration"
  }
] as const

export default canonicalContentManifest
