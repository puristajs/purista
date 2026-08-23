# Migration Workflow

## 1. Establish a baseline

Record the current revision, package-manager and lockfile, every direct
`@purista/*` dependency, local scripts, deployment manifests, and custom
adapter package. Run the existing non-mutating checks first. If the project
exports definitions, save the current JSON artifact outside the deployment
input path so topology changes are reviewable.

Do not start by replacing `latest`, deleting the lockfile, or re-running a
generator over existing application files. A migration needs a known before
state and a reversible dependency change.

## 2. Build a migration ledger

For each change, record:

| Field | Required evidence |
| --- | --- |
| Change | File, package, contract, or deployment input |
| Reason | Target release behavior or resolved diagnostic |
| Boundary | Application, consumer, adapter, scheduler, store, or infrastructure |
| Verification | Exact local script, scenario, or observed output |
| Rollback | Version or deployment action that restores the former behavior |
| Owner | Person or team accountable for deployment and acceptance |

Keep API consumers and infrastructure changes separate from handler edits. A
passing TypeScript build does not validate an HTTP error contract, a queue
guarantee, or cross-replica schedule behavior.

## 3. Make changes in dependency order

1. Update the compatible `@purista/*` package family and lockfile together.
2. Repair import boundaries and removed APIs without adding compatibility
   shims that conceal the target API.
3. Update builder declarations and local schemas before handlers and runtime
   wiring.
4. Update deployment dependencies: bridges, stores, scheduler provider,
   secrets, telemetry SDK/exporter, and consumers.
5. Regenerate only a new service, command, subscription, queue, worker,
   schedule, or agent through the project-local `add:*` script.

For an import that is not clearly application authoring, test code, an outbound
client, or an adapter implementation, do not guess a new module path. Inspect
its runtime role and the published API documentation first.

## 4. Verify the real topology

Use the scripts actually declared by the application. A typical sequence is:

```bash
npm run export:definitions
./node_modules/.bin/purista inspect --definitions purista.definitions.json --view agent --scope service:<name>/<version> --depth 1 --schemas referenced --format json
./node_modules/.bin/purista validate --definitions purista.definitions.json --strict --format json
./node_modules/.bin/purista doctor --definitions purista.definitions.json --format json
npm run lint
npm run test
npm run build
```

Equivalent package-manager commands are valid. Skip a command only when the
project does not provide the required script or installed CLI; record that gap
in the ledger rather than substituting a network-fetched global binary.

`inspect`, `validate`, and `doctor` prove declarations and project shape. They
do not prove live broker, store, scheduler-provider, exporter, or model health.

## 5. Separate rollout from source migration

Deploy shared infrastructure before code that requires it. Where a consumer
must accept both shapes temporarily, make the compatibility window explicit,
measure its use, and remove it on a scheduled date. Canary a boundary whose
failure would duplicate work, expose data, or change a client-visible result.

Read the version-specific reference only after the baseline is established.
