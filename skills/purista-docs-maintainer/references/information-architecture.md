# Information Architecture and Reading Flow

## Contents

- [Audience journeys](#audience-journeys)
- [Flow at three scales](#flow-at-three-scales)
- [Chapter hierarchy](#chapter-hierarchy)
- [Hub-and-adapter structure](#hub-and-adapter-structure)
- [Navigation rules](#navigation-rules)
- [Independent page test](#independent-page-test)

## Audience journeys

Design the public information architecture around questions, not repository folders.

| Reader | First question | Useful progression | Successful exit |
|---|---|---|---|
| CTO or development lead | Does this solve our delivery, governance, integration, or scaling problem? | problem → architecture → operational effect → evidence → adoption path | can decide whether to evaluate |
| Architect | Where are boundaries, contracts, ownership, failure modes, and extension points? | mental model → system flow → options → tradeoffs → production constraints | can assess fit and risk |
| New PURISTA developer | How do I get a working result? | outcome → prerequisites → scaffold → implement → run → verify | has a working local result |
| Application developer | Which primitive or adapter fits my case? | capability hub → decision table → chosen guide → configuration → tests | can implement the chosen path |
| Operator or security reviewer | How does this behave and fail in production? | topology → controls → telemetry → recovery → troubleshooting | can define a runbook or controls |

Do not force these readers through the same entry page. Cross-link at the point where their questions converge.

## Flow at three scales

### Site

The public site should make this progression easy to discover:

1. Evaluate the problem and value.
2. Understand the mental model and architecture.
3. Reach a first working result.
4. Learn the core primitives and normal development workflow.
5. Choose transports, stores, providers, deployment shapes, and integrations.
6. Configure, customize, test, secure, and operate the application.
7. Use API and configuration reference for exact lookup.

This is a reading path, not a mandatory sequence. Provide direct task and reference entry points for returning users.

### Chapter

A substantial chapter should usually progress through:

1. A concise chapter promise and scope.
2. A mental model or architecture overview.
3. A smallest useful implementation path.
4. A map of options, adapters, or use cases.
5. Focused deeper pages for configuration and customization.
6. Testing, operations, security, reliability, and troubleshooting.
7. Reference, migration, and next-step links.

Do not create a chapter page that merely repeats its child titles. It should orient the reader, explain relationships, and help choose the next page.

### Page

A task-oriented page should normally move through:

1. Outcome and reader context.
2. Minimal mental model.
3. Prerequisites and installation.
4. Small working setup.
5. Expected result and verification.
6. Decision guidance or important alternatives.
7. Detailed configuration and customization.
8. Production concerns, failures, and troubleshooting.
9. Focused next steps and references.

Use only the sections the page needs. Preserve the order so readers do not meet advanced caveats before they understand the normal path.

## Chapter hierarchy

Prefer a deep hierarchy when it keeps individual topics short, findable, and independently useful:

```text
Capability
├── Overview and decision guide
├── Quickstart
├── Core concepts
├── Adapters
│   ├── Adapter A
│   ├── Adapter B
│   └── Custom adapter
├── Configuration
│   ├── Defaults and resolution
│   └── Production hardening
├── Testing and operations
└── API and compatibility reference
```

Depth is justified when child pages have distinct user questions. Avoid a hierarchy where intermediate pages contain no explanation or where a common task is obscured by taxonomy.

## Hub-and-adapter structure

Use this structure for stores, event bridges, queue bridges, model providers, storage backends, sandboxes, observability exporters, deployment targets, and similar extension points.

The capability hub owns:

- purpose and common contract;
- system position and lifecycle;
- minimal provider-neutral usage;
- capability and guarantee matrix;
- selection criteria, pros, cons, and near-misses;
- custom extension path;
- links to every supported implementation.

Each adapter page owns:

- when to choose or avoid it;
- supported versions and compatibility source;
- installation;
- smallest working configuration;
- complete option/default reference or a precise API link;
- authentication, secrets, connectivity, and least privilege;
- runtime behavior, delivery or consistency guarantees, and failure modes;
- local/test setup and production setup;
- verification, operational signals, recovery, and troubleshooting;
- migration notes and provider documentation.

Keep common usage on the hub. Keep provider-specific facts on the adapter page.

## Navigation rules

- Use reader vocabulary in labels; do not expose internal package or implementation taxonomy unless the reader is looking up a package.
- Give every canonical page at least one meaningful inbound route and one next-step route.
- Cross-link siblings through their hub or a comparison table instead of building a dense mesh of weak links.
- Keep tutorial, explanation, task guide, and reference roles visibly distinct.
- When two routes cover the same job, choose one canonical page, merge unique value, and redirect the other.
- Preserve stable public slugs where possible. If naming is poor but already public, use redirects and update all internal links in the same change.
- Place prerequisites close to the action that needs them. Do not force a reader to infer hidden setup from an earlier chapter.
- Use breadcrumbs and sidebar nesting to expose location, not to communicate the entire mental model.

## Independent page test

A page passes when a reader arriving from search can answer these questions without reading earlier pages:

- What will this help me do?
- Is this the right page for my situation?
- What do I need before starting?
- What should I change or run?
- What result proves it worked?
- What important choice or risk must I understand?
- Where do I go for an alternative, deeper configuration, or exact API details?

Add only the minimum repeated context needed to pass. Link to canonical explanations for the rest.
