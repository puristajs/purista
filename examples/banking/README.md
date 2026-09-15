# Learn PURISTA with Example Bank

The website tutorial is the source of the construction steps. We follow its
CLI commands and file edits to build each application in `chapters/`.

Example Bank is the application and UI name. It is not a PURISTA service. The
course introduces narrow services when a Framework capability needs them:
`BankProfile`, `Identity`, `Transaction`, `Monitoring`, `Analysis`, `Reporting`,
`Support`, and `Knowledge`. Application startup composes those services with
Framework adapters and infrastructure resources.

The synthetic banking scenario gives every capability a small, visible use
case. It is not payment, accounting, or compliance software. Remaining planned
chapters are not represented as working examples.

The construction verifier in `tutorial/replay.mjs` reads the actual MDX pages.
It executes marked shell blocks in order, writes the documented complete files,
runs the documented tests/builds, and checks the shown HTTP responses.
It never reads `chapters/` to fill missing implementation steps.

Each completed chapter directory contains its full consumer source and npm
lockfile. Its own README explains installation, tests, startup and limitations.
No monorepo build or paid model is required for the published introductory
chapters. Every retained chapter installs released PURISTA packages from the
npm registry and keeps a portable npm lockfile.

See [construction and maintenance](tutorial/README.md) for replay commands and
[verified scope](tutorial/VERIFICATION.md) for the completed lessons and limits.
