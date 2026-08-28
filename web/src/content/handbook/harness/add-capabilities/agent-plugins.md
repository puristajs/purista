---
title: Load agent plugins
description: Review declarative skill and MCP packages before explicitly binding them to agents.
order: 440
---

Install the first-party loader when plugin packages are part of your delivery:

```sh title="Install Agent Plugin support"
npm install @purista/harness-agent-plugins
```

It is deliberately a data loader, not an executable plugin system. A plugin may
declare immediate child skills and modern MCP servers; it cannot add agents,
workflows, providers, credentials, sandbox authority, or runtime code.

By the end of this path, a reviewed local research plugin contributes one
explicitly named skill and, if selected, one MCP tool to a normal Harness
definition. Store the reviewed digest in deployment configuration or a reviewed
lockfile before this code runs—do not inspect a package and trust that same
unreviewed digest in production.

```ts title="src/loadReviewedResearchPlugin.ts"
import { inspectAgentPlugin, loadAgentPlugins } from '@purista/harness-agent-plugins'

export async function loadReviewedResearchPlugin(root: string, expectedDigest: string) {
  const inspection = await inspectAgentPlugin({ root })
  if (!inspection.valid || inspection.digest !== expectedDigest) {
    throw new Error('Plugin is invalid or differs from the reviewed digest.')
  }

  const [plugin] = await loadAgentPlugins({
    plugins: [{ root, trust: 'trusted', expectedDigest }],
  })
  if (!plugin) throw new Error('The reviewed plugin was not loadable.')

  const bindings = plugin.bindings({
    skills: { research_playbook: 'playbook' },
    tools: {
      search_knowledge: {
        server: 'knowledge',
        tool: 'search',
        description: 'Search approved product knowledge.',
        headers: { 'x-application': 'support' },
      },
    },
  })
  if (bindings.diagnostics.some((diagnostic) => diagnostic.level === 'error')) {
    throw new Error('The selected plugin bindings are invalid.')
  }

  return bindings
}
```

When you select an MCP tool, install `@modelcontextprotocol/client` as well and
bind the resulting `bindings.skills` and `bindings.tools` in your normal
`defineHarness()` composition. A plugin package never supplies an authorization
credential: replace the illustrative static header with application-owned,
non-secret routing metadata and configure credentials outside the plugin.

## Establish trust outside the plugin

The application supplies source identity, inspects load results, records a
reviewed SHA-256 digest, and binds each accepted skill or MCP tool explicitly.
There is no digest-free trusted-loading mode. Re-review and re-digest every
upgrade; reject malformed manifests and unexpected entries.

For remote MCP, bind non-secret static headers and credentials in application
configuration. Plugin-declared headers are validated but never sent. Remote
plugins require modern stateless Streamable HTTP; legacy stateful MCP and
HTTP+SSE are rejected.

Stdio plugins also require a spawn-capable sandbox with an immutable package
mount. The local host-directory sandbox cannot provide that guarantee, so it is
not a production isolation boundary. Use an isolating adapter, test a changed
digest and failed staging, and record the selected plugin version in your
deployment evidence.

Next: [orchestrate multi-step work](/handbook/harness/orchestrate-work/).
