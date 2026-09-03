---
title: Create a portable Harness definition
description: Declare model requirements and host tools once, then bind providers and application operations at the runtime boundary.
order: 315
---

Use a portable definition when the same agents and workflows must run in a
standalone Harness application or inside a host framework. The definition owns
schemas and capability requirements. The application composition root owns
provider credentials, concrete model IDs, storage, admission, sandboxes, and
host-tool implementations.

## Declare requirements instead of adapters

```ts title="src/harness/supportHarness.ts"
import { defineHarness } from '@purista/harness'
import { z } from 'zod'

const accountInput = z.strictObject({ accountId: z.string().min(1) })
const accountOutput = z.strictObject({ accountId: z.string(), status: z.string() })

export const supportHarness = defineHarness({ name: 'support' })
	.requireModel('primary', { capabilities: ['object', 'tool_use'] })
	.hostTool('read_account', {
		kind: 'host',
		description: 'Read an account that the current caller may access.',
		input: accountInput,
		output: accountOutput,
	})
	.agent('answer_account_question', {
		model: 'primary',
		input: z.strictObject({ question: z.string().min(1), accountId: z.string().min(1) }),
		output: z.strictObject({ answer: z.string() }),
		tools: ['read_account'],
		instructions: 'Use read_account when account facts are needed. Do not invent account data.',
	})
	.define()
```

[`defineHarness({ name })`](/handbook/api/functions/_purista_harness.defineHarness/)
starts the typed definition chain and assigns its diagnostic name.
[`requireModel(id, requirement)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#requiremodel)
and
[`requireModels(requirements)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#requiremodels)
declare provider-neutral aliases. Each requirement needs at least one model
capability. They cannot be combined with concrete `.model(...)` or
`.models(...)` registrations in the same definition.

[`hostTool(id, definition)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#hosttool)
declares a typed operation without an implementation. The tool remains absent
from every agent unless the agent explicitly includes its ID in `tools`.
[`agent(id, definition)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#agent)
retains the portable model and host-tool IDs in its inferred contract.
Calling `.build()` with an unbound host tool fails; finish a portable chain with
[`define()`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#define).

## Bind the standalone runtime

```ts title="src/createSupportHarness.ts"
import { openai } from '@purista/harness-openai'
import { supportHarness } from './harness/supportHarness.js'

type HostContext = {
	identity: { tenantId: string; principalId: string }
}

interface AccountRepository {
	readAuthorized(input: HostContext['identity'] & { accountId: string }): Promise<{
		accountId: string
		status: string
	}>
}

export async function createSupportHarness(apiKey: string, accounts: AccountRepository) {
	return supportHarness.getInstance<HostContext>({
		models: {
			primary: { provider: openai({ apiKey }), model: 'gpt-5-mini' },
		},
		hostTools: {
			read_account: async (context, input) => {
				return accounts.readAuthorized({ ...context.host.identity, accountId: input.accountId })
			},
		},
	})
}
```

[`HarnessDefinition.getInstance(config)`](/handbook/api/interfaces/_purista_harness.HarnessDefinition/#getinstance)
requires every declared model and host tool with their inferred IDs and schema
types. It also accepts optional admission, artifacts, telemetry, storage,
sandbox, memory, and durable workspace adapters. A model binding supplies its
provider and provider model ID; it cannot widen the capabilities declared by
the definition.

The `HostContext` is supplied by the trusted caller for one invocation. It is
not inferred from model input and is never a substitute for business
authorization in the repository or service operation.

```ts title="Invoke the portable definition standalone"
const session = await harness.getSession('support-case-42')
const outcome = await session.agents.answer_account_question.run(
	{ question: 'Is this account active?', accountId: 'account-1' },
	{
		hostContext: {
			identity: { tenantId: 'tenant-example', principalId: 'principal-alex' },
		},
	},
)
```

## Compose reviewed static modules

Use a local static module when a reusable package should contribute a related
set of models, tools, skills, agents, or workflows without receiving authority
to build or dynamically load a Harness.

```ts title="src/harness/supportModule.ts"
import { defineHarnessModule } from '@purista/harness'
import { z } from 'zod'

export const supportModule = defineHarnessModule()('support-module', {
	version: '1.0.0',
	requires: ['sandbox.fs'],
	register: (builder) => builder.agent('classify_support_case', {
		input: z.object({ message: z.string() }),
		output: z.object({ urgent: z.boolean() }),
		handler: async ({ input }) => ({ urgent: /stolen|fraud/i.test(input.message) }),
	}),
})
```

Apply it once with
[`builder.use(module)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#use).
The module's `register` callback receives a restricted
[`HarnessModuleBuilder`](/handbook/api/interfaces/_purista_harness.HarnessModuleBuilder/)
that has no `.build()` or `.use()` method. It must return the same module
builder and contribute at least one definition family. Duplicate module IDs,
invalid IDs/versions, missing required adapter capabilities, or a callback
that returns another value fail composition. Modules are local static data and
functions; Harness does not discover or execute arbitrary plugin code.

The restricted builder deliberately mirrors only registration methods:

| Definition family | Module-builder members |
| --- | --- |
| Concrete model aliases | [`model(...)`](/handbook/api/interfaces/_purista_harness.HarnessModuleBuilder/#model) / [`models(...)`](/handbook/api/interfaces/_purista_harness.HarnessModuleBuilder/#models) |
| Native tools | [`tool(...)`](/handbook/api/interfaces/_purista_harness.HarnessModuleBuilder/#tool) / [`tools(...)`](/handbook/api/interfaces/_purista_harness.HarnessModuleBuilder/#tools) |
| Host-owned tool contract | [`hostTool(...)`](/handbook/api/interfaces/_purista_harness.HarnessModuleBuilder/#hosttool) |
| Skills | [`skill(...)`](/handbook/api/interfaces/_purista_harness.HarnessModuleBuilder/#skill) / [`skills(...)`](/handbook/api/interfaces/_purista_harness.HarnessModuleBuilder/#skills) |
| Agents | [`agent(...)`](/handbook/api/interfaces/_purista_harness.HarnessModuleBuilder/#agent) / [`agents(...)`](/handbook/api/interfaces/_purista_harness.HarnessModuleBuilder/#agents) |
| Workflows | [`workflow(...)`](/handbook/api/interfaces/_purista_harness.HarnessModuleBuilder/#workflow) / [`workflows(...)`](/handbook/api/interfaces/_purista_harness.HarnessModuleBuilder/#workflows) |

Singular forms add one literal ID and plural forms add a record. They share the
same schema validation and duplicate-ID rules as direct Harness composition;
a module does not receive separate runtime privileges.

`harness.inspect()` exposes only the module ID, optional version, declared
capabilities, and contributed definition IDs for inventory and operations. It
does not expose prompts, credentials, tool input, or result content.

## Mount the same definition in a framework

The definition exposes stable `catalog` and `contracts` values for host
integrations. A framework can publish selected agents and workflows by address
and bind the same host-tool contract to its own command or resource adapter.
The definition does not import that framework, and the host does not redefine
the agent.

For PURISTA, continue with
[mount Harness and bind runtime](/handbook/framework/build-ai-powered-services/mount-harness-and-bind-runtime/).
For standalone Harness, continue with
[instructions and runtime context](../instructions-and-runtime-context/).
