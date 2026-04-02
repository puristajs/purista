[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / LimaSandboxDriverConfig

# Interface: LimaSandboxDriverConfig

Defined in: [packages/ai/src/sandbox/driver/LimaSandboxDriver/LimaSandboxDriver.ts:5](https://github.com/puristajs/purista/blob/28d9337ab7fa6d33001a8b6c36fb84bb9236b736/packages/ai/src/sandbox/driver/LimaSandboxDriver/LimaSandboxDriver.ts#L5)

## Properties

### cpus?

> `optional` **cpus**: `number`

Defined in: [packages/ai/src/sandbox/driver/LimaSandboxDriver/LimaSandboxDriver.ts:11](https://github.com/puristajs/purista/blob/28d9337ab7fa6d33001a8b6c36fb84bb9236b736/packages/ai/src/sandbox/driver/LimaSandboxDriver/LimaSandboxDriver.ts#L11)

CPU limit for the VM

***

### memory?

> `optional` **memory**: `string`

Defined in: [packages/ai/src/sandbox/driver/LimaSandboxDriver/LimaSandboxDriver.ts:9](https://github.com/puristajs/purista/blob/28d9337ab7fa6d33001a8b6c36fb84bb9236b736/packages/ai/src/sandbox/driver/LimaSandboxDriver/LimaSandboxDriver.ts#L9)

Memory limit for the VM

***

### template

> **template**: `string`

Defined in: [packages/ai/src/sandbox/driver/LimaSandboxDriver/LimaSandboxDriver.ts:7](https://github.com/puristajs/purista/blob/28d9337ab7fa6d33001a8b6c36fb84bb9236b736/packages/ai/src/sandbox/driver/LimaSandboxDriver/LimaSandboxDriver.ts#L7)

The name of the base Lima template to use (e.g. 'ubuntu-lts')

***

### useVz?

> `optional` **useVz**: `boolean`

Defined in: [packages/ai/src/sandbox/driver/LimaSandboxDriver/LimaSandboxDriver.ts:13](https://github.com/puristajs/purista/blob/28d9337ab7fa6d33001a8b6c36fb84bb9236b736/packages/ai/src/sandbox/driver/LimaSandboxDriver/LimaSandboxDriver.ts#L13)

Whether to use the native Apple Virtualization Framework (vz)
