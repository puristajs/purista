# @purista/cli

`@purista/cli` is the canonical PURISTA CLI engine. It supports:

- interactive human usage
- non-interactive shell and CI execution
- programmatic access for scripts and agents
- local blueprint-driven project generation without cloning `starter`

Create a new project:

```bash
npx @purista/cli init
```

Or use the dedicated wrapper:

```bash
npm create purista@latest
```

Scaffold artifacts inside an existing PURISTA project:

```bash
purista add service user --description "User service"
purista add command sign-up --service user --service-version 1 --description "Register a user"
purista add queue process-jobs --service user --service-version 1 --description "Background jobs"
purista add agent triage --service user --service-version 1 --description "Review tickets"
```

Generated agents use the core-native PURISTA agent builders from `@purista/core`. Live model providers stay app-level dependencies; add provider packages such as `@purista/harness-openai` only when the generated application binds real models at runtime.

Non-interactive mode fails fast when a required value has no declared default:

```bash
purista add service user --description "User service" --non-interactive
purista init my-app --defaults --non-interactive
```

Programmatic usage:

```ts
import { runPuristaCommand } from '@purista/cli'

await runPuristaCommand(
  'add-service',
  { name: 'user', description: 'User service' },
  { cwd: process.cwd(), mode: 'programmatic' },
)
```

Project creation can also be planned and materialized directly:

```ts
import { planProjectGeneration, materializeProjectGeneration } from '@purista/cli'

const plan = planProjectGeneration({
  target: 'my-app',
  projectName: 'my-app',
  runtime: 'node',
  eventBridge: 'default',
  useWebserver: true,
  fileConvention: 'camel',
  eventConvention: 'dotCase',
  linter: 'biome',
  formatter: 'biome',
  packageManager: 'npm',
  installDependencies: false,
})

await materializeProjectGeneration(plan)
```

Generated tests import the public testing helpers from `@purista/core`:

- `createCommandContextMock(...)` for command handler tests
- `createSubscriptionContextMock(...)` for subscription handler tests
- `createStreamTestHarness(...)` for runtime stream tests
- `createQueueWorkerTestHarness(...)` for runtime queue worker tests
- `createAgentTestHarness(...)` and `createScriptedHarnessModel(...)` for agent runtime tests

**Visit [purista.dev](https://purista.dev)**

**Follow on Twitter [@purista_js](https://twitter.com/purista_js)**  
**Join the [Discord Chat](https://discord.gg/9feaUm3H2v)**

<a href="https://www.producthunt.com/posts/purista?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-purista" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=386519&theme=light" alt="PURISTA - Typescript&#0032;framework&#0032;for&#0032;IoT&#0044;&#0032;microservices&#0044;&#0032;and&#0032;serverless | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>
