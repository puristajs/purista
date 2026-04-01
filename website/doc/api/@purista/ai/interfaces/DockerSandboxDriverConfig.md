[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / DockerSandboxDriverConfig

# Interface: DockerSandboxDriverConfig

Defined in: [packages/ai/src/sandbox/driver/DockerSandboxDriver/DockerSandboxDriver.ts:16](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/sandbox/driver/DockerSandboxDriver/DockerSandboxDriver.ts#L16)

Configuration for the DockerSandboxDriver.

## Properties

### cpus?

> `optional` **cpus**: `string`

Defined in: [packages/ai/src/sandbox/driver/DockerSandboxDriver/DockerSandboxDriver.ts:22](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/sandbox/driver/DockerSandboxDriver/DockerSandboxDriver.ts#L22)

CPU limit for the container (e.g. '1.0')

***

### imageName

> **imageName**: `string`

Defined in: [packages/ai/src/sandbox/driver/DockerSandboxDriver/DockerSandboxDriver.ts:18](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/sandbox/driver/DockerSandboxDriver/DockerSandboxDriver.ts#L18)

The name of the Docker image to use for the sandbox

***

### memory?

> `optional` **memory**: `string`

Defined in: [packages/ai/src/sandbox/driver/DockerSandboxDriver/DockerSandboxDriver.ts:20](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/sandbox/driver/DockerSandboxDriver/DockerSandboxDriver.ts#L20)

Memory limit for the container (e.g. '1g')

***

### networkDisabled?

> `optional` **networkDisabled**: `boolean`

Defined in: [packages/ai/src/sandbox/driver/DockerSandboxDriver/DockerSandboxDriver.ts:24](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/sandbox/driver/DockerSandboxDriver/DockerSandboxDriver.ts#L24)

Disable network access
