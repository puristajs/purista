# SKILL: PURISTA-Testing

## 1. Intent
Implement isolated, framework-compliant unit tests for PURISTA services using standard mock helpers and Jest.

## 2. Blueprint: Command Unit Test
Always use `getCommandContextMock` to simulate the execution environment.
(See existing pattern below).

## 3. Blueprint: Subscription Unit Test
Use `getSubscriptionContextMock` to test event reactions in isolation.

```typescript
import { getSubscriptionContextMock } from '@purista/core'
import { mySubscriptionBuilder } from './mySubscriptionBuilder'

describe('MyService: onEvent', () => {
  it('should react to events', async () => {
    const payload = { data: 'test' }
    const { mock } = getSubscriptionContextMock({ payload })

    const handler = (mySubscriptionBuilder as any).fn
    await handler.bind(mock)(mock, payload)

    expect(mock.logger.info).toHaveBeenCalled()
  })
})
```

## 4. Infrastructure: Babel and ESM
When testing drivers that use modern ESM packages (e.g., `execa`), your `jest.config.js` MUST include:
- **`transform`**: Use `babel-jest` for `.js` files.
- **`transformIgnorePatterns`**: Explicitly include ESM modules like `execa`, `is-plain-obj`, and `figures`.

## 4. Mandatory Verifications
Every test suite MUST verify:
- **Input Validation**: Ensure the handler fails correctly with invalid payloads.
- **Resource Usage**: Confirm that the handler calls the injected resource methods correctly.
- **Event Emission**: Check if domain events are emitted with the expected data.
- **Error Mapping**: Verify that business failures throw `HandledError`.

## 5. Troubleshooting Tests
- **"eventList[eventName] is not a function"**: You forgot to include the event name in the `emitList` of `getCommandContextMock`.
- **"Cannot use import statement outside a module"**: ESM transformation failed. Add the package to `transformIgnorePatterns` in `jest.config.js`.
- **"this is undefined"**: You forgot to `.bind(mock)` when calling the handler function.
