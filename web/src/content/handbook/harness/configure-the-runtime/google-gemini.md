---
title: Configure Google Gemini
description: Bind Google Gemini through the official SDK with explicit API or Vertex configuration.
order: 245
---

```sh title="Google Gemini example 1"
npm install @purista/harness @purista/harness-google
```
Use `GEMINI_API_KEY` for Gemini API access. Vertex deployments also require
application-owned project, location, identity, endpoint, and network setup.

```ts title="src/createGeminiHarness.ts"
import { defineAgent, defineHarness } from '@purista/harness'
import { google } from '@purista/harness-google'
import { z } from 'zod'

const answer = defineAgent('answer', { model: 'primary', input: z.string(), output: z.object({ answer: z.string() }), instructions: 'Answer clearly.' })
const definition = defineHarness({ name: 'support' }).addAgent(answer)
export const harness = await definition.getInstance({ model: { provider: google({ apiKey: process.env.GEMINI_API_KEY }), model: process.env.GEMINI_MODEL ?? 'gemini-2.5-flash' } })
```
Gemini generation settings map into the SDK `config` object. Model metadata
controls valid ranges and support; omit settings you have not verified.
