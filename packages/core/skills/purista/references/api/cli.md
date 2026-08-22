# @purista/cli API Patterns

<!-- Generated from current TypeDoc; do not edit manually. -->
<!-- typedoc-digest: 527f17db6c2c34eb -->

Use this reference only when working with `@purista/cli`. Every API name, callable pattern, and example below is extracted from the current public TypeDoc output. Do not invent a method that is absent here; consult the complete `../generated-api-manifest.json` and the public handbook when the API is not listed.

## Contents

- [createPuristaCliEngine](#createpuristacliengine)
- [runPuristaCommand](#runpuristacommand)

## createPuristaCliEngine

**function.** Create a programmatic CLI engine bound to a working directory and prompt adapter. Source: `packages/cli/src/engine.ts:48`.

**Verified example**

```ts
const cli = createPuristaCliEngine({ cwd: '/workspace/my-app' })
await cli.runPuristaCommand('add-command', {
  serviceName: 'user',
  serviceVersion: '1',
  commandName: 'create user',
  commandDescription: 'Create a user account',
})
```

## runPuristaCommand

**function.** Resolve and execute a CLI command in one call. Source: `packages/cli/src/engine.ts:149`.

**Verified example**

```ts
await runPuristaCommand('add-service', {
  serviceName: 'billing',
  serviceDescription: 'Owns billing workflows',
})
```

