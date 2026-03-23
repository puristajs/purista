[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / TartSandboxDriverConfig

# Interface: TartSandboxDriverConfig

Defined in: [packages/ai/src/sandbox/driver/TartSandboxDriver/TartSandboxDriver.ts:8](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/sandbox/driver/TartSandboxDriver/TartSandboxDriver.ts#L8)

## Properties

### baseImage

> **baseImage**: `string`

Defined in: [packages/ai/src/sandbox/driver/TartSandboxDriver/TartSandboxDriver.ts:10](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/sandbox/driver/TartSandboxDriver/TartSandboxDriver.ts#L10)

The name of the base Tart image to clone (e.g. 'ghcr.io/cirruslabs/ubuntu:latest')

***

### cpus?

> `optional` **cpus**: `number`

Defined in: [packages/ai/src/sandbox/driver/TartSandboxDriver/TartSandboxDriver.ts:14](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/sandbox/driver/TartSandboxDriver/TartSandboxDriver.ts#L14)

CPU limit for the VM

***

### display?

> `optional` **display**: `"none"` \| `"gui"`

Defined in: [packages/ai/src/sandbox/driver/TartSandboxDriver/TartSandboxDriver.ts:16](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/sandbox/driver/TartSandboxDriver/TartSandboxDriver.ts#L16)

Display type: 'none' (default for headless) or 'gui'

***

### memory?

> `optional` **memory**: `number`

Defined in: [packages/ai/src/sandbox/driver/TartSandboxDriver/TartSandboxDriver.ts:12](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/sandbox/driver/TartSandboxDriver/TartSandboxDriver.ts#L12)

Memory limit for the VM (in MB)
