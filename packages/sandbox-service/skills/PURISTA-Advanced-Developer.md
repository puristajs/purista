# SKILL: PURISTA-Advanced-Developer

## 1. Intent
Implement cross-cutting concerns, data transformations, and security guards using PURISTA's advanced execution lifecycle.

## 2. The Execution Chain (Order of Operations)
When a command is invoked, the chain is:
1. **Interceptors (Before)**: Global/Service logic.
2. **Hooks (Before)**: Command-specific pre-checks.
3. **Input Transformer**: Data mapping to domain model.
4. **Command Handler**: Core logic.
5. **Output Transformer**: Data mapping for consumer.
6. **Hooks (After)**: Side effects.
7. **Interceptors (After)**: Global/Service cleanup.

## 3. Implementation: Interceptors (Service Level)
Interceptors "wrap" every command in a service. Use them for Auth or Global Logging.

```typescript
// Registered in ServiceBuilder
builder.addInterceptor(async function(context, next) {
  // Logic BEFORE every command
  context.logger.info('Check principal permissions')
  
  if (!context.message.principalId) {
    throw new HandledError(StatusCode.Unauthorized, 'Login required')
  }

  const result = await next() // Execute next in chain

  // Logic AFTER every command
  return result
})
```

## 4. Implementation: Guards (Before Hooks)
Use `.addBeforeHook()` for function-specific validation or permission checks.

```typescript
.getCommandBuilder('deleteRecord', '...')
.addBeforeHook(async function(context, payload, parameter) {
  // Parameter check
  if (parameter.id === 'root') {
    throw new HandledError(StatusCode.Forbidden, 'Cannot delete root')
  }
  return payload
})
```

## 5. Implementation: Transformers
Use `.addInputTransformer()` and `.addOutputTransformer()` to decouple your domain logic from external API formats.

```typescript
.addInputTransformer(async function(context, externalPayload) {
  // Map legacy API payload to internal domain aggregate
  return { 
    domainId: externalPayload.legacy_id,
    active: externalPayload.status === 'OK'
  }
}, InternalSchema)
```

## 6. Principal & Security Context
Every message context includes `principalId`. 
- **Rule**: Always verify that the `principalId` has the right to access the resources (Sandboxes, Projects) associated with the `payload`.
- **Tenant Isolation**: Use `tenantId` from the context to filter database or state store queries.
