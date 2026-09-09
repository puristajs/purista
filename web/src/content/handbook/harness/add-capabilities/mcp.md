---
title: Connect an MCP server
description: Declare remote MCP tools separately from the transport and sandbox that run them.
order: 430
---

`defineMcpServer` records schemas and remote tool names. It does not open a
connection or grant credentials. Bind HTTP or stdio transport at
`getInstance(...)`; stdio requires an isolating sandbox with process spawning.

```ts title="src/harness/supportKnowledge.ts"
import { defineAgent, defineHarness, defineMcpServer } from '@purista/harness'
import { z } from 'zod'

const knowledge = defineMcpServer('knowledge', {
  tools: {
    search: {
      remoteName: 'search',
      description: 'Search approved support material.',
      input: z.object({ query: z.string().min(1) }),
      output: z.object({ matches: z.array(z.string()) }),
    },
  },
})
const support = defineAgent('support', {
  model: 'primary',
  tools: [knowledge.tools.search],
  instructions: 'Use the approved knowledge search when needed.',
})
export const definition = defineHarness({ name: 'support' }).addAgent(support)
```
The application supplies endpoint, authentication, timeouts, cleanup, and
sandbox policy. Test unavailable servers, malformed remote results,
cancellation, and unauthorized data access.
