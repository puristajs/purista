# Tutorial verification

The tutorial has 28 capability chapters: 17 published Framework chapters and
11 AI chapters that remain draft until their proof is complete. `course.json`
is the source of chapter ids, page recipes, statuses, prerequisites, and
retained source hashes.

## Published course gate

From the repository root, run:

```sh
npm run check:drafts --prefix examples/banking
npm run check:source --prefix examples/banking
npm run build -w @purista/web
npm test --prefix examples/banking
```

`check:drafts` checks the 11 draft packets without counting them as published.
`check:source` verifies the page hashes, retained source hashes, and source
provenance for published chapters. The website build checks rendered tutorial
content. `npm test` copies every retained project to a fresh directory outside
the repository, resolves its declared public ranges without writing a lockfile,
runs its typecheck and tests, builds it, and starts the compiled application for
its loopback smoke check. Temporary copies are removed after the run.

For one chapter during isolated work, use the bounded check:

```sh
node examples/banking/tutorial/replay.mjs --check --chapter command-transforms
```

To reconstruct the chapter from its lessons, provide a new output directory:

```sh
node examples/banking/tutorial/replay.mjs \
  --chapter command-transforms --out /tmp/purista-bank-replay
```

The replay follows the declared construction recipe and prerequisites, uses
published package names, and executes the documented commands and requests. It
does not invent missing files or repair instructions silently. The unfiltered
`check:source` check remains the release gate.

## Draft AI gate

The 11 draft chapters are:

1. `classification-agent`
2. `ai-guardrails`
3. `retrieval-ingestion`
4. `conversation-memory`
5. `agent-tools`
6. `agent-skills`
7. `human-review-workflow`
8. `parallel-agents`
9. `multi-step-workflow`
10. `sandbox-analysis`
11. `agent-evaluation`

Each draft packet needs a focused typecheck, lint, deterministic tests, and a
fresh consumer replay before its status changes. AI tests use a fake or scripted
provider by default. A live provider run is separate, optional evidence and
must never require credentials for the default gate.

An AI packet is complete only when its proof covers the native Harness
definition, service-owned composition, one mount, address-first caller,
runtime bindings, deterministic Harness test, PURISTA context test, and real
local bridge path claimed by the chapter. RAG packets also prove the declared
embedding model, authorized retrieval command, grounded result, and AI SDK UI
Message Stream v1 path. Workflow packets prove interruption, resume, replay,
and cleanup where those behaviors are taught.

## Source and ownership boundaries

The tutorial teaches Framework code under the owning service. Agents and
workflows use native `@purista/harness` definitions under:

```text
src/service/<service>/v<version>/harness/{agent,workflow,tool,skill,mcp}
```

Portable tools use `defineTool(...)`. Tools that need service resources or
trusted identity use `ServiceBuilder.defineTool(...)`. Mount one composed
Harness definition per service version. Bind the primary model as `ai.model`;
keep providers, storage, memory, sandbox, workspace, admission, queues,
artifacts, and telemetry in application bootstrap. Authentication establishes
identity, PURISTA guards authorize business effects, and Harness guardrails
handle model content policy.

The tutorial lane does not edit course tooling, manifests, generated source,
or package locks. Retained project package-lock convergence is owned by
**P4-044**.
