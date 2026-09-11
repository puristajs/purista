---
title: Set tool permissions
description: Separate agent tool selection, built-in permissions, application authorization, and sandbox enforcement.
order: 720
---

Tool selection is an agent definition allowlist. Built-in permissions are a
separate policy for mutating file or process tools. Application handlers still
authorize business actions, and the sandbox enforces filesystem/process scope.

```ts title="Tool Permissions example 1"
import { builtInTools, defineAgent } from '@purista/harness'

const agent = defineAgent('support', {
  model: 'answering',
  tools: [lookupAccount, builtInTools.read, builtInTools.write],
  instructions: 'Use the declared tools only for the authorized support task.',
  permissions: {
    write: { mode: 'require_approval', allow: ['/workspace/drafts/**'] },
  },
})
const definition = defineHarness({ name: 'support' }).addAgent(agent)
const harness = await definition.getInstance({
  models: { answering: answeringModel },
  sandbox,
})
```
Omitting a built-in definition disables it. `read` is non-mutating and has no
permission entry; `write`, `edit`, and `bash` support explicit permission
policies. Use the smallest tool list and fail closed on
unknown tools, paths, commands, credentials, or sandbox capabilities. Test a
denied operation and assert the handler or process did not run.
