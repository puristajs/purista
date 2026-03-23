[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / TartSandboxDriverConfig

# Interface: TartSandboxDriverConfig

Defined in: packages/ai/src/sandbox/driver/TartSandboxDriver/TartSandboxDriver.ts:8

## Properties

### baseImage

> **baseImage**: `string`

Defined in: packages/ai/src/sandbox/driver/TartSandboxDriver/TartSandboxDriver.ts:10

The name of the base Tart image to clone (e.g. 'ghcr.io/cirruslabs/ubuntu:latest')

***

### cpus?

> `optional` **cpus**: `number`

Defined in: packages/ai/src/sandbox/driver/TartSandboxDriver/TartSandboxDriver.ts:14

CPU limit for the VM

***

### display?

> `optional` **display**: `"none"` \| `"gui"`

Defined in: packages/ai/src/sandbox/driver/TartSandboxDriver/TartSandboxDriver.ts:16

Display type: 'none' (default for headless) or 'gui'

***

### memory?

> `optional` **memory**: `number`

Defined in: packages/ai/src/sandbox/driver/TartSandboxDriver/TartSandboxDriver.ts:12

Memory limit for the VM (in MB)
