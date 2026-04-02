[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentAttachmentSource

# Type Alias: AgentAttachmentSource

> **AgentAttachmentSource** = \{ `kind`: `"url"`; `url`: `string`; \} \| \{ `data`: `string` \| `Uint8Array` \| `ArrayBuffer`; `kind`: `"data"`; \}

Defined in: [packages/ai/src/input/types.ts:8](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/input/types.ts#L8)

Raw attachment reference supplied by the application layer.

Keep storage/provider choices outside the framework. Applications may use
hosted URLs, inline test data, or any other source they can normalize into
this shape.
