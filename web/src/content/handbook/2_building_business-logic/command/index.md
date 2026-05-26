---
title: Command
description: How to add a command to a PURISTA typescript framework service
order: 202000
---

# Command

![Add command with cli](/graphic/add_command.png)

A command is a single function, which will be called (invoked) by someone with the expectation to get a result back.

Think of a command as the PURISTA equivalent of an RPC call or a POST endpoint: something triggers it, it does work, and the caller waits for a typed response. If you are building a `checkout` operation that must return an order ID, or a `validateCoupon` operation that must return `valid | invalid`, a command is the right tool. The caller and the command are decoupled through the event bridge — neither knows the other's physical address — but the call-and-response contract is still synchronous from the caller's perspective.

Commands are also the primary way to expose functionality as HTTP endpoints. When you call `.exposeAsHttpEndpoint(...)` on the command builder, the PURISTA HTTP adapter wires up routing automatically. This means you define your business logic once; the HTTP exposure is a declaration, not a separate layer.

Add a command to an existing service with `purista add command`.

Commands can access service resources (for example database clients/connections) via `context.resources`.
Resources are provided when creating the service instance with `serviceBuilder.getInstance(eventBridge, { resources: ... })`.
Commands can also consume stream endpoints via `context.stream` when declared with `.canConsumeStream(...)`.
## Command lifecycle

Each command follows the same processing pipeline, and understanding this order matters when you add guards or transformers. Validation fires before your business logic, so a malformed payload never reaches `setCommandFunction`. Guards fire after validation but before execution, which is where auth and authorization checks live. Output validation fires after your function returns, giving you a compile-time and runtime guarantee that the response shape matches the declared schema.

1. optional input transform
2. payload/parameter validation
3. before guards
4. command function execution
5. output validation
6. after guards
7. optional output transform

## What to read next

- [The command builder](./the-command-builder.md)
- [Invoke another command](./invoke_command_from_command.md)
- [Expose as HTTP endpoint](./exposing-a-command-as-http-endpoint.md)
- [Test a command](./test-a-command.md)

## When to use

Commands and subscriptions are complementary, not competing. Use a command when the caller must act on the result (a create returns an ID, a validate returns a verdict, a query returns data). Use a subscription when you want to react to something that already happened without the original caller needing to know. If you find yourself writing a command that fires-and-forgets with no meaningful return value, reconsider whether a subscription or a queue worker is the better fit.

- You need request/response behavior.
- A caller expects success/error result semantics.
- You want strict validation on input/output contracts.

## Common pitfalls

- mixing long-running asynchronous workflows into one command
- overusing broad payload schemas instead of explicit contracts
- forgetting to define output schema, then losing type guarantees

## Checklist

- payload, parameter and output schemas are defined
- guards are used for auth/authz concerns
- command is exposed (or intentionally internal only)
- unit tests cover success and failure paths
