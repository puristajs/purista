# Runnable examples and local dependencies

## Consumer application first

Keep banking tutorial code under `purista/examples/banking/` unless the current
series plan changes that location. The containing workspace is discovered by
the repo's `examples/*` pattern; nested applications need explicit scripts or
workspace configuration. Do not assume recursive package discovery.

Each chapter owns a runnable starting point, complete solution, selected
intermediate checkpoints, fixtures, tests, runtime composition, and isolated
data location. Shared UI components and fixture utilities are appropriate;
shared code must not hide the behavior the chapter is teaching. No chapter
depends on a previous chapter's running process or database.

Provide a clean consumer install using declared, compatible dependencies and
a lockfile in the distributed example. Keep maintainer workspace builds and
sibling checkouts out of public setup instructions. Verify packed artifacts
or published versions separately from workspace source. Clearly label a
pre-release dependency and do not publish unusable install instructions.

Expose consistent scripts for install guidance, dependency up/down, dev/start,
typecheck, test, build, seed/reset, and relevant integration tests. The series
plan may propose names; verify their actual implementation before printing
commands. Check advertised source checkpoints, not just the final solution.

## Dependency contract

For every chapter, list what runs, why it is needed, whether it is real or
mocked, its tested version, address, health signal, data owner, and stop/reset
behavior. Say explicitly when no external service is needed.

Use Docker Compose profiles or an equally reproducible setup for required
databases, brokers, identity fixtures, retrieval stores, observability tools,
and mocked external APIs. Start only the selected chapter's dependencies;
do not require the whole banking system to learn a command.

- Pin tested image versions or digests; avoid an unbounded `latest` image.
- Include actual mock implementations, fixtures, and build contexts. A
  reference to a nonexistent example image or remote mock is not runnable.
- Use health checks and application readiness with bounded waits. Container
  creation or a fixed sleep does not prove the dependency accepts requests.
- Seed deterministic synthetic data and expose fault modes when teaching
  timeout, retry, denial, or invalid upstream responses.
- Scope networks, volume names, and reset actions to the example. Avoid host
  networking, privileged containers, or Docker socket mounts unless the
  lesson specifically requires and explains that boundary.
- Bind published development ports to loopback by default. Explain port
  conflicts, configuration, credentials, and first-run image downloads.
- Separate dependency shutdown from destructive reset. Document exactly which
  example data reset removes; never use system-wide container/volume pruning.
- Commit `.env.example`, not credentials. Local fixture credentials are
  explicitly local-only, never production defaults, and rejected outside the
  development profile where applicable.

Prefer host-run TypeScript for an approachable edit/run loop, with dependencies
in Compose. Also support the planned built application/UI serving path. Do
not imply Compose itself provides production security or durability.

## Models and guarantees

The default demonstration uses a scripted provider and real PURISTA execution.
It needs no paid account and visibly labels model replies as simulated. A live
mode supplies a compatible model through the attached service's runtime
binding, with explicit credentials, limits, and cost expectations. Never put
provider credentials in browser code or make a live call merely to render UI.

Mock external services implement the actual contract used by the example.
Model fixtures test flow, not model quality; fake embeddings test plumbing,
not semantic retrieval. Local in-memory queues, stores, and sandboxes do not
prove production persistence, delivery, or process isolation.

Every promised durability or isolation behavior needs a real integration
profile and a test of that behavior. For restart tests, persist application
domain state and attached-runtime state at their separate correct boundaries.
For streams, verify bridge capabilities before selecting a topology.
