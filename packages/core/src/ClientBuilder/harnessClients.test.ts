import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import type { HarnessTargetExecutionEvent, HarnessTargetExecutionTerminalOutcome } from '@purista/harness'

import { defineAgent, defineHarness, harnessExecutionEventTypesV1 } from '@purista/harness'
import ts from 'typescript'
import { afterEach, describe, expect, expectTypeOf, it, vi } from 'vitest'
import type { EventBridge } from '../core/EventBridge/types/EventBridge.js'
import type { CorrelationId } from '../core/types/CorrelationId.js'
import type { StreamFrame } from '../core/types/stream/StreamFrame.js'
import { defineHarnessQueueBinding } from '../HarnessMount/queueBinding.js'
import {
	computeHarnessTargetExportDigest,
	createGeneratedHarnessSchema,
	createRemoteHarnessTargetContract,
} from '../HarnessMount/remoteTargetContract.js'
import type { FullServiceDefinition } from '../helper/types/FullServiceDefinition.js'
import { QueueDefinitionBuilder } from '../QueueDefinitionBuilder/QueueDefinitionBuilder.impl.js'
import { QueueWorkerBuilder } from '../QueueWorkerBuilder/QueueWorkerBuilder.impl.js'
import { ServiceBuilder } from '../ServiceBuilder/ServiceBuilder.impl.js'
import { ClientBuilder } from './ClientBuilder.impl.js'
import { createRemoteHarnessClient } from './harnessClient.js'
import { generateHarnessClientArtifacts } from './harnessCodegen.js'
import { mergeIntoServiceDefinition } from './mergeIntoServiceDefinition.impl.js'

const temporaryPaths: string[] = []
afterEach(async () => {
	await Promise.all(temporaryPaths.splice(0).map(path => rm(path, { recursive: true, force: true })))
})

function root(queued = true) {
	const address = { serviceName: 'Support', serviceVersion: '1', serviceTarget: 'support' } as const
	const target = {
		targetName: 'support',
		kind: 'agent',
		inputSchema: {
			type: 'object',
			required: ['raw'],
			properties: { raw: { type: 'string' } },
			additionalProperties: false,
		},
		validatedInputSchema: {
			type: 'object',
			required: ['normalized'],
			properties: { normalized: { type: 'number' } },
			additionalProperties: false,
		},
		outputSchema: {
			type: 'object',
			required: ['accepted'],
			properties: { accepted: { type: 'boolean' } },
			additionalProperties: false,
		},
		updateSchema: true,
		interruptSchema: false,
		invocation: { aggregate: true, stream: true, resumableInterrupts: [] },
		stream: {
			protocol: 'harness-execution-events-v1',
			eventTypes: harnessExecutionEventTypesV1,
			outputUpdates: ['object-snapshot'],
		},
		...(queued ? { queue: { name: 'support-jobs' } } : {}),
	} as const
	return { address, target: { ...target, exportDigest: computeHarnessTargetExportDigest({ address, target }) } }
}

function contract() {
	const source = root()
	return createRemoteHarnessTargetContract({
		schemaVersion: 1,
		...source,
		target: { ...source.target, queue: { name: 'support-jobs' } },
		schemas: {
			input: createGeneratedHarnessSchema<{ raw: string }>(source.target.inputSchema),
			validatedInput: createGeneratedHarnessSchema<{ normalized: number }>(source.target.validatedInputSchema),
			output: createGeneratedHarnessSchema<{ accepted: boolean }>(source.target.outputSchema),
		},
	})
}

function definitions(): FullServiceDefinition {
	return {
		Support: {
			'1': {
				description: 'Support',
				deprecated: false,
				commands: {},
				subscriptions: {},
				agents: { support: root().target },
				harness: {
					name: 'support',
					roots: { agents: ['support'], workflows: [] },
					dependencies: { agents: ['private-child'], workflows: [], tools: [], skills: [], mcpServers: [] },
				},
			},
		},
	}
}

