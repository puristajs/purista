# CLI, Starter, And Scaffolding

Use this reference when creating or aligning application skeletons.

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
  --type module \
  --package-manager npm \
  --non-interactive \
  --defaults \
  --no-install

purista add service <name> --description "<description>"
purista add command <name> --service <serviceName> --service-version <version>
purista add subscription <name> --service <serviceName> --service-version <version> --event <eventName>
purista add stream <name> --service <serviceName> --service-version <version>
purista add queue <name> --service <serviceName> --service-version <version>
purista add queue-worker <name> --service <serviceName> --service-version <version> --queue <queueName>
purista add agent <name> --service <serviceName> --service-version <version>
purista export schedule-manifest --out schedules.json
purista export kubernetes-cronjob --out kubernetes-cronjobs.json --trigger-image curlimages/curl:8.8.0 --trigger-url 'https://api.example.com/purista/schedules/{{targetKind}}/{{targetName}}'
```

Use create-package-manager commands for the quickstart path. Use `purista init <target>` when an agent, CI job, or script should call the same blueprint engine directly.

Use `--non-interactive` in automation when all required values are known. Combine it with `--defaults` to apply explicit CLI defaults and `--no-install` when the caller owns dependency installation.

Supported init choices are:
- `runtime`: `node` or `bun`
- `eventBridge`: `default`, `amqp`, `mqtt`, `nats`, or `dapr`
- `useWebserver`: generate the Hono HTTP surface and `public/`
- `linter`: `biome`, `eslint`, or `none`
- `formatter`: `biome`, `prettier`, or `none`
- `type`: `module` or `commonjs`
- `packageManager`: `npm`, `bun`, `pnpm`, or `yarn`

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

The initialized app contains the runtime/bootstrap files, `purista.json`, and a minimal `ping` service with one command. HTTP-enabled projects also include `src/http.ts` and `public/`. Additional commands, subscriptions, streams, queues, queue workers, and agents should be generated with `purista add ...` so imports, service definition arrays, tests, and exports stay aligned.

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
  `createAgentTestHarness(...)`, and avoid direct app dependencies on
  `@purista/harness`.

## Review Cues
- CLI generated tests compile against current APIs.
- Generated agents use core agent testing helpers.
- Generated apps do not install provider packages unless provider wiring is generated.
- Schedule exports do not target subscriptions directly; event targets trigger subscriptions indirectly.
- Binary files and compiled CLI output are rebuilt when source templates change.
