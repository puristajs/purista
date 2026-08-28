---
title: Add capabilities
description: Give each agent only the tools, methods, and integrations needed for one job.
order: 400
---

Capabilities are explicit. An agent receives no TypeScript tool, mounted skill,
MCP server, or plugin simply because it exists in the application. Start with a
typed tool; add the other options when their boundary fits the job.

| Need | Choose | Main boundary |
| --- | --- | --- |
| Run a business operation | [Tools](/handbook/harness/add-capabilities/tools/) | Your handler validates and authorizes every call. |
| Supply a reviewed method or reference files | [Skills](/handbook/harness/add-capabilities/skills/) | Files are mounted; the agent must read them. |
| Call a separately operated tool server | [MCP](/handbook/harness/add-capabilities/mcp/) | Server, transport, credentials, and sandbox policy. |
| Consume a reviewed package of skills and MCP declarations | [Agent plugins](/handbook/harness/add-capabilities/agent-plugins/) | Application trust, digest, and explicit bindings. |

Keep the allowlist next to the agent definition. Models can suggest an action;
only application code decides whether the principal may perform it.

## Before enabling a capability

- Disable built-ins with `builtinTools: false` and re-add only what is needed.
- Pass a principal or tenant context to the handler; never rely on an instruction
  to enforce authorization.
- Define small input and output schemas and return safe domain errors.
- Test denial, timeout, cancellation, malformed input, and retry behavior.

Next: [create a typed tool](/handbook/harness/add-capabilities/tools/).
