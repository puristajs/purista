# Verification and maintenance

## Evidence before publication

Keep a chapter evidence record with page/step ID, source checkpoint, snippet
regions, dependency profile, UI route, service contract, identity paths,
commands executed, expected result, observed result, and unresolved limits.
Separate proposed work from verified features.

Choose checks that prove the chapter's claims:

| Boundary | Required evidence when applicable |
| --- | --- |
| Fresh learner setup | Clean consumer install, seed, dependency readiness, first command/UI result, stop and scoped reset |
| Source checkpoints | Typecheck/build and the observable result promised at each advertised checkpoint |
| Business logic | Valid/invalid input, expected result, authorization, important side-effect failures |
| Framework runtime | Real registration/invocation and the command/event/stream/job/agent flow the chapter teaches |
| External integration | Real broker/database/MCP/auth mock round trip, timeout/error handling, reconnect/restart when claimed |
| Identity | Per-hop assertions plus cross-tenant and same-tenant cross-user denial through actual HTTP/service paths |
| Business guards/transforms | Valid callers with different action/object/state permissions; no denied effects; raw/domain mapping and full runtime hooks; atomic mutation conflicts |
| UI | Real requests, keyboard use, loading/empty/error states, cancellation, desktop/mobile, no client credentials |
| Live AI | Reviewed data, per-case outcomes, calibrated scoring, bounded cost/time; distinct from scripted tests |
| Content | Source-derived snippets, accurate paths, links, page order, clear checkpoint handoffs, novice reading review |

Before publishing a chat UI, verify the real frontend transport and protected
Hono route together. A fabricated stream or visual mock cannot prove protocol
compatibility. Before claiming durable human review, restart both relevant
processes and retain domain review state as well as Harness checkpoints.

## Navigation and maintenance

Use one Tutorials manifest for chapter/step ownership, ordering, canonical
routes, breadcrumbs, previous/next, search, example checkpoints, feature tags,
and Harness use-case backlinks. Keep the two Handbook product graphs intact.
Preserve stable routes; move unique content before redirecting old pages.
Publish no placeholder destinations or links to unimplemented chapters.

Map every promised capability to a concrete step, source, and proving test.
New Harness use-case stories need a Framework tutorial mapping. New providers
need their own declared profile and capability evidence, not a copied guarantee.

When source changes, find dependent snippets, checkpoints, UI contracts, fixture
schemas, and pages. Update them together. Re-run all dependent chapters when
shared code changes. Keep the combined showcase composed from complete
definitions rather than maintaining duplicate business implementations.

Use deterministic checks for each affected PR, real infrastructure checks in
provisioned CI, and live evaluations only in explicitly budgeted runs. Do not
silently skip a required dependency or replace a real test with a mock while
reporting the same claim as verified.

For skills/guidance changes, run from `purista`:

```sh
npm run audit:skills
npm run audit:knowledge
```

For website/tutorial content, also use the existing Handbook/link audits and
web build where relevant, then inspect changed routes in a browser. Run
`npm run check:drafts --prefix examples/banking` for draft structure and
source references, and `npm run test:drafts --prefix examples/banking` for the
draft projects' build, test, and lint gates. Published chapters additionally
require the clean consumer replay and runtime smoke gate. Do not report one of
these narrower checks as evidence for a boundary it does not execute.

When syncing the catalog, update `purista/skills` first, then the affected
`packages/core/skills` files and installed mirrors. Check for unrelated local
changes before copying; do not overwrite another author's work through a
whole-tree reset. Update routing/catalog audit classifications when adding a
new internal maintainer. Runtime behavior changes belong in source and its
normal specs/tests before tutorial prose claims the behavior.

Planning-only or skill-only work does not require building nonexistent
examples. Report that scope explicitly. Do not claim browser, container, model,
or behavioral evaluation passes when only static checks were performed.
