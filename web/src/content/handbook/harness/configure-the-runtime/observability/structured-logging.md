---
title: Configure structured logging
description: Emit correlated JSON logs without copying prompts, secrets, or raw tool payloads into the log pipeline.
order: 292
---

`JsonLogger` writes one JSON record per line. Configure it once at instance
creation and use scoped handler loggers for application decisions.

```ts title="Structured Logging example 1"
import { defineHarness, JsonLogger } from '@purista/harness'
const definition = defineHarness({ name: 'support-agent' }).addAgent(answer)
const harness = await definition.getInstance({ logger: new JsonLogger({ level: 'info' }), models })
```
Use stable low-cardinality fields such as operation, route, and error code.
Keep prompts, completions, documents, credentials, headers, and arbitrary
exception bodies out of logs. A custom logger must preserve structured fields,
implement child bindings, and never throw into Harness execution.
