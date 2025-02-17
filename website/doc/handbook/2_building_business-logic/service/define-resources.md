---
title: Define Resources
description: Define resources which are available in commands and subscriptions of a service.
order: 201025
---

# Define Resources

As a service acts as container for comands and subscriptions, it is possible to define resources that can be used by these commands and subscriptions. This allows you to create more generic commands and subscriptions.

A typical example is, to provide a database connection pool which can be used by multiple commands and subscriptions of a service.

Defining a resource needs to be done in the service builder:

```ts
import type { DbType } from 'my-db'

const serviceBuilder = new ServiceBuilder(serviceOneInfo)
  .setConfigSchema(serviceOneSchema)
  .defineResource<'resourceNameDB',DbType>()
```

This adds a new entry `myDB` with type of `Db` to the resource entry of the command & subscription context.

::: warning Definitions vs Instance
In the `defineResource` function, no instance of a resource is provided. Actual instances are set, when a service instance is created.
:::

When a new service instance is created, it requires to get an instance of the resource.

```ts
import { MyDb } from 'my-db'
const service = await serviceBuilder.getInstance(eventbridge, {
  logger,
  resources: { resourceNameDB: new MyDb() },
})
```

The instance can be access via the context of commands and subscriptions.

```ts
commandBuilder.setCommandFunction(async function ({ resources }) {
  return resources.resourceNameDB.query('SELECT * FROM my_db')
})
```

Defining a resource is Typescript type only. There is no runtime validation.

## Testing

As the resources are defined as TypeScript types, developers benefit from well-defined interfaces. During testing, the actual resource can easily be replaced with a mock implementation.

```ts
import { createSandbox } from 'sinon'

const sandbox: SinonSandbox = createSandbox()
const myStub = sandbox.stub().resolves({...})

const service = await serviceBuilder.getInstance(eventbridge, {
  logger,
  resources: { resourceNameDB: myStub },
})
```
