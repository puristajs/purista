[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentAttachmentSource

# Type Alias: AgentAttachmentSource

> **AgentAttachmentSource** = \{ `kind`: `"url"`; `url`: `string`; \} \| \{ `data`: `string` \| `Uint8Array` \| `ArrayBuffer`; `kind`: `"data"`; \}

Defined in: [packages/ai/src/input/types.ts:8](https://github.com/puristajs/purista/blob/28d9337ab7fa6d33001a8b6c36fb84bb9236b736/packages/ai/src/input/types.ts#L8)

Raw attachment reference supplied by the application layer.

Keep storage/provider choices outside the framework. Applications may use
hosted URLs, inline test data, or any other source they can normalize into
this shape.
