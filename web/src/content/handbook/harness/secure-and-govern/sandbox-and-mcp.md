---
title: Choose sandbox and MCP boundaries
description: Keep sandbox capability selection, MCP transport, credentials, and isolation as separate decisions.
order: 730
---

A sandbox controls files, search, execution, spawning, and optional persistence.
MCP defines remote tools and transport. Neither authenticates the application
caller or authorizes a business action.

```ts title="Sandbox And Mcp example 1"
import { defineAgent, defineHarness, defineMcpServer } from '@purista/harness'
import { z } from 'zod'

const claimsServer = defineMcpServer('claims', {
  tools: {
    searchClaims: {
      remoteName: 'claims.search',
      description: 'Search claims visible to the current caller.',
      input: z.object({ query: z.string().min(1) }),
      output: z.object({ matches: z.array(z.string()) }),
    },
  },
})
const agent = defineAgent('claimsReview', {
  model: 'review',
  tools: [claimsServer.tools.searchClaims, readClaimEvidence],
  sandbox: 'private',
  instructions: 'Review the claim using only the declared evidence tools.',
})
const definition = defineHarness({ name: 'claims' }).addAgent(agent)
const harness = await definition.getInstance({
  models: { review: reviewModel },
  sandbox: { adapter: sandbox },
  mcp: {
    claims: { transport: 'http', url: process.env.CLAIMS_MCP_URL! },
  },
})
```
HTTP MCP needs authenticated application transport and timeout policy. Stdio
needs an isolating spawn-capable sandbox and immutable package mount. Test
redirects, malformed remote results, cancellation, credential isolation, and
cleanup. Package installation never grants sandbox or MCP authority.
