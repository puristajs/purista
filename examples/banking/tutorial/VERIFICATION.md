# Tutorial verification

The tutorial has 28 published capability chapters: 17 Framework chapters and
11 AI chapters. `course.json` is the source of chapter ids, page recipes,
visibility, prerequisites, and construction evidence.

## Published course gate

From the repository root, run:

```sh
npm run check:tutorials --prefix examples/banking
npm run build -w @purista/web
npm run test:tutorials --prefix examples/banking
```

`check:tutorials` checks all 11 source-aligned AI chapters, including their
structure, complete write blocks, and retained source references.
`test:tutorials` additionally runs each local AI project's build, tests, and
lint checks. The website build checks rendered tutorial content. The banking
workspace's default `npm test` and `npm run build` commands call these local
gates and do not require registry publication.

After the declared package versions are available in the registry, run:

```sh
npm run check:replay --prefix examples/banking
npm run test:consumer --prefix examples/banking
```

`check:replay` verifies page and source provenance for chapters with
fresh-replay evidence. `test:consumer` copies every such project to a directory
outside the repository, resolves its declared public ranges without writing a
lockfile, runs its typecheck and tests, builds it, and starts the compiled
application for its loopback smoke check. Temporary copies are removed after
the run.

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
`check:replay` check remains a release-evidence gate.

## Locally verified AI gate

The 11 source-aligned AI chapters are:

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

Each chapter needs a focused typecheck, lint, and deterministic tests before it
is visible. `constructionSourceAligned` records that the instructions and
retained source agree. `constructionVerified` records separate fresh consumer
replay evidence. AI tests use a fake or scripted provider by default. A live
provider run is optional evidence and must never require credentials for the
default gate.

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
Harness definition per service version. Bind every user-chosen purpose alias under the exact `ai.models` key;
keep providers, storage, memory, sandbox, workspace, admission, queues,
artifacts, and telemetry in application bootstrap. Authentication establishes
identity, PURISTA guards authorize business effects, and Harness guardrails
handle model content policy.

The tutorial lane does not edit course tooling, manifests, generated source,
or package locks. Retained project package-lock convergence is owned by
**P4-044**.
