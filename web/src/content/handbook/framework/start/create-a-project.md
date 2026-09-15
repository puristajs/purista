---
title: Create a project
description: Generate the incident-desk application and prove the untouched scaffold works.
order: 120
---

Create the project before adding business code. This step gives you a pinned
local CLI, one runnable `ping` service, an in-process EventBridge, and the
scripts used throughout the rest of the path.

## Generate the application

```bash title="Create the incident-desk project"
npm create purista@latest incident-desk
cd incident-desk
```

Choose **Node.js**, **npm**, and the **default EventBridge**. The default bridge
runs in one process and needs no external service. Keep the generated `ping`
service; it is a small working example and a useful startup check.

For CI or another repeatable setup, call the published CLI package and provide
every choice explicitly:

```bash title="Create the project without prompts"
npx --yes @purista/cli@latest init incident-desk \
  --runtime node \
  --event-bridge default \
  --package-manager npm \
  --non-interactive \
  --defaults
cd incident-desk
```

`npm create purista@latest` is the convenient interactive entry point.
`npx @purista/cli@latest init` exposes the same project generator for explicit
automation. After generation, use the project-local `npm run add:*` scripts so
the team uses the CLI version recorded by this project.

## Prove the untouched scaffold

```bash title="Verify the generated project"
npm test
npm run build
```

Both commands must pass before you edit a service. The tests validate the
generated `ping` command, while the build checks the complete TypeScript
project. If installation fails, check the Node.js requirement and package
manager first. If the build fails in a newly generated project, do not work
around it by weakening TypeScript or schema settings; retain the output and
report the generator/version combination.

## Keep the version boundary explicit

The generator records exact framework and CLI dependencies in `package.json`.
Commit both `package.json` and the package-manager lockfile. Run later
generation through the local scripts rather than a floating global binary.

Next: [create the first service](/handbook/framework/start/create-the-first-service/).
