---
title: Obtain, export, and load service definitions
description: Produce a reviewed service-definition artifact and load it as the source for generated clients.
order: 441
---

Client generation starts from resolved PURISTA service definitions. Export the
same builders used by the provider so command addresses and schemas do not drift.

```ts title="tools/export-service-definitions.ts"
import { writeFile } from 'node:fs/promises'
import { exportServiceDefinitions } from '@purista/core'
import { transactionV1Service } from '../src/service/transaction/v1/transactionV1Service.js'

const definitions = await exportServiceDefinitions([transactionV1Service])
await writeFile(
  'definitions/transaction.json',
  `${JSON.stringify(definitions, null, 2)}\n`,
)
```

The artifact contains public service metadata and schemas. It must not contain
runtime credentials, database configuration, or tenant data. Publish/version it
with the provider contract when consumers live in another repository.

Load all definition files through `ClientBuilder`:

```ts title="tools/load-client-definitions.ts"
import { ClientBuilder } from '@purista/core'

const errors: Error[] = []
const builder = new ClientBuilder({
  definitionPath: './definitions',
  outputPath: './packages/transaction-client',
})

builder.on('error', error => {
  errors.push(error instanceof Error ? error : new Error(String(error)))
})

try {
  const definitions = await builder.loadDefinitionFiles()
  if (errors.length) throw new AggregateError(errors, 'Invalid service definition files')
  // Pass `definitions` to one or both client generators.
} finally {
  builder.destroy()
}
```

`loadDefinitionFiles()` rejects when the directory is missing. An invalid
individual JSON file emits `error` and is skipped, so a CI generator must turn
emitted errors into a failed build. Loading definitions does not contact a
service or prove that the deployed provider matches the artifact.

Inside one controlled monorepo,
`getDefinitionsFromServiceBuilders([transactionV1Service])` can avoid the JSON
round trip. Use the exported artifact when independent releases need an
auditable compatibility boundary.

Next: [choose a client boundary](/handbook/framework/expose-and-consume-services/service-clients/choose-a-client-boundary/).
