[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / exportKubernetesCronJobs

# Function: exportKubernetesCronJobs()

> **exportKubernetesCronJobs**(`options`): `Promise`\<[`KubernetesCronJobManifest`](../type-aliases/KubernetesCronJobManifest.md)[]\>

Defined in: [helper/enterpriseInterop.ts:628](https://github.com/puristajs/purista/blob/master/packages/core/src/helper/enterpriseInterop.ts#L628)

Export cron-based PURISTA schedule metadata as Kubernetes `batch/v1`
`CronJob` manifest objects.

The exporter is a pure JSON manifest generator. It requires the caller to
supply the trigger container image and command/args or HTTP request template;
it never invents URLs, images, credentials, namespaces, service accounts, or
cluster policy.

## Parameters

### options

[`ExportKubernetesCronJobsOptions`](../type-aliases/ExportKubernetesCronJobsOptions.md)

## Returns

`Promise`\<[`KubernetesCronJobManifest`](../type-aliases/KubernetesCronJobManifest.md)[]\>

## Example

```ts
const cronJobs = await exportKubernetesCronJobs({
  services: exportedDefinitions,
  trigger: {
    image: 'registry.example.com/purista-trigger:1.0.0',
    command: ['/app/trigger'],
    args: ['--kind', '{{targetKind}}', '--target', '{{targetName}}'],
  },
})
```
