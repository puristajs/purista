[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/sandbox](../README.md) / LimaSandboxDriverConfig

# Interface: LimaSandboxDriverConfig

Defined in: [sandbox-service/src/driver/LimaSandboxDriver/LimaSandboxDriver.ts:5](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/sandbox-service/src/driver/LimaSandboxDriver/LimaSandboxDriver.ts#L5)

## Properties

### cpus?

> `optional` **cpus**: `number`

Defined in: [sandbox-service/src/driver/LimaSandboxDriver/LimaSandboxDriver.ts:11](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/sandbox-service/src/driver/LimaSandboxDriver/LimaSandboxDriver.ts#L11)

CPU limit for the VM

***

### memory?

> `optional` **memory**: `string`

Defined in: [sandbox-service/src/driver/LimaSandboxDriver/LimaSandboxDriver.ts:9](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/sandbox-service/src/driver/LimaSandboxDriver/LimaSandboxDriver.ts#L9)

Memory limit for the VM

***

### template

> **template**: `string`

Defined in: [sandbox-service/src/driver/LimaSandboxDriver/LimaSandboxDriver.ts:7](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/sandbox-service/src/driver/LimaSandboxDriver/LimaSandboxDriver.ts#L7)

The name of the base Lima template to use (e.g. 'ubuntu-lts')

***

### useVz?

> `optional` **useVz**: `boolean`

Defined in: [sandbox-service/src/driver/LimaSandboxDriver/LimaSandboxDriver.ts:13](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/sandbox-service/src/driver/LimaSandboxDriver/LimaSandboxDriver.ts#L13)

Whether to use the native Apple Virtualization Framework (vz)
