---
title: Preserve message and service contracts
description: Evolve versioned services without breaking callers, subscribers, or messages waiting in a broker.
order: 1140
---

Messages can be processed after the producer has deployed, so a compiled monorepo is not proof of compatibility. Prefer additive schema changes. For a removal, rename, or changed meaning, publish a new service version and keep the previous contract available for the consumers and retained messages that still need it.

## Evolve the invoice-created fact safely

Adding an optional `dueDate` to `invoice.created` can be compatible when old
consumers ignore it and new consumers handle its absence. Changing `amount`
from minor units to a formatted currency string is breaking even if both values
are strings/numbers: the meaning changed. Publish a new event/service version
and translate at a boundary until consumers and retained messages have drained.

| Change | Usually compatible? | Safe release shape |
| --- | --- | --- |
| Add optional field with documented default/absence | Yes | Producer first, then consumers that use it |
| Add required field | No for existing producers/callers | New contract version or temporary compatibility input |
| Remove/rename a field | No | Dual-read/translate; retire only after evidence |
| Change validation limit or business meaning | Usually no | New version and explicit migration/communication |
| Add an enum value | Only if every consumer tolerates unknown values | Test old consumers before producer rollout |

For every change, answer:

- Which HTTP clients, command callers, and event subscribers consume this schema?
- How long can messages remain in queues, DLQs, or broker retention?
- Can the new handler understand old messages, or is a transformer/versioned handler required?
- What observable signal proves old and new consumers have drained?

Do not silently reuse a command or event name for an incompatible payload. Mark exposed behavior as deprecated where applicable, communicate an end date, and remove it only after consumer evidence and retained-message policy permit it.

See [messages and contracts](/handbook/framework/understand-the-framework/messages-schemas-and-contracts/) and [recovery and replay](/handbook/framework/secure-and-operate/reliability/recovery-and-replay/).
