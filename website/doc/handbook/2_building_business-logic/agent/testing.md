---
title: Testing
description: How to ensure your agents are reliable, deterministic, and high-quality.
order: 203708
---

# Testing

Testing LLM-based applications is notoriously difficult because of their non-deterministic nature. PURISTA provides tools to make your agent tests **reliable**, **fast**, and **deterministic**.

## 1. Unit Testing Agents

When you use `purista add agent`, a test file is automatically generated. The goal of a unit test is to verify your agent's logic (tool calls, state changes, schema validation) without making real LLM calls.

```ts title="src/agents/supportAgent/v1/supportAgent.test.ts"
import { supportAgent } from './supportAgent.js'
import { MockModel, testAgent } from '@purista/ai'

describe('Support Agent', () => {
  it('should call the ticketing tool if the user reports a bug', async () => {
    const model = new MockModel()
      .on(/broken laptop/i)
      .reply('I have created a ticket for you.')

    const { instance, eventBridge, destroy } = await testAgent(supportAgent, {
      models: {
        'openai:gpt-4o-mini': model
      }
    })

    // 2. Mock the service command
    const createTicketMock = vi.fn().mockResolvedValue({ id: 'ticket-123' })
    eventBridge.registerCommand('ticketing', '1', 'createTicket', createTicketMock)

    // 3. Run the agent
    const result = await instance.invoke({ payload: { prompt: 'My laptop is broken' } })

    // 4. Verify assertions
    expect(createTicketMock).toHaveBeenCalledWith(
      expect.objectContaining({ reason: 'Broken laptop' })
    )
    expect(result.envelopes.some(e => e.frame.kind === 'message')).toBe(true)
    await destroy()
  })
})
```

## 2. Using the Test Helper (`testAgent`)

The `testAgent` helper is your best friend. It:
- Sets up an in-memory EventBridge.
- Creates a runtime instance of your agent.
- Injects mock models and providers.
- Accepts a `queueBridge` when you are testing a queued durable agent.
- Provides a clean way to register mock commands.
- Returns `destroy()` to cleanly stop the instance and bridge.

`MockModel` gives deterministic scripting:

- `.on(string | RegExp).reply(string | fn)`
- `.onJson(matcher).reply(object | fn)`

## 3. Strategies for Reliable Tests

### A. Schema Validation
Verify that your agent correctly handles malformed input. Because you've defined `addPayloadSchema`, PURISTA will automatically throw a `HandledError` before the agent even starts.

### B. State/History Checks
If your agent uses `persistConversation`, you can verify the history state after a run:

```ts
const session = await instance.session.load('test-session')
expect(session.data.messages).toHaveLength(2)
```

### C. Deterministic Output
Mock the model output to verify how your agent handler processes it (e.g., extracting values from JSON or formatting a string).

### D. Queued Durable Runs
When the agent uses `setExecutionMode('queued')`, inject a queue bridge in the test and assert the emitted `run-state` artifact or final message:

```ts
import { DefaultQueueBridge } from '@purista/core'

const queueBridge = new DefaultQueueBridge()
const { instance, destroy } = await testAgent(supportAgent, {
  queueBridge,
  models: {
    'openai:gpt-4o-mini': model,
  },
})
```

This keeps the test deterministic while still covering the durable execution path.

## 4. Evaluation Datasets (Advanced)

For production-ready agents, unit tests are not enough. You need to evaluate the **quality** of the LLM responses.

PURISTA supports an "Evaluation Mode" where you can run your agent against a dataset of "Golden Questions" and "Expected Answers."

- **Metrics**: BLEU, ROUGE, or LLM-as-a-judge scoring.
- **CI/CD**: Block deployments if the evaluation score drops below a certain threshold.

See the [AI Basic Example](https://github.com/purista-js/purista/tree/main/examples/ai-basic) for a complete reference on evaluation datasets.
