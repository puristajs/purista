---
title: Instructions and runtime context
description: Use instructions for behavior, not for caller authority or hidden infrastructure configuration.
order: 320
---

Instructions describe the model-facing job. They are not authentication,
authorization, tenant isolation, tool permission, or a substitute for output
validation.

```ts title="src/harness/supportInstructions.ts"
export const supportInstructions = [
  'Classify the case from the supplied summary.',
  'Return only the priority required by the output schema.',
].join('\n')
```

Pass `instructions: supportInstructions` to the agent definition in the same
composition module. This keeps the text testable and makes clear that only the
instructions—not a caller identity or secret—belong in this value.

Put trusted caller identity and application policy in the application boundary
or a typed workflow/tool handler. Do not interpolate credentials, full customer
records, or unreviewed retrieved text into generic instructions.

## Keep context bounded

| Context type | Safe owner |
| --- | --- |
| Stable model behavior | Agent instructions |
| Validated request fields | Agent input schema |
| Trusted caller scope | Application/session/workflow context |
| Retrieved documents | Application retrieval path with explicit policy controls |
| Persistent conversation/memory | Configured history or memory boundary |

Use a tool or workflow when context needs deterministic processing or access
control. The context/state and guardrail chapters own the detailed persistence
and sensitive-content paths.
