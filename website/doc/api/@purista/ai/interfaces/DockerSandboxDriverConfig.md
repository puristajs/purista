[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / DockerSandboxDriverConfig

# Interface: DockerSandboxDriverConfig

Defined in: [packages/ai/src/sandbox/driver/DockerSandboxDriver/DockerSandboxDriver.ts:18](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/sandbox/driver/DockerSandboxDriver/DockerSandboxDriver.ts#L18)

Configuration for the DockerSandboxDriver.

## Properties

### cpus?

> `optional` **cpus**: `string`

Defined in: [packages/ai/src/sandbox/driver/DockerSandboxDriver/DockerSandboxDriver.ts:24](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/sandbox/driver/DockerSandboxDriver/DockerSandboxDriver.ts#L24)

CPU limit for the container (e.g. '1.0')

***

### imageName

> **imageName**: `string`

Defined in: [packages/ai/src/sandbox/driver/DockerSandboxDriver/DockerSandboxDriver.ts:20](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/sandbox/driver/DockerSandboxDriver/DockerSandboxDriver.ts#L20)

The name of the Docker image to use for the sandbox

***

### memory?

> `optional` **memory**: `string`

Defined in: [packages/ai/src/sandbox/driver/DockerSandboxDriver/DockerSandboxDriver.ts:22](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/sandbox/driver/DockerSandboxDriver/DockerSandboxDriver.ts#L22)

Memory limit for the container (e.g. '1g')

***

### networkDisabled?

> `optional` **networkDisabled**: `boolean`

Defined in: [packages/ai/src/sandbox/driver/DockerSandboxDriver/DockerSandboxDriver.ts:26](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/sandbox/driver/DockerSandboxDriver/DockerSandboxDriver.ts#L26)

Disable network access
