[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/cli](../README.md) / PuristaProjectServices

# Type Alias: PuristaProjectServices

> **PuristaProjectServices** = `Record`\<`string`, `Record`\<`string`, \{ `builderFile`: `string`; `commands`: `string`[]; `serviceFile`: `string`; `subscriptions`: `string`[]; \}\>\>

Defined in: [scanPuristaProject.ts:20](https://github.com/puristajs/purista/blob/d4f52fc34958022c6b9693e9270946d1111d759c/packages/cli/src/api/scanPuristaProject.ts#L20)

Information about a service.
It is a nested object.
The top level key is the service name, the value is a nested object, where the keys are the versions of the service.
[serviceName][serviceVersion] is an object that contains:
- `commands`: An array of strings representing the command names available for the service.
- `subscriptions`: An array of strings representing the subscription names available for the service.
- `builderFile`: The path to the builder file for the service.
- `serviceFile`: The path to the service file for the service.
