# CLI, Starter, And Scaffolding

Use this reference when creating or aligning application skeletons.

## Contents
- [CLI First](#cli-first)
- [Agentic Scaffolding Flow](#agentic-scaffolding-flow)
- [Generated Shape](#generated-shape)
- [Starter And create-purista](#starter-and-create-purista)
- [Examples](#examples)
- [Review Cues](#review-cues)

## CLI First
For application-level artifacts, prefer the CLI:

```bash
npm create purista@latest
bun create purista@latest
yarn create purista@latest
pnpm create purista@latest

purista init my-app
purista init my-app \
  --runtime node \
  --event-bridge default \
  --webserver \
  --linter biome \
  --formatter biome \
  --package-manager npm \
  --non-interactive \
  --defaults \
  --no-install

npm run add:service -- <name> --description "<description>"
npm run add:command -- <name> --service <serviceName> --service-version <version>
npm run add:subscription -- <name> --service <serviceName> --service-version <version> --event <eventName>
npm run add:stream -- <name> --service <serviceName> --service-version <version>
npm run add:queue -- <name> --service <serviceName> --service-version <version>
npm run add:queue-worker -- <name> --service <serviceName> --service-version <version> --queue <queueName>
npm run add:agent -- <name> --service <serviceName> --service-version <version>
purista export schedule-manifest --out schedules.json
purista export kubernetes-cronjob --out kubernetes-cronjobs.json --trigger-image curlimages/curl:8.8.0 --trigger-url 'https://api.example.com/purista/schedules/{{targetKind}}/{{targetName}}'
```

Use create-package-manager commands for the quickstart path. Use `purista init <target>` when an agent, CI job, or script should call the same blueprint engine directly.

Use `--non-interactive` in automation when all required values are known. Combine it with `--defaults` to apply explicit CLI defaults and `--no-install` when the caller owns dependency installation.

Generated projects install `@purista/cli` as a dev dependency and expose local package scripts for artifact creation. After project dependencies are installed, prefer those scripts over a global `purista` binary:

```bash
npm run add:service -- user --description "User management"
npm run add:command -- sign-up --service user --service-version 1
npm run add:subscription -- welcome-email --service email --service-version 1 --event user.created
npm run add:stream -- search --service catalog --service-version 1
npm run add:queue -- invoice-processing --service billing --service-version 1
npm run add:queue-worker -- invoice-processor --service billing --service-version 1 --queue invoiceProcessing
npm run add:agent -- triage --service support --service-version 1
```

Use the matching package manager and runtime:
- npm: `npm run add:service -- ...`
- pnpm: `pnpm run add:service -- ...`
- yarn: `yarn add:service ...`
- bun: `bun run add:service -- ...`

For runtime commands, follow generated scripts: Node.js projects use the selected Node package manager (`npm run dev`, `pnpm run dev`, or `yarn dev`); Bun projects use `bun run dev`.

Supported init choices are:
- `runtime`: `node` or `bun`
- `eventBridge`: `default`, `amqp`, `mqtt`, `nats`, or `dapr`
- `useWebserver`: generate the Hono HTTP surface and `public/`
- `linter`: `biome`, `eslint`, or `none`
- `formatter`: `biome`, `prettier`, or `none`
- `packageManager`: `npm`, `bun`, `pnpm`, or `yarn`

Generated PURISTA projects are ESM-only and always use `"type": "module"`.

## Agentic Scaffolding Flow
When an AI agent is creating a new PURISTA app, it should keep the workflow deterministic:
1. Initialize the project with explicit `purista init <target> ... --non-interactive --defaults --no-install` choices.
2. Add the first service and request/response command.
3. Add streams only for progressive or live outbound responses.
4. Add queues and queue workers for durable, retryable, delayed, or dead-lettered work.
5. Add agents only when model reasoning, tool use, or conversation orchestration belongs to a service.
6. Install provider packages such as `@purista/harness-openai` only in the application that wires a real provider.

Do not move or hand-create CLI-managed files unless `purista.json` is updated and the project scanner still recognizes the result.

## Generated Shape
Generated code should:
- keep versioned service folders
- keep `src/service` as the default service root
- keep `src/agents` as the default agent root
- keep schemas beside their command/subscription/stream/queue/agent boundary
- import service builders rather than duplicating service setup
- update service definitions automatically
- avoid adding provider dependencies unless provider wiring is explicitly generated

The initialized app contains the runtime/bootstrap files, `purista.json`, and a minimal `ping` service with one command. HTTP-enabled projects also include `src/http.ts` and `public/`. Additional commands, subscriptions, streams, queues, queue workers, and agents should be generated with the local `add:*` package scripts so imports, service definition arrays, tests, and exports stay aligned.

Expected project layout:

```text
<project>/
  public/                              # only when Hono HTTP support is enabled
  src/
    config/                            # generated bridge/http config when selected blueprints need it
    agents/                            # default root for app-level agent support files
    service/
      serviceEvent.enum.ts             # shared generated service event enum
      <serviceName>/
        general<ServiceName>ServiceInfo.ts
        v<version>/
          <serviceName>ServiceConfig.ts
          <serviceName>V<version>ServiceBuilder.ts
          <serviceName>V<version>Service.ts
          <serviceName>V<version>Service.test.ts
          command/
            <commandName>/
              schema.ts
              types.ts
              <commandName>CommandBuilder.ts
              <commandName>CommandBuilder.test.ts
          subscription/
            <subscriptionName>/
              schema.ts
              types.ts
              <subscriptionName>SubscriptionBuilder.ts
              <subscriptionName>SubscriptionBuilder.test.ts
          stream/
            <streamName>/
              schema.ts
              types.ts
              <streamName>StreamBuilder.ts
              <streamName>StreamBuilder.test.ts
          queue/
            <queueName>/
              schema.ts
              types.ts
              <queueName>QueueBuilder.ts
              <queueName>QueueBuilder.test.ts
          queue-worker/
            <workerName>/
              <workerName>QueueWorkerBuilder.ts
              <workerName>QueueWorkerBuilder.test.ts
          agent/
            <agentName>/
              schema.ts
              types.ts
              <agentName>Agent.ts
              <agentName>Agent.test.ts
    eventbridge.ts                     # generated from selected event bridge blueprint
    http.ts                            # only when Hono HTTP support is enabled
    index.ts
  purista.json
  package.json
  tsconfig.json
```

File and folder names follow `fileConvention`; event values follow `eventConvention`. Do not infer casing manually from examples. Read `purista.json`, then let the CLI create artifacts or use the CLI casing helpers when package code must generate paths.

Artifact placement rules:
- service metadata lives in `general<ServiceName>ServiceInfo.ts`
- version-specific service composition lives in `v<version>/<serviceName>V<version>Service.ts`
- version-specific service builder setup lives in `v<version>/<serviceName>V<version>ServiceBuilder.ts`
- schemas and inferred types stay beside the command, subscription, stream, queue, or agent that owns the boundary
- queue workers live under `queue-worker/`, not inside the queue folder
- agents generated by local `add:agent` scripts are attached to the owning service under `service/<service>/v<version>/agent/<agent>/`
- runtime wiring stays in `src/index.ts`, `src/eventbridge.ts`, `src/http.ts`, `src/config/`, or app-specific bootstrap files, not in boundary builders

## Starter And create-purista
- `starter` must remain AI-free by default.
- `create-purista` should initialize projects through CLI blueprint behavior.
- Defaults should align with current Hono/EventBridge/QueueBridge decisions.
- Starter may include disabled-by-default schedule contracts and export scripts, but must not assume a scheduler, broker, cluster, URL, auth policy, or provider account exists.
- Kubernetes CronJob export scripts must use explicit placeholder trigger configuration that users replace before applying manifests.
- When framework behavior changes, update `purista` first, then starter/create-purista.

## Examples
- `purista/examples/agent-example` is the canonical lightweight example for
  core-native agents. It must stay provider-neutral, use
  `createAgentTestHarness(...)`, use `createAgentSkillTestRuntime(...)` for
  skill-backed tests, and avoid direct app dependencies on `@purista/harness`.

## Review Cues
- CLI generated tests compile against current APIs.
- Generated agents use core agent testing helpers.
- Generated apps do not install provider packages unless provider wiring is generated.
- Schedule exports do not target subscriptions directly; event targets trigger subscriptions indirectly.
- Binary files and compiled CLI output are rebuilt when source templates change.
