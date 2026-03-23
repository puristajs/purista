[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / DockerSandboxDriverConfig

# Interface: DockerSandboxDriverConfig

Defined in: packages/ai/src/sandbox/driver/DockerSandboxDriver/DockerSandboxDriver.ts:16

Configuration for the DockerSandboxDriver.

## Properties

### cpus?

> `optional` **cpus**: `string`

Defined in: packages/ai/src/sandbox/driver/DockerSandboxDriver/DockerSandboxDriver.ts:22

CPU limit for the container (e.g. '1.0')

***

### imageName

> **imageName**: `string`

Defined in: packages/ai/src/sandbox/driver/DockerSandboxDriver/DockerSandboxDriver.ts:18

The name of the Docker image to use for the sandbox

***

### memory?

> `optional` **memory**: `string`

Defined in: packages/ai/src/sandbox/driver/DockerSandboxDriver/DockerSandboxDriver.ts:20

Memory limit for the container (e.g. '1g')

***

### networkDisabled?

> `optional` **networkDisabled**: `boolean`

Defined in: packages/ai/src/sandbox/driver/DockerSandboxDriver/DockerSandboxDriver.ts:24

Disable network access
