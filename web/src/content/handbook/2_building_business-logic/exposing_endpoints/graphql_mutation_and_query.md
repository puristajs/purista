---
title: GraphQL
description: Learn how to call commands via GraphQL
order: 207020
---

# GraphQL

PURISTA does not enforce a dedicated GraphQL package.
The recommended approach is to keep GraphQL as an adapter layer and invoke commands from resolvers.

## Why this works well

- Commands already define runtime-validated contracts via schemas.
- Business logic remains independent from GraphQL-specific concerns.
- You can keep REST and GraphQL side-by-side over the same command set.

## Typical architecture

1. Build and start your services as usual.
2. In your GraphQL server, call commands from resolvers (mutation/query handlers).
3. Map GraphQL input to command payload/parameter, and map command output to GraphQL types.

## Resolver example (conceptual)

```typescript
const resolvers = {
  Mutation: {
    async createUser(_: unknown, args: { input: { email: string } }, ctx: { userId: string }) {
      const payload = { email: args.input.email }
      const parameter = { requestedBy: ctx.userId }

      return commandClient.UserService['1'].createUser(payload, parameter)
    },
  },
}
```

`commandClient` can be an in-process embedded client (monolith) or a generated client (distributed setup).

## Recommended practices

- Keep GraphQL schema focused on consumer needs; keep command contracts focused on domain needs.
- Validate/normalize GraphQL input before invoking commands.
- Propagate principal/tenant context explicitly into command parameters or message fields.
- Prefer small, composable commands over large GraphQL-specific orchestration logic.

See also:

- [Embedded client](../connect_to_a_purista_application/embedded_client.md)
- [Create an EventBridge client](../connect_to_a_purista_application/create_an_eventbridge_client.md)
- [Create a REST API client](../connect_to_a_purista_application/create_a_rest_api_client.md)
