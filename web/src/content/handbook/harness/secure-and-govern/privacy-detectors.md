---
title: Select a privacy detector
description: Install, configure, and bind the detector whose entity coverage and deployment boundary match the data you inspect.
order: 755
---

Sensitive-data detection is optional and starts disabled. A detector inspects
only the exact text fields and phases bound to Guardrails; it does not scan
prompts, files, JSON, or telemetry by itself. Choose the smallest detector that
covers the required entities and data-residency boundary, then prove its
fail-closed behavior with synthetic fixtures.

By the end of the smallest path, the native detector masks email addresses and
phone numbers before an agent sends input to its model and before the
agent releases its final output.

## 1. Choose the detector before installing it

| Detector | Install | Best fit | Important boundary |
| --- | --- | --- | --- |
| Native privacy | `npm install @purista/harness-guardrails @purista/harness-guardrails-native-privacy` | Local syntax detection for email, phone, card, IP, IBAN, US SSN, and URL | Uses a platform-specific native prebuild; no remote, WASM, or model fallback. |
| Presidio | `npm install @purista/harness-guardrails @purista/harness-guardrails-presidio` | An existing private Presidio Analyzer with custom recognizers or language coverage | The application operates and authenticates the internal `POST /analyze` endpoint. |
| Local NER | `npm install @purista/harness-guardrails @purista/harness-guardrails-local-ner @huggingface/transformers` | In-process model-based labels such as person, organization, or location | You provision, hash-pin, warm up, and evaluate the local model assets. |

## 2. Bind the native detector for the smallest local setup

The policy lives beside the selected actions. `entities` is a non-empty,
unique uppercase list; `scoreThreshold` is from `0` through `1`; `maskToken`
replaces every detected span and may be empty. The selected detector must
advertise every configured entity or Harness rejects the composition.

```ts title="src/guardrails/privacy.ts"
import { createSensitiveDataActions, defineGuardrails } from '@purista/harness-guardrails'
import { createNativePrivacyDetector } from '@purista/harness-guardrails-native-privacy'

const detector = createNativePrivacyDetector({ id: 'support-privacy-v1' })
const sensitiveDataActions = createSensitiveDataActions({ detector })

export const privacyRails = defineGuardrails({
	config: {
		rails: {
			input: { flows: ['mask sensitive data on input'] },
			output: { flows: ['mask sensitive data on output'] },
		},
		sensitiveData: {
			input: { entities: ['EMAIL_ADDRESS', 'PHONE_NUMBER'], maskToken: '<REDACTED>', scoreThreshold: 0.8 },
			output: { entities: ['EMAIL_ADDRESS', 'PHONE_NUMBER'], maskToken: '<REDACTED>', scoreThreshold: 0.8 },
		},
	},
	actions: sensitiveDataActions,
})
```

`mask` changes the text before the next boundary. Use the corresponding
`detect sensitive data …` action when any finding must block the run. Do not
catch detector setup failures and silently start without the control.

## 3. Attach the privacy rails to an agent

The detector is inactive until its Guardrails definition is bound to a
default-loop agent. Register the model first, then set the agent's `guardrails`
field:

```ts title="src/createPrivateSupportHarness.ts"
import { defineHarness, type ModelProvider } from '@purista/harness'
import { z } from 'zod'
import { privacyRails } from './guardrails/privacy.js'

export function createPrivateSupportHarness(provider: ModelProvider) {
	return defineHarness({ name: 'private-support' })
		.telemetry({ contentCaptureMode: 'NO_CONTENT' })
		.models({
			assistant: {
				provider,
				model: 'runtime-selected-model',
				capabilities: ['object'],
			},
		})
		.agent('answer', {
			model: 'assistant',
			input: z.string().min(1).max(2_000),
			output: z.string(),
			instructions: 'Answer the support question without exposing private data.',
			guardrails: privacyRails,
		})
		.build()
}
```

Invoke the agent with synthetic input such as `Contact me at user@example.test`.
The model request must contain the mask token instead of the address. A masked
model output must likewise reach the caller without the original value.

