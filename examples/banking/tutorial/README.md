# Build Example Bank, step by step

These are the source edits taught in the website tutorials, not the combined
demo in `../src`. The CLI creates the project and artifacts. Each directory in
`steps/` contains complete replacement files applied at that point.

Follow the [first chapter](https://purista.dev/tutorials/start-a-purista-project/)
to write the application yourself. To recover a checkpoint in a new directory,
run from the repository root:

```bash
node examples/banking/tutorial/replay.mjs --to first-command --out ../example-bank-checkpoint
```

Node >=24.15, npm, and network access to npm are required. You do not need to
install or build this monorepo. The replay uses published PURISTA packages and
the generated project's local CLI scripts. It refuses to overwrite a directory.

Available checkpoints are listed in `steps.json`. Each includes its preceding
steps, complete source edits, and the page teaching each edit. The script checks
that the code printed on each page is identical to its source file, then
typechecks, tests, and builds each checkpoint. Generated placeholder tests are
replaced as the corresponding behavior is implemented.

Maintainer checks:

```bash
node examples/banking/tutorial/replay.mjs --check-docs
node examples/banking/tutorial/replay.mjs --to first-command --out /tmp/example-bank-proof --verify-http
```

The second command also starts and stops the compiled application at each HTTP
checkpoint, checking its real localhost response. Port 3000 must be free.
It tests both the startup file and the in-process HTTP integration test.

The snapshots are excluded from the monorepo's TypeScript/test discovery:
they refer to files generated at replay time and are **not** independently
compilable modules. Their verification is the replay, not the demo's test suite.
Keep the generated project's package-lock.json when continuing your application.

## Maintenance contract

Change a snapshot and its documented file together. Add any new CLI generation
or package install to `steps.json` and print the same action on the relevant
page. Each new chapter must specify a working entry checkpoint, teach its
service/resource/runtime connections, and prove an end-to-end result plus its
main failure. A successful prose/source comparison alone does not establish
runtime correctness.

Current replay coverage: project creation, Hono setup, Banking service, first
HTTP command, repository resource wiring, transaction recording, and account
history. Use `--to list-transactions` for the completed transaction chapter.
Later chapters must be migrated and verified before they can be claimed as
replayable.
