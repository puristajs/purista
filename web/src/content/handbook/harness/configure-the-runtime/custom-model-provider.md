---
title: Build a custom model provider
description: Implement only the provider-neutral operations your application can verify.
order: 280
---

Use a custom provider when the application owns a gateway or model service that
is not covered by a first-party adapter. Implement the `ModelProvider` port,
return validated provider-neutral responses, and declare only supported
capabilities.

```ts title="src/models/gatewayProvider.ts"
import type { ModelProvider } from '@purista/harness'

export const gatewayProvider: ModelProvider = {
  async object(request, signal) {
    const response = await gateway.post('/object', { request, signal })
    return { object: response.object, usage: response.usage, finishReason: response.finishReason }
  },
}
```
Bind it like any other provider:

```ts title="Custom Model Provider example 3"
const definition = defineHarness({ name: 'support' }).addAgent(answer)
const harness = await definition.getInstance({
	models: { answering: { provider: gatewayProvider, model: 'support-object' } },
})
```
Run the shared adapter contract suite, typecheck without casts, test timeout,
cancellation, malformed responses, retry, cleanup, and unavailable gateway
behavior. Contract suites do not prove gateway permissions, topology, model
quality, or network policy.
