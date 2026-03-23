[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / sandboxServiceBuilder

# Variable: sandboxServiceBuilder

> `const` **sandboxServiceBuilder**: [`ServiceBuilder`](../../core/classes/ServiceBuilder.md)\<[`SetNewTypeValue`](../../core/type-aliases/SetNewTypeValue.md)\<[`SetNewTypeValue`](../../core/type-aliases/SetNewTypeValue.md)\<[`SetNewTypeValues`](../../core/type-aliases/SetNewTypeValues.md)\<[`SetNewTypeValue`](../../core/type-aliases/SetNewTypeValue.md)\<[`ServiceBuilderTypes`](../../core/type-aliases/ServiceBuilderTypes.md), `"ServiceClassType"`, [`SandboxService`](../classes/SandboxService.md)\>, \{ `ConfigInputType`: \{ `driver?`: [`SandboxDriver`](../interfaces/SandboxDriver.md); \}; `ConfigType`: \{ `driver?`: [`SandboxDriver`](../interfaces/SandboxDriver.md); \}; `ServiceClassType`: [`Service`](../../core/classes/Service.md)\<[`ServiceClassTypes`](../../core/type-aliases/ServiceClassTypes.md)\<\{ `driver?`: [`SandboxDriver`](../interfaces/SandboxDriver.md); \}, [`EmptyObject`](../../core/type-aliases/EmptyObject.md)\>\>; \}\>, `"Resources"`, \{ `driver`: [`SandboxDriver`](../interfaces/SandboxDriver.md); \}\>, `"Resources"`, `object` & `object`\>\>

Defined in: [packages/ai/src/sandbox/service/Sandbox/v1/SandboxServiceBuilder.ts:17](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/sandbox/service/Sandbox/v1/SandboxServiceBuilder.ts#L17)

sandboxServiceBuilder

The main builder for the Sandbox Service. This service manages the lifecycle
and execution of multi-tenant sandboxes.

Resources:
- `driver`: The virtualization engine (Docker, Lima, etc.)
- `registry`: The persistence layer for sandbox metadata
