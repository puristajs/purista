# Implementation Planning

Use this reference when turning an approved PURISTA design into work packages.

## Split By Ownership
Good implementation slices align to ownership boundaries:
- one package
- one service
- one command/subscription/stream/queue/worker
- one optional agent
- one runtime adapter
- one CLI/scaffold template
- one docs/skill update

Avoid tickets that mix architecture discovery, package refactors, generated code, and runtime behavior without naming dependencies.

## Architecture vs Implementation
Architecture tickets should decide:
- capability ownership
- contracts
- source of truth
- runtime guarantees
- optional dependencies

Implementation tickets should specify:
- write scope
- public APIs
- generated artifacts or CLI commands
- tests
- forbidden imports or stale terms
- acceptance checks

For framework metrics work, update the metric catalog/spec before adding or renaming framework metrics. Custom application metrics belong in builder declarations and examples under `app.*`; do not add backend-specific exporters or Prometheus client dependencies to core packages.

## Parallel Work
Parallelize only when write scopes are disjoint:
- core types/runtime
- AI package
- HTTP package
- CLI templates
- starter/create-purista alignment
- docs/skills

Do not split one fragile type surface across multiple workers unless ownership is very clear.

## Cleanup Rule
When no backward compatibility is required, delete obsolete protocol/provider/runtime code instead of preserving shims.

## Acceptance Checks
Every implementation plan should include:
- package build/test/lint commands
- dependency boundary scans
- stale terminology scans
- generated fixture checks when CLI output changes
