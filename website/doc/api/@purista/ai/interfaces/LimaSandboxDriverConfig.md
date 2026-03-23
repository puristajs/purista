[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / LimaSandboxDriverConfig

# Interface: LimaSandboxDriverConfig

Defined in: packages/ai/src/sandbox/driver/LimaSandboxDriver/LimaSandboxDriver.ts:5

## Properties

### cpus?

> `optional` **cpus**: `number`

Defined in: packages/ai/src/sandbox/driver/LimaSandboxDriver/LimaSandboxDriver.ts:11

CPU limit for the VM

***

### memory?

> `optional` **memory**: `string`

Defined in: packages/ai/src/sandbox/driver/LimaSandboxDriver/LimaSandboxDriver.ts:9

Memory limit for the VM

***

### template

> **template**: `string`

Defined in: packages/ai/src/sandbox/driver/LimaSandboxDriver/LimaSandboxDriver.ts:7

The name of the base Lima template to use (e.g. 'ubuntu-lts')

***

### useVz?

> `optional` **useVz**: `boolean`

Defined in: packages/ai/src/sandbox/driver/LimaSandboxDriver/LimaSandboxDriver.ts:13

Whether to use the native Apple Virtualization Framework (vz)
