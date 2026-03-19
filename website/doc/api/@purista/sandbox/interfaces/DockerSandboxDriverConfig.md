[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/sandbox](../README.md) / DockerSandboxDriverConfig

# Interface: DockerSandboxDriverConfig

Defined in: [sandbox-service/src/driver/DockerSandboxDriver/DockerSandboxDriver.ts:16](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/sandbox-service/src/driver/DockerSandboxDriver/DockerSandboxDriver.ts#L16)

Configuration for the DockerSandboxDriver.

## Properties

### cpus?

> `optional` **cpus**: `string`

Defined in: [sandbox-service/src/driver/DockerSandboxDriver/DockerSandboxDriver.ts:22](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/sandbox-service/src/driver/DockerSandboxDriver/DockerSandboxDriver.ts#L22)

CPU limit for the container (e.g. '1.0')

***

### imageName

> **imageName**: `string`

Defined in: [sandbox-service/src/driver/DockerSandboxDriver/DockerSandboxDriver.ts:18](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/sandbox-service/src/driver/DockerSandboxDriver/DockerSandboxDriver.ts#L18)

The name of the Docker image to use for the sandbox

***

### memory?

> `optional` **memory**: `string`

Defined in: [sandbox-service/src/driver/DockerSandboxDriver/DockerSandboxDriver.ts:20](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/sandbox-service/src/driver/DockerSandboxDriver/DockerSandboxDriver.ts#L20)

Memory limit for the container (e.g. '1g')

***

### networkDisabled?

> `optional` **networkDisabled**: `boolean`

Defined in: [sandbox-service/src/driver/DockerSandboxDriver/DockerSandboxDriver.ts:24](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/sandbox-service/src/driver/DockerSandboxDriver/DockerSandboxDriver.ts#L24)

Disable network access
