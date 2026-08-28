# Verification and Handoff

## Contents

- [Verify evidence](#verify-evidence)
- [Verify content](#verify-content)
- [Verify code and configuration](#verify-code-and-configuration)
- [Verify navigation and links](#verify-navigation-and-links)
- [Verify rendered pages](#verify-rendered-pages)
- [Repository commands](#repository-commands)
- [Handoff](#handoff)

## Verify evidence

- Intended behavior, current implementation, tests, generated API inventory, CLI/starter output, and handbook claims agree.
- Every new package, option, method, default, error, compatibility range, and limitation has an inspectable source.
- Default/optional classification matches package manifests, loaders, generated templates, runtime wiring, and capability checks.
- A freshly generated TypeDoc JSON was used for API-shaped review.
- External compatibility and migration links point to current official provider documentation.
- Uncertainty is reported as a gap rather than converted into a claim.

## Verify content

- The page has one primary job and names its audience/outcome early.
- A reader arriving directly has enough context and prerequisites.
- The first working path uses safe defaults and shows expected evidence.
- Every optional feature states its additional package or external prerequisite, enablement steps, verification, and absent/incompatible behavior.
- Alternatives have decision criteria, not only names.
- Detailed configuration states exact keys/defaults or links to the precise API surface.
- Testing, security, reliability, operations, and troubleshooting appear where the topic requires them.
- Related links form a deliberate previous/next or hub/child path.
- No second page competes as the canonical explanation.
- No internal spec, plan, skill, or contributor-only workflow leaks into public content.

## Verify code and configuration

- Commands and package names exist.
- Install commands place runtime and development-only dependencies in the correct manifest section for the supported package manager.
- Imports and public methods exist in current source/API output.
- CLI-generated paths match current templates and project configuration.
- Snippets use ESM and the supported high-level builder/helper path unless clearly advanced.
- Configuration types, defaults, validation, and precedence match implementation.
- Lifecycle, hook, and shutdown callback examples preserve any required
  receiver binding. Verify the actual runner invocation rather than assuming a
  helper that returns a method is already safe to pass through unchanged.
- Expected output is realistic and corresponds to the shown setup.
- Examples do not expose secrets, PII, tenant/user identifiers, prompts, completions, headers, raw payloads, or attachments.
- Failure and retry examples preserve idempotency and do not recommend blind retries.
- Optional-feature examples verify installed, configured, wired, enabled, and production-ready states separately where they differ.

For non-trivial snippets, prefer one of:

- extract/adapt a maintained test or example;
- compile a minimal fixture against current packages;
- run the focused example;
- use exported TSDoc that is already verified by current API generation.

Do not accept visual plausibility as code verification.

## Verify navigation and links

- New pages are reachable from the intended section, hub, or audience entry point.
- Section/card/item IDs in `web/src/data/handbook.ts` resolve to current content.
- Relative and absolute internal links resolve after the site build.
- Heading anchors exist.
- API links point to routes produced by current TypeDoc data.
- Removed canonical routes have redirects and no remaining internal inbound links.
- Links to providers use stable official documentation when possible.

## Verify rendered pages

For content-only changes, inspect the affected rendered pages. For layout, component, visual, or navigation changes, inspect all affected routes at desktop and mobile widths.

Check:

- heading hierarchy and readable line length;
- code overflow, wrapping, and syntax highlighting;
- Mermaid rendering, labels, dark/light contrast, and mobile readability;
- tables at narrow widths;
- callout emphasis and semantic color use;
- sidebar/breadcrumb active state;
- duplicate titles or odd route labels;
- no clipped, overlapping, or decorative-only visuals;
- primary website pages still follow `web/DESIGN.md`.

## Repository commands

Run from the `purista` repository root unless noted:

```bash
npm run build:api-docs
npm run build -w @purista/web
npm run audit:internal-links -w @purista/web
npm run audit:knowledge
git diff --check
```

After skill catalog changes, also run:

```bash
node scripts/syncPackageSkills.mjs packages/core
npm run audit:skills
```

Run focused package/example tests when documentation changes or adds executable code for that surface. A full repository test is optional for prose-only work unless the change also modifies implementation or generated code.

Do not edit `web/dist`, `docs`, or generated API JSON by hand. Rebuild through repository commands and review whether generated artifacts are expected to be committed for the current workflow.

## Handoff

Report:

- pages and navigation changed;
- user problem and audience addressed;
- implementation/tests/API evidence used;
- redirects or canonical-page decisions;
- verification commands and rendered routes checked;
- remaining coverage gaps or uncertainties;
- intentionally deferred follow-up, with reason and priority.

For an audit, prioritize findings by user harm and decision blockage. Include concrete page/source evidence and a self-contained recommended change. Avoid a generic “rewrite the docs” conclusion.
