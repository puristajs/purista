# Service Builders and Contracts

Use this reference when implementing or reviewing service structure.

## Service builder lifecycle
```ts
const service = new ServiceBuilder(serviceInfo)
  .setConfigSchema(configSchema)
  .defineResource('repository', repositoryResource)

const command = service
  .getCommandBuilder('createThing', '1')
  .setInputSchema(createThingInputSchema)
  .setOutputSchema(createThingOutputSchema)
  .setCommandFunction(async context => {
    return await context.resources.repository.create(context.input)
  })

service.addCommandDefinition(command.getDefinition())
```

## Child builder choices
- command: request/response business action
- subscription: event reaction
- stream: progressive output
- queue: durable background task definition
- queue worker: execution logic for queue work

## Contract rule
Keep schemas explicit and attached to builder definitions. The contract belongs to the boundary, not to incidental UI code.

## Anti-patterns
- handlers built in isolation from the owning service
- one service with unrelated business responsibilities
- resource construction inside handlers
