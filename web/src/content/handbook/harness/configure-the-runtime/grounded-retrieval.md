---
title: Build grounded retrieval
description: Keep retrieval authorization in application code while Harness supplies model and embedding operations.
order: 270
---

Use separate aliases for answer generation and embeddings. The workflow loads
only authorized documents, bounds evidence, then calls the agent. Inject the
retrieval client through a factory so the workflow context stays portable.

```ts title="src/retrieval/answer.ts"
import { defineAgent, defineHarness, defineWorkflow, type ModelRuntimeBinding } from '@purista/harness'
import { z } from 'zod'

const questionInput = z.object({ question: z.string().min(1), tenantId: z.string().min(1) })
const evidenceSchema = z.object({ id: z.string(), text: z.string(), source: z.string() })
const answerInput = z.object({ question: z.string().min(1), evidence: z.array(evidenceSchema).max(20) })
const answerOutput = z.object({ answer: z.string() })
const answer = defineAgent('answer', {
  model: 'assistant',
  input: answerInput,
  output: answerOutput,
  prompt: input => ({ role: 'user', content: input.question }),
  instructions: 'Answer only from supplied evidence.',
})
type Evidence = z.infer<typeof evidenceSchema>
type Knowledge = { searchAuthorized: (tenantId: string, vector: readonly number[], limit: number) => Promise<Evidence[]> }
const createRetrieval = (knowledge: Knowledge) => defineWorkflow('answerWithEvidence', {
  input: questionInput,
  output: answerOutput,
  agents: [answer],
  models: { embedding: { alias: 'embedding', capabilities: ['embeddings'] } },
  handler: async context => {
    const vector = await context.models.embedding.embed(
      { input: context.input.question },
      { callId: 'embed-grounded-question' },
    )
    const articles = await knowledge.searchAuthorized(context.input.tenantId, vector.embeddings[0].vector, 20)
    return context.agents.answer.run(
      { question: context.input.question, evidence: articles },
      { callId: 'answer-grounded-question' },
    )
  },
})
export async function createRetrievalHarness(
  knowledge: Knowledge,
  models: { assistant: ModelRuntimeBinding; embedding: ModelRuntimeBinding },
) {
  const definition = defineHarness({ name: 'grounded-support' })
    .addAgent(answer)
    .addWorkflow(createRetrieval(knowledge))
  return definition.getInstance({ models })
}
```
The vector store and tenant authorization are application boundaries. Bound
count and size, validate citations when required, and treat model metadata as
untrusted. Add Guardrails after retrieval when content policy requires it.
