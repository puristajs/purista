# Optional Dependencies and Feature Enablement

## Contents

- [Goal](#goal)
- [Classify availability precisely](#classify-availability-precisely)
- [Verify the classification](#verify-the-classification)
- [Place enablement guidance where it is needed](#place-enablement-guidance-where-it-is-needed)
- [Required enablement block](#required-enablement-block)
- [Installation guidance](#installation-guidance)
- [Missing dependency and disabled-feature behavior](#missing-dependency-and-disabled-feature-behavior)
- [Security, operations, and deployment](#security-operations-and-deployment)
- [Audit checklist](#audit-checklist)

## Goal

A reader must be able to tell, before copying code:

- what works immediately after the documented base installation;
- what code is present but requires explicit configuration or runtime wiring;
- what additional package, tool, adapter, binary, sidecar, account, or external service is required;
- how to enable and verify the feature;
- what happens when the prerequisite is absent or incompatible; and
- whether the setup is suitable only for local development or also for production.

Do not make readers infer availability from imports, package names, or a failed runtime call.

## Classify availability precisely

| Classification | Meaning | Documentation requirement |
|---|---|---|
| Included and enabled by default | Base install wires usable behavior without additional action | State the default and show the first result |
| Included but opt-in | Code ships with the base package, but a builder call, config value, capability declaration, or runtime binding enables it | Show the exact activation and default disabled behavior |
| Separate first-party package | The application installs another `@purista/*` or Harness package | Name and install the package before its first import |
| Peer dependency | The consuming application must provide a compatible package/version | State the supported range and package-manager consequences |
| Package-manager optional dependency | A manifest uses `optionalDependencies`; installation may be skipped or fail without failing the whole install | Explain detection, supported absence, and platform/package-manager behavior |
| Development-only tool | Required for generation, build, tests, or documentation, but not normal runtime execution | Put the install step in the relevant workflow and keep it out of runtime requirements |
| External runtime/service | A broker, database, sidecar, binary, model endpoint, or cloud account is required in addition to the JavaScript package | Cover provisioning, credentials, connectivity, compatibility, and health evidence |
| Custom implementation | The public contract exists, but the application supplies an adapter/provider | Link the contract, required capabilities, conformance tests, and wiring point |

“Optional feature” describes the user experience. The `optionalDependencies` field is only one package-manager mechanism and does not prove that a feature is optional at runtime.

Also distinguish these states:

- installed: the package exists in the dependency graph;
- importable: the current runtime/platform can load it;
- configured: required values and credentials resolve;
- wired: the application passes or registers it at the correct composition boundary;
- enabled: the feature is selected and startup accepts its capabilities;
- production-ready: the chosen adapter and deployment provide the required security, durability, scale, and operations.

## Verify the classification

Inspect all relevant evidence rather than trusting one manifest field:

- `dependencies`, `peerDependencies`, `peerDependenciesMeta`, `optionalDependencies`, and `devDependencies`;
- package exports and runtime/platform conditions;
- static and dynamic imports, lazy loaders, plugin discovery, and error messages;
- default builder/config values and feature flags;
- application composition and `getInstance(...)` runtime bindings;
- startup capability validation and fail-fast behavior;
- CLI/starter templates and generated package manifests;
- tests for present, absent, incompatible, and disabled cases;
- bundler, Node/Bun, serverless, edge, native-binary, or operating-system constraints;
- official provider compatibility and lifecycle documentation.

If the manifest, runtime error, implementation, and docs classify a dependency differently, stop and resolve or record that drift before publishing a definitive availability claim.

## Place enablement guidance where it is needed

Do not hide every optional feature on one global installation page.

- Capability hub: include an availability matrix showing the default path and optional implementations.
- Tutorial/task page: place a short “Availability” or “Enable this feature” section immediately before the first step that needs it.
- Adapter/provider page: own its package install, external prerequisites, runtime wiring, and compatibility.
- Configuration/reference page: own the exhaustive option/default and version details.
- Quickstart: use the default included path unless the tutorial's explicit goal is the optional feature.
- Operations/deployment page: state which local defaults must be replaced for production.

Link to the canonical adapter or feature page instead of repeating long setup blocks throughout the handbook.

Use a concise hub table such as:

| Feature or adapter | Available after base install | Additional package | External prerequisite | Enablement guide |
|---|---|---|---|---|

Avoid ambiguous labels such as “supported” when a reader still needs to install, configure, or provision something.

## Required enablement block

For an optional feature, document this sequence as applicable:

1. Default state: what works without the feature and whether it is disabled, unavailable, or backed by a local-only default.
2. Fit: when the user should enable it and when they should not.
3. Install: exact application-level package/tool command and supported version relationship.
4. Provision: external service, account, binary, sidecar, endpoint, credentials, or network requirement.
5. Wire: exact import, builder/helper, registration, or composition-root binding.
6. Configure: smallest safe values, secret source, defaults, and required capability flags.
7. Run/restart: any build, generation, restart, migration, or deployment step.
8. Verify: observable output, capability report, health result, generated artifact, test, or safe log/trace signal.
9. Missing/incompatible behavior: error name/message, startup failure, supported fallback, or deliberate degradation.
10. Disable/remove: how to unwind configuration, dependency, data, generated artifacts, or external resources when this is non-obvious.

Keep the first enablement path small. Link to production hardening and exhaustive reference after it works.

## Installation guidance

- Install optional runtime packages in the application composition root, not by adding them to PURISTA core unless the implementation explicitly owns them.
- Use the project's package manager and current supported version policy. Do not mix npm, pnpm, Yarn, and Bun commands in one flow without a code group or clear selection.
- State whether the package belongs in runtime `dependencies` or `devDependencies`.
- Do not recommend `latest` in version-sensitive compatibility or migration guidance.
- Show the install command before the first import. Do not rely on an error message as the installation guide.
- Explain whether adding the package alone is insufficient because explicit registration, capabilities, credentials, or an external service are still required.
- For generated projects, verify whether the CLI already adds the dependency and wiring for the selected blueprint. Do not tell users to install it twice.

## Missing dependency and disabled-feature behavior

Document the actual behavior:

- fail fast at startup;
- throw only when the optional operation is invoked;
- omit the feature from capability discovery;
- use an intentional local/test fallback;
- degrade to reduced functionality; or
- become invalid for production even though local execution continues.

Name the evidence a reader will see. Prefer actionable errors that identify the missing package or capability and the install/enablement step.

Do not promise graceful fallback unless it is implemented and tested. Do not silently fall back from a requested durable, secure, or isolated capability to an in-memory or host-level alternative.

## Security, operations, and deployment

Optional features can change the trust and operational boundary. Cover, where relevant:

- new package and plugin supply-chain risk;
- install scripts, native binaries, platform support, and container image changes;
- credentials, secret-store usage, network egress, TLS, and least privilege;
- data residency, retention, encryption, and tenant isolation;
- new health checks, metrics, traces, logs, cost signals, and alerting;
- migration, rollback, cleanup, and removal of external resources;
- bundle size, cold start, edge/runtime incompatibility, or tree-shaking effects;
- license or vendor lifecycle constraints when they affect adoption.

## Audit checklist

- Every optional capability has one canonical enablement page or section.
- Hubs identify the default implementation and every additional package/external prerequisite.
- The first import is preceded by an installation requirement or a clear statement that the base scaffold already installed it.
- Package classification matches manifests, loaders, runtime wiring, capability checks, tests, and generated templates.
- Present, absent, disabled, incompatible, and local-only behavior is documented and tested where material.
- Install, wiring, configuration, and verification are separate and complete.
- Production guidance does not mistake an in-memory/local default for a supported production adapter.
- Removing or disabling a feature cannot leave unexplained configuration, data, generated output, or infrastructure behind.