describe('ClientBuilder Harness convergence', () => {
	it('generates only native local roots and preserves the authentic local queue projection', async () => {
		const schema = createGeneratedHarnessSchema<string>({ type: 'string' })
		const child = defineAgent('lookup', { input: schema, output: schema, instructions: 'Look up.' })
		const agent = defineAgent('answer', {
			input: schema,
			output: schema,
			instructions: 'Answer.',
			subagents: { lookup: child },
		})
		const queue = new QueueDefinitionBuilder('answer-jobs', 'Queued answers')
		const worker = new QueueWorkerBuilder('answer-jobs', 'answer-worker')
		const binding = defineHarnessQueueBinding(agent.contract, queue, worker)
		const definition = defineHarness({ name: 'localClient', revision: '1' }).addAgent(agent)
		const service = new ServiceBuilder({
			serviceName: 'Local',
			serviceVersion: '1',
			serviceDescription: 'Local service',
		}).mountHarness(definition, { targets: { agents: { answer: { queue: binding } } } })
		const builder = new ClientBuilder()
		const stored = await builder.getDefinitionsFromServiceBuilders([service])
		expect(stored.Local['1'].agents?.answer.queue?.name).toBe('answer-jobs')
		const generated = generateHarnessClientArtifacts(stored)
		expect([...generated.files.keys()]).toEqual(['generated/purista/local/v1/harness/agent/answerTargetContract.ts'])
		expect(generated.members).not.toContain('lookup')
		const body = [...generated.files.values()][0]
		expect(body).toContain(stored.Local['1'].agents?.answer.exportDigest)
		expect(body).toContain('answer-jobs')
		expect(body).not.toContain('ServiceBuilder')
	})

	it('rejects a dependency inserted into the callable map before producing artifacts', () => {
		const stored = definitions()
		stored.Support['1'].harness = {
			name: 'support',
			dependencies: { agents: [], workflows: [], tools: [], skills: [], mcpServers: [] },
			roots: { agents: [], workflows: [] },
		}
		expect(() => generateHarnessClientArtifacts(stored)).toThrow('root')
	})

	it('keeps stored Harness metadata when collecting builders and merging loaded definitions', async () => {
		const stored = definitions().Support['1']
		const getFullServiceDefinition = vi.fn(async () => ({
			serviceName: 'Support',
			serviceVersion: '1',
			serviceDescription: 'Support',
			deprecated: false,
			commands: [],
			subscriptions: [],
			agents: stored.agents,
			harness: stored.harness,
		}))
		const collected = await new ClientBuilder().getDefinitionsFromServiceBuilders([
			{ getFullServiceDefinition },
		] as never)
		expect(collected.Support?.['1'].agents?.support).toBe(stored.agents?.support)
		expect(getFullServiceDefinition).toHaveBeenCalledTimes(1)
		const current: FullServiceDefinition = {
			Support: { '1': { description: 'Support', deprecated: false, commands: {}, subscriptions: {} } },
		}
		mergeIntoServiceDefinition(current, collected)
		expect(current.Support['1'].agents?.support).toBe(stored.agents?.support)
		expect(current.Support['1'].harness).toBe(stored.harness)
	})

	it('generates three validation-only witnesses and address namespaces from the same stored snapshot', async () => {
		const path = await mkdtemp(join(tmpdir(), 'p4-046-client-'))
		temporaryPaths.push(path)
		const builder = new ClientBuilder({ outputPath: 'generated-client' })
		builder.rootPath = path
		const snapshot = definitions()
		await builder.generateEventBridgeClient(snapshot)
		const targetPath = join(
			builder.getOutputPath(),
			'src/generated/purista/support/v1/harness/agent/supportTargetContract.ts',
		)
		const target = await readFile(targetPath, 'utf8')
		const client = await readFile(join(builder.getOutputPath(), 'src/eventbridge_client.ts'), 'utf8')
		expect(target).toContain(root().target.exportDigest)
		expect(target).toContain('createGeneratedHarnessSchema<SupportInput>')
		expect(target).toContain('createGeneratedHarnessSchema<SupportValidatedInput>')
		expect(target).toContain('createGeneratedHarnessSchema<SupportOutput>')
		expect(target).toContain('as const satisfies SerializedHarnessTargetExportV1')
		expect(target).not.toMatch(/src\/service|defineAgent|defineHarness|ServiceBuilder|@purista\/harness|\.transform\(/)
		expect(client).toContain('createRemoteHarnessClient')
		expect(client).toContain("export type HarnessClientOptions = Omit<RemoteHarnessClientOptions, 'senderName'>")
		expect(client).toContain('public readonly __harnessClientOptions__: HarnessClientOptions = {}')
		expect(client).toContain('...this.__harnessClientOptions__, senderName: "EventBridgeClient"')
		expect(client).toContain('get agent()')
		expect(client).toContain('"Support"')
		expect(client).toContain('"1"')
		expect(client).not.toContain('private-child')
		await builder.generateEventBridgeClient(snapshot)
		expect(await readFile(targetPath, 'utf8')).toBe(target)
	})

	it('generates bounded tuple types that match the validation-only witness', () => {
		const snapshot = definitions()
		const current = root().target
		const tupleSchema = {
			type: 'array',
			prefixItems: [{ type: 'string' }, { type: 'number' }],
			minItems: 2,
			maxItems: 2,
		} as const
		const targetWithoutDigest = {
			...current,
			inputSchema: tupleSchema,
			validatedInputSchema: tupleSchema,
		}
		const address = { serviceName: 'Support', serviceVersion: '1', serviceTarget: 'support' } as const
		snapshot.Support['1'].agents = {
			support: {
				...targetWithoutDigest,
				exportDigest: computeHarnessTargetExportDigest({ address, target: targetWithoutDigest }),
			},
		}

		const body = [...generateHarnessClientArtifacts(snapshot).files.values()][0]
		expect(body).toContain('export type SupportInput = [string, number]')
		expect(body).toContain('export type SupportValidatedInput = [string, number]')
		expect(body).not.toContain('...(JsonValue)[]')

		const closedTupleWithLooseMaximum = {
			type: 'array',
			prefixItems: [{ type: 'string' }],
			items: false,
			maxItems: 1000,
		} as const
		const closedTarget = {
			...current,
			inputSchema: closedTupleWithLooseMaximum,
			validatedInputSchema: closedTupleWithLooseMaximum,
		}
		snapshot.Support['1'].agents = {
			support: {
				...closedTarget,
				exportDigest: computeHarnessTargetExportDigest({ address, target: closedTarget }),
			},
		}
		const closedBody = [...generateHarnessClientArtifacts(snapshot).files.values()][0]
		expect(closedBody).toContain('export type SupportInput = [(string)?]')
		expect(closedBody).not.toContain('256 statically bounded items')

		const objectSchema = {
			type: 'object',
			properties: { known: { type: 'string' } },
			required: ['known'],
			additionalProperties: { type: 'number' },
		} as const
		const objectTarget = {
			...current,
			inputSchema: objectSchema,
			validatedInputSchema: objectSchema,
		}
		snapshot.Support['1'].agents = {
			support: {
				...objectTarget,
				exportDigest: computeHarnessTargetExportDigest({ address, target: objectTarget }),
			},
		}
		const objectBody = [...generateHarnessClientArtifacts(snapshot).files.values()][0]
		expect(objectBody).toContain('export type SupportInput = { "known": string } & Record<string, number | string>')
	})

	it('compiles generated queued/unqueued agent and workflow clients with exact public inference', async () => {
		const path = await mkdtemp(join(tmpdir(), 'p4-046-types-'))
		temporaryPaths.push(path)
		const builder = new ClientBuilder({ outputPath: 'client' })
		builder.rootPath = path
		const snapshot = definitions()
		const unqueued = root(false)
		const target = {
			...unqueued.target,
			targetName: 'review',
			kind: 'workflow',
			stream: { ...unqueued.target.stream, outputUpdates: [] },
			updateSchema: false,
		} as const
		const address = { ...unqueued.address, serviceTarget: 'review' }
		snapshot.Support['1'].harness = {
			name: 'support',
			dependencies: { agents: [], workflows: [], tools: [], skills: [], mcpServers: [] },
			roots: { agents: ['support'], workflows: ['review'] },
		}
		snapshot.Support['1'].workflows = {
			review: { ...target, exportDigest: computeHarnessTargetExportDigest({ address, target }) },
		}
		await builder.generateEventBridgeClient(snapshot)
		const fixturePath = join(builder.getOutputPath(), 'src/proof.ts')
		await writeFile(
			fixturePath,
			`
import { EventBridgeClient } from './eventbridge_client.js'
import { supportTargetContract } from './generated/purista/support/v1/harness/agent/supportTargetContract.js'
import { reviewTargetContract } from './generated/purista/support/v1/harness/workflow/reviewTargetContract.js'
import { createRemoteHarnessClient, type EventBridge, type JsonValue } from '@purista/core'
type Exact<A, B> = [A] extends [B] ? [B] extends [A] ? true : false : false
type Assert<T extends true> = T
export type Wire = Assert<Exact<typeof supportTargetContract.$infer.input, { raw: string }>>
export type Validated = Assert<Exact<typeof supportTargetContract.$infer.validatedInput, { normalized: number }>>
export type Output = Assert<Exact<typeof supportTargetContract.$infer.output, { accepted: boolean }>>
export type Update = Assert<Exact<typeof supportTargetContract.$infer.update, JsonValue>>
export type Interrupt = Assert<Exact<typeof supportTargetContract.$infer.interrupt, never>>
export type Queue = Assert<Exact<typeof supportTargetContract.queue.name, 'support-jobs'>>
export type NoUpdate = Assert<Exact<typeof reviewTargetContract.$infer.update, never>>
declare const bridge: EventBridge
		const client = new EventBridgeClient(bridge, undefined, {
			identity: {
				principalId: 'principal-1',
				tenantId: 'tenant-1',
				traceId: 'trace-1',
				otp: 'otp-1',
			},
		})
client.agent.Support['1'].support.run({ raw: '12' })
client.agent.Support['1'].support.stream({ raw: '12' })
client.agent.Support['1'].support.enqueue({ raw: '12' })
client.workflow.Support['1'].review.run({ raw: '12' })
// @ts-expect-error Generated clients keep their configured sender name authoritative.
new EventBridgeClient(bridge, undefined, { senderName: 'untrusted-caller' })
// @ts-expect-error Unqueued workflow roots have no enqueue operation.
client.workflow.Support['1'].review.enqueue({ raw: '12' })
// @ts-expect-error Wire input is distinct from receiver-validated input.
client.agent.Support['1'].support.run({ normalized: 12 })
// @ts-expect-error Private composition dependencies are not client roots.
client.agent.Support['1']['private-child'].run({ raw: '12' })
// @ts-expect-error Spread removes the nominal class's private capability.
createRemoteHarnessClient({ ...supportTargetContract }, bridge)
const wrongOutput: typeof supportTargetContract.$infer.output =
// @ts-expect-error Output is declared by the independent result schema witness.
 { accepted: 'yes' }
`,
		)
		const program = ts.createProgram([fixturePath], {
			strict: true,
			target: ts.ScriptTarget.ES2022,
			module: ts.ModuleKind.ESNext,
			moduleResolution: ts.ModuleResolutionKind.Bundler,
			skipLibCheck: true,
			noEmit: true,
			paths: { '@purista/core': [resolve(import.meta.dirname, '../index.ts')] },
		})
		const diagnostics = ts
			.getPreEmitDiagnostics(program)
			.filter(diagnostic => diagnostic.file?.fileName.startsWith(builder.getOutputPath()))
		expect(diagnostics.map(diagnostic => ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'))).toEqual([])
	})

	it('leaves the prior complete generation unchanged if another root fails validation', async () => {
		const path = await mkdtemp(join(tmpdir(), 'p4-046-client-'))
		temporaryPaths.push(path)
		const builder = new ClientBuilder({ outputPath: 'generated-client' })
		builder.rootPath = path
		await builder.generateEventBridgeClient(definitions())
		const clientPath = join(builder.getOutputPath(), 'src/eventbridge_client.ts')
		await writeFile(clientPath, '// previous complete client')
		const invalid = {
			Support: {
				'1': {
					...definitions().Support['1'],
					agents: { support: root().target, other: { ...root().target, kind: 'tool' } },
				},
			},
		}
		await expect(builder.generateEventBridgeClient(invalid as never)).rejects.toThrow()
		expect(await readFile(clientPath, 'utf8')).toBe('// previous complete client')
	})

	it('rejects copied remote declarations before any transport effects and leaves wire input intact', async () => {
		const target = contract()
		const invoke = vi.fn<EventBridge['invoke']>()
		invoke.mockResolvedValue({
			sessionId: 'session-1',
			outcome: { status: 'completed', runId: 'run-1', output: { accepted: true } },
		})
		const openStream = vi.fn()
		const enqueue = vi.fn(async request => ({ jobId: 'job-1', queueName: request.queueName }))
		const transport = { instanceId: 'client-instance', invoke, openStream } as Pick<
			EventBridge,
			'instanceId' | 'invoke' | 'openStream'
		>
		const client = createRemoteHarnessClient(
			target,
			transport,
			{ enqueue },
			{
				identity: { principalId: 'principal-authentic', tenantId: 'tenant-authentic' },
			},
		)
		const wire = { raw: '12' }
		const result = await client.run(wire, { sessionId: 'session-1' })
		expect(result.outcome).toMatchObject({ status: 'completed', output: { accepted: true } })
		expect(invoke.mock.calls[0]?.[0].payload.payload).toBe(wire)
		expect(invoke.mock.calls[0]?.[0].harness?.contract.exportDigest).toBe(target.exportDigest)
		const receipt = await client.enqueue(
			wire,
			{},
			{
				headers: {
					application: 'retained',
					'purista.principalId': 'forged-principal',
					'purista.tenantId': 'forged-tenant',
				},
			},
		)
		expect(receipt).toMatchObject({ jobId: 'job-1', queueName: 'support-jobs' })
		expect(enqueue.mock.calls[0]?.[0].payload).toBe(wire)
		expect(enqueue.mock.calls[0]?.[0].parameter).toEqual({
			schemaVersion: 1,
			invocationId: receipt.sessionId,
			sessionId: receipt.sessionId,
			parameter: {},
		})
		expect(enqueue.mock.calls[0]?.[0].headers).toEqual({
			application: 'retained',
			'purista.principalId': 'principal-authentic',
			'purista.tenantId': 'tenant-authentic',
		})
		for (const copy of [
			{ ...target },
			Object.create(Object.getPrototypeOf(target), Object.getOwnPropertyDescriptors(target)),
		]) {
			expect(() => createRemoteHarnessClient(copy as never, transport, { enqueue })).toThrow('authentic')
		}
		expect(invoke).toHaveBeenCalledTimes(1)
		expect(enqueue).toHaveBeenCalledTimes(1)
		expect(openStream).not.toHaveBeenCalled()
	})
	it('uses the portable stream protocol and has no enqueue member for an unqueued contract', async () => {
		const base = root(false)
		const queued = contract()
		const { queue: _queue, ...target } = base.target
		const unqueued = createRemoteHarnessTargetContract({
			schemaVersion: 1,
			address: base.address,
			target,
			schemas: {
				input: queued.input,
				validatedInput: createGeneratedHarnessSchema<{ normalized: number }>(target.validatedInputSchema),
				output: queued.output,
			},
		})
		const outcome = { status: 'completed', runId: 'run-stream', output: { accepted: true } } as const
		const frames: StreamFrame<
			HarnessTargetExecutionEvent<typeof unqueued>,
			HarnessTargetExecutionTerminalOutcome<typeof unqueued>
		>[] = [
			{ payload: { frameType: 'start', sequence: 0 } },
			{
				payload: {
					frameType: 'chunk',
					sequence: 1,
					chunk: {
						type: 'run.started',
						eventId: 'start',
						sequence: 1,
						runId: outcome.runId,
						at: '2026-09-09T00:00:00.000Z',
					},
				},
			},
			{
				payload: {
					frameType: 'chunk',
					sequence: 2,
					chunk: {
						type: 'run.finished',
						eventId: 'finish',
						sequence: 2,
						runId: outcome.runId,
						at: '2026-09-09T00:00:01.000Z',
						outcome,
					},
				},
			},
			{ payload: { frameType: 'complete', sequence: 3, final: outcome } },
		] as StreamFrame<
			HarnessTargetExecutionEvent<typeof unqueued>,
			HarnessTargetExecutionTerminalOutcome<typeof unqueued>
		>[]
		const cancel = vi.fn(async () => undefined)
		const openStream = vi.fn<EventBridge['openStream']>().mockResolvedValue({
			sessionId: 'transport' as CorrelationId,
			cancel,
			async *[Symbol.asyncIterator]() {
				yield* frames
			},
		})
		const client = createRemoteHarnessClient(unqueued, { instanceId: 'client', invoke: vi.fn(), openStream } as Pick<
			EventBridge,
			'instanceId' | 'invoke' | 'openStream'
		>)
		expect(client).not.toHaveProperty('enqueue')
		const stream = await client.stream({ raw: '12' }, { sessionId: 'stream-session' })
		expectTypeOf(stream.result).toEqualTypeOf<Promise<HarnessTargetExecutionTerminalOutcome<typeof unqueued>>>()
		expect(stream.sessionId).toBe('stream-session')
		expect(await stream.result).toEqual(outcome)
		const events = []
		for await (const event of stream) events.push(event.type)
		expect(events).toEqual(['run.started', 'run.finished'])
		await stream.cancel('finished')
		expect(openStream.mock.calls[0]?.[0].payload.payload).toEqual({ raw: '12' })
	})
})