The composition uses [`defineHarness(...)`](/handbook/api/functions/_purista_harness.defineHarness/),
[`.telemetry(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#telemetry),
[`.models(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#models),
[`.agent(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#agent), and
[`.build()`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#build).
The model alias must exist before the guarded agent, and the build must accept
every detector action and phase before startup is considered enabled.

## 4. Use Presidio when it is already your governed detector service

```ts title="src/guardrails/privacy.ts"
import { createSensitiveDataActions } from '@purista/harness-guardrails'
import { createPresidioDetector } from '@purista/harness-guardrails-presidio'

const endpoint = process.env.PRESIDIO_ANALYZER_URL
const serviceToken = process.env.PRESIDIO_SERVICE_TOKEN
if (!endpoint || !serviceToken) {
	throw new Error('PRESIDIO_ANALYZER_URL and PRESIDIO_SERVICE_TOKEN are required.')
}

const detector = createPresidioDetector({
	id: 'presidio-private-v1',
	endpoint,
	headers: { 'x-service-token': serviceToken },
	language: 'en',
})

export const privacyActions = createSensitiveDataActions({ detector })
```

Use HTTPS or a protected internal network, task-scoped authentication, and
gateway egress policy. A transport, HTTP, or malformed-response failure is a
content-free, fail-closed detector error; alert on its stable error kind, never
the inspected request.

## 5. Use local NER only with provisioned, verified model assets

Local NER never downloads a model. The model directory must be absolute; every
required asset is SHA-256 pinned, and the label map declares the portable entity
categories that the model may return. Warm it up before accepting traffic.

```ts title="src/guardrails/localNer.ts"
import { createLocalNerDetector } from '@purista/harness-guardrails-local-ner'

const configSha256 = process.env.NER_CONFIG_SHA256
const modelSha256 = process.env.NER_MODEL_SHA256
if (!configSha256 || !modelSha256) {
	throw new Error('NER_CONFIG_SHA256 and NER_MODEL_SHA256 are required.')
}

export const detector = createLocalNerDetector({
	id: 'support-ner-v1',
	modelId: 'support-ner-en-v1',
	modelPath: '/opt/purista/models/support-ner-en-v1',
	modelFiles: [
		{ path: 'config.json', sha256: configSha256 },
		{ path: 'model.onnx', sha256: modelSha256 },
	],
	labels: { PER: 'PERSON', ORG: 'ORGANIZATION' },
})

await detector.warmup()
```

Set integrity values from your build or deployment manifest, not a model
repository at runtime. The optional peer, model files, integrity manifest, or
warmup failure must stop readiness. Local NER accepts at most 65,536 UTF-16
code units per inspection; split or reject larger text explicitly.

## 6. Protect structured tool fields deliberately

Guardrails deliberately does not recursively mutate every JSON field. Bind a
codec to the one field that is allowed to be inspected and preserve normal schema
validation, permission, governance, and business checks afterwards.

```ts title="src/guardrails/settlementMemoPrivacy.ts"
import { sensitiveDataToolRail } from '@purista/harness-guardrails'
import { z } from 'zod'
import { detector } from './localNer.js'

const settlementMemo = z.strictObject({ memo: z.string().max(4_000) })

export const detectSettlementMemo = sensitiveDataToolRail({
	detector,
	phase: 'tool_input',
	tools: ['submit_settlement'],
	policy: 'input',
	operation: 'detect',
	valueSchema: settlementMemo,
	codec: {
		id: 'settlement-memo-v1',
		extract: ({ memo }) => [{ id: 'memo', text: memo }],
		replace: value => value,
	},
})
```

Add `detect settlement memo` to `config.rails.tool_input.flows` with this token
in the action map. It blocks before binding, governance, and the side effect.
For masking, use `operation: 'mask'` and implement a reviewed replacement for
only the selected field.

## 7. Verify without a provider or real personal data

Use `FakeSensitiveDataDetector`, `FakePresidioSidecar`, or
`FakeLocalNerRuntime` from the respective `/testing` exports. Script allow,
finding, and failure outcomes; assert that the blocked path never calls the
model or tool and that logs/traces contain only stable error and decision
fields. These fakes test deterministic enforcement wiring; they do not validate
real detector recall or model quality.
