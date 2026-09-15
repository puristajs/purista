---
title: Capabilities and extension points
description: Choose the smallest extension boundary that gives an agent the capability it needs.
order: 140
---

The Harness has distinct extension mechanisms. Pick the one matching the
ownership and trust boundary; they are not interchangeable names for a plugin.

| Mechanism | Best for | Owner |
| --- | --- | --- |
| TypeScript tool | One typed application operation | Application |
| Skill | Reusable instruction files and supporting resources | Application or reviewed package |
| MCP tool | Capability supplied by an external tool server | Application plus MCP server |
| Agent Plugin | Reviewed data-only bundle of selected skills/MCP bindings | Application review process |
| Adapter/provider | Infrastructure implementation behind a public Harness port | Application/platform team |

Tools, skills, MCP, and Agent Plugins are introduced in the **Add capabilities**
chapter. Model providers, memory engines, sandboxes, storage, and workspaces
belong to the composition root and have distinct operational choices.

Never grant authority because a tool description, skill instruction, or plugin
manifest asks for it. Authentication, authorization, tenant isolation, secrets,
and domain side effects remain application responsibilities.
