# Maintain the tutorial by following it

Write the MDX lesson first. Explain the purpose, show the project-local CLI
command, then show the complete edited file with its exact path. Run the
construction verifier and correct the lesson when an instruction fails.
Do not hand-edit `chapters/` or `baselines/` and reverse-engineer matching prose.
Use `ROADMAP.md` for the reviewed capability owners, chapter sequence, and
bounded work packets for the remaining chapters.

Named `baselines` in the course recipe reuse only their listed construction
pages. For example, `--chapter authenticated-service` replays the CLI foundation
and the two Identity/Hono pages, then `--retain` saves their result beneath
`baselines/`. This is a complete independent starting project, not a dependency
on another chapter's running server. Baseline source and page hashes are checked
alongside chapter proofs. A shared-page change requires replaying its consumers.

From the repository root:

```sh
node examples/banking/tutorial/replay.mjs \
  --chapter command-transforms --out /tmp/my-new-bank-replay
```

The output directory must not already exist. The verifier constructs a fresh
`example-bank` there by following the prerequisite pages and chapter pages in
`course.json`. It uses published packages, so it needs registry access and a
supported Node/npm installation. Port 3000 must be available for the actual
documented requests. It must not be used for another application during replay.

The Markdown markers are deliberately simple:

- `title="src/example.ts" write`: replace this entire file in the learner project.
- `dockerfile` fences use the same full-file write marker for reproducible container builds.
- `sql` fences use that marker for the database schema shown to the reader.
- `replay="parent"`: execute the shown shell command in the new parent directory.
- `replay="project"`: execute it inside `example-bank`.
- `replay="server"`: start the shown server until this page's requests finish.
- `replay="request"`: execute the shown request against that server.
- `expect="json"`: compare the previous request response with the shown JSON.

Every fence needs a title. Ordinary explanatory fences have no execution marker.
Replay supplies `PURISTA_TUTORIAL_REPOSITORY` as the checkout's absolute path.
Lessons using shared, explicitly documented runtime snapshot archives must show
how a reader sets that variable; it is not permission to import finished
application implementations or undocumented dependencies into a checkpoint.
The verifier does not invent missing files, generated artifacts, configuration,
or test fixes. Unsupported instructions should fail rather than be silently
patched in the solution. Each advertised checkpoint runs its checks.

`course.json` also lists the reviewed capability service names. Replay rejects
an application-wide service such as `BankingService` and any unreviewed vague
replacement. Extend the catalog only when a chapter introduces a service with
one explicit capability owner. Starter reference services are listed separately
as scaffold names and must not receive application behavior.

After reviewing the successful result, use `--retain` during a fresh replay to
copy it into `chapters/<chapter>/`. Move the former result aside for review
first: the verifier refuses to overwrite it. Dependencies and build artifacts
are excluded; source, lockfile, relative CLI skill links, and the proof remain.
Runtime data under `var/` is also excluded from source provenance. Tests and
smoke requests can change a database file even when every source file is
identical.

```sh
npm run check:source --prefix examples/banking
npm test --prefix examples/banking
```

`check:source` only verifies the page and retained-source hashes. `npm test`
also copies every retained project outside the monorepo, installs its lockfile,
runs TypeScript and its test suite, builds, and starts the compiled application
for a loopback HTTP smoke test. Temporary test copies are removed afterward.
Neither command proves an unpublished chapter or a paid model's answer quality.

While one dependent branch is deliberately frozen, verify another chapter and
its prerequisites without changing the frozen proof:

```sh
node examples/banking/tutorial/replay.mjs --check --chapter command-transforms
```

The unfiltered `check:source` command remains required before merging the whole
course.

The website navigation uses content metadata; `course.json` lists construction
recipes, not a second navigation tree. Add a chapter only when its pages and
independent runtime are ready to replay. Keep optional lessons out of unrelated
chapters' required setup.

A work-in-progress recipe may have `status: "draft"` while its pages also remain
draft. It can be explicitly replayed, but is not counted as a retained, tested
application. Remove that status only after its required path succeeds. The
optional `environment` object records public runtime opt-ins used by the compiled
smoke check, such as `PURISTA_DEMO_LOGIN=1`; it must not contain credentials.
