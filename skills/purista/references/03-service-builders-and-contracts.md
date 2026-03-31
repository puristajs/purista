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

When another service, worker, UI, or agent consumes that contract, define the consumer schema locally again instead of importing one oversized shared schema.
- Keep the required producer guarantees mandatory.
- Only include optional fields the consumer actually uses.
- Let Zod strip everything else so consumer payloads stay narrow and stable.
- Treat this as a boundary projection, not as duplication to be “deduplicated away”.

## Anti-patterns
- handlers built in isolation from the owning service
- one service with unrelated business responsibilities
- resource construction inside handlers
- importing one broad shared schema into many consumers that each use different subsets of fields
