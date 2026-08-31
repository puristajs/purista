# Tutorial reconstruction evidence

Verified on 2026-08-31 with Node 26.5 and published PURISTA 3.2.4 packages.
This record covers the rebuilt opening and transaction chapters only. It is
not evidence that the remaining tutorial roots are complete implementation
guides.

## Replayed checkpoints

| Checkpoint | New behavior | Source tests after replay | Additional network evidence |
| --- | --- | --- | --- |
| `project` | CLI project with working compiler/test settings | 2 | No listener yet |
| `http` | Explicit Hono installation, configuration, startup/shutdown | 2 | `/health` returns 200 |
| `service` | Generated Banking service replaces Ping in startup | 3 | `/health` returns 200 |
| `first-command` | Generated and implemented `getBankInfo` | 4 | `/api/v1/bank` returns name/currency |
| `repository` | Transaction schema, storage resource, application/test injection | 4 | Existing bank command still works |
| `record-transaction` | Generated POST command and validation/conflict checks | 5 | Existing bank command still works; POST runtime covered by HTTP integration test |
| `list-transactions` | Generated history command sharing repository state | 6 | Real TCP POST/list round trip, 400, 409, no rejected extra rows |

Executed from the repository root into a previously nonexistent directory:

```bash
node examples/banking/tutorial/replay.mjs --to list-transactions --out /private/tmp/example-bank-replay-api --verify-http
```

Every checkpoint passed `npm test` and `npm run build`. The runner installed
published dependencies outside the monorepo and used the generated project's
local CLI scripts. The printed file bodies match 21 checked-in snapshots.

The Node listener was verified separately from Hono's in-process `app.request`
tests. Processes started by the replay were stopped after each probe. Storage
was fresh for every probe and every test.

The rewritten pages rendered in Astro's dev server at desktop width 1280 and
mobile width 390. The mobile chapter menu followed the backend-first order.
Long inline file paths initially clipped; the shared prose style now wraps
them. No browser console error was observed on the checked resource page.

Repository checks also passed: the full website build (including API docs),
the generated-link audit (2338 HTML files), knowledge and skill audits, and
the CLI build plus focused generator/artifact tests (5 tests). The full build
retains existing TypeDoc and large-chunk warnings. These checks supplement,
but do not replace, the consumer replay above.

## Setup failures found and addressed

- Fresh TypeScript 7 compilation rejected the generator's old module resolution
  and missing root directory. The CLI template now uses NodeNext and `rootDir`.
  The tutorial includes a complete configuration for the published generator.
- The published CLI's standalone bootstrap imported core without declaring it.
  The CLI package now declares core. Until that fix is published, the tutorial
  supplies both packages through npx's `--package` options.
- Default test discovery also ran compiled copies after a build. The generated
  Node test script and tutorial now restrict Vitest to `src`.
- CLI service selection uses the lowercase project key `banking`, while the
  generated runtime service name is `Banking`. The walkthrough uses the tested
  CLI key and checks actual files, not only the CLI's reported path labels.
- The old Astro dev process referenced `web/node_modules/astro` after Astro was
  hoisted to the root installation. Restarting that process restored page
  rendering; no tutorial content file needed a template workaround.

## Next reconstruction work

The remaining chapters still contain reference-demo instructions and partial
snippets. Do not count them as completed because their existing demo tests pass.
Next, rebuild `authenticated-banking-ui` from `list-transactions`: server-derived
tenant/principal identity, account/action/state guards for valid callers,
tenant-scoped storage, and denied requests with no protected effects. Preserve
the route but keep the frontend optional.

Then continue with import/export transforms, business events/subscriptions,
streams, queues/workers, schedules, business observability, and attached AI.
Each new root must have its own reproducible entry checkpoint and be taught
through exact CLI generation, file edits, runtime wiring, and end-to-end tests.
The combined source in `examples/banking/src` may inform behavior, but its
different layout is not a substitute for those build steps.

Current tutorial port: 3000. The older combined demo uses a different entry
point and may use port 3010. Do not mix their commands or file paths.
