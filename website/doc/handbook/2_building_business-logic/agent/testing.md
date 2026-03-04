---
title: Testing Agents
description: Deterministic test patterns for agent handlers and command-to-agent integration.
order: 203706
---

# Testing Agents

Treat agents like any other PURISTA business component: fast deterministic tests first, then integration tests for wiring.

## What the CLI gives you

`purista add agent ...` creates a prepared `*.test.ts` beside the generated agent file.

The scaffold already:

- starts/stops an in-memory `DefaultEventBridge`
- injects a deterministic provider (`EchoProvider`)
- executes one real agent invocation
- asserts message and telemetry protocol frames

Start from that test and expand scenarios as your handler grows.

## Unit test pattern (agent runtime)

Use a deterministic test provider so no external LLM API is needed:

```ts
import { describe, expect, it } from 'vitest'
import { DefaultEventBridge } from '@purista/core'
import type { ModelProvider, ProviderRequest } from '@purista/ai'
import { supportAgent } from './supportAgent.js'

class DeterministicProvider implements ModelProvider {
  readonly name = 'deterministic-test-provider'
  async generate(request: ProviderRequest) {
    return {
      output: `MODEL:${request.prompt}`,
      tokens: { prompt: request.prompt.length, completion: 12 },
      costUsd: 0,
    }
  }
}

describe('support agent', () => {
  it('emits final message and telemetry', async () => {
    const eventBridge = new DefaultEventBridge()
    await eventBridge.start()

    const agent = await supportAgent.getInstance(eventBridge, {
      models: { 'openai:gpt-5.2-mini': new DeterministicProvider() },
    })
    await agent.start()
    await new Promise(resolve => setTimeout(resolve, 25))

    try {
      const { envelopes } = await agent.invoke({
        payload: { prompt: 'reset password', message: 'reset password', history: [], attachments: [] },
      })

      const hasFinalMessage = envelopes.some(
        env => env.frame.kind === 'message' && env.frame.final === true,
      )
      const hasTelemetry = envelopes.some(env => env.frame.kind === 'telemetry')

      expect(hasFinalMessage).toBe(true)
      expect(hasTelemetry).toBe(true)
    } finally {
      await agent.stop()
      await eventBridge.destroy()
    }
  })
})
```

## Integration test pattern (command -> agent)

If commands call agents via `.canInvokeAgent(...)`, test that route with a real command invoke:

```ts
const message = {
  id: getNewEBMessageId(),
  timestamp: Date.now(),
  traceId: getNewTraceId(),
  correlationId: getNewEBMessageId(),
  messageType: EBMessageType.Command,
  contentType: 'application/json',
  contentEncoding: 'utf-8',
  sender: {
    serviceName: 'testClient',
    serviceVersion: '1',
    serviceTarget: 'integration',
    instanceId: eventBridge.instanceId,
  },
  receiver: {
    serviceName: 'support',
    serviceVersion: '1',
    serviceTarget: 'runSupportAgent',
  },
  payload: { payload: { prompt: 'How can I reset my password?' }, parameter: {} },
}

const result = await eventBridge.invoke(message)
expect(result).toEqual(expect.objectContaining({ message: expect.stringContaining('MODEL:') }))
```

This validates schema checks, `context.invokeAgent` wiring, and response mapping.

## Reference tests in repository

See the complete examples in:

- `/Users/sebastianwessel/projekte/@purista/purista/examples/ai-basic/src/agents/supportAgent/v1/supportAgent.test.ts`
- `/Users/sebastianwessel/projekte/@purista/purista/examples/ai-basic/src/service/support/v1/command/runSupportAgent/runSupportAgentCommandBuilder.test.ts`
