---
title: Understand the project shape
description: Keep composition, application transport, and domain behavior separate from the first commit.
order: 70
---

A small application benefits from three explicit boundaries:

```text title="Minimal Harness project layout"
composition root → Harness definition → application route, worker, or CLI
```

| Area | Owns | Avoid putting here |
| --- | --- | --- |
| Composition root | Provider adapters, secrets, storage/sandbox wiring, defaults | HTTP request parsing or business approvals |
| Harness definition | Models, tools, agents, workflows, schemas | Raw provider SDK calls |
| Application transport | Caller identity, authorization, request/response mapping, shutdown | Model/provider configuration |

Keep one generated or handwritten `createHarness()` function that tests can
call with a fake provider. This preserves the same agent and schema behavior in
tests while production supplies real credentials and infrastructure adapters.

The maintained reference is `ai-harness/examples/quickstart/src/index.ts`. It
demonstrates a composition function, a live OpenAI path, and a deterministic
fake-provider test.

Next: [the Harness mental model](/handbook/harness/understand-the-harness/).
