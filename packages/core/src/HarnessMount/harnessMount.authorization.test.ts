import {
	type AnyHarnessTargetContract,
	defineAgent,
	defineHarness,
	defineTool,
	defineWorkflow,
	type ExecutionEvent,
	type ExecutionTerminalOutcome,
	type HarnessIdentity,
	type HarnessInterrupt,
	type HarnessTargetRunOutcome,
	InMemoryHarnessStorage,
	type JsonValue,
	type ToolApprovalResume,
} from '@purista/harness'
import {
	createHostOwnerToken,
	type HostedDispatchedTargetRequest,
	type HostedTargetRequest,
} from '@purista/harness/integrator'
import { FakeModelProvider, textReply } from '@purista/harness/testing'
import { describe, expect, expectTypeOf, it, vi } from 'vitest'

import { HandledError } from '../core/Error/HandledError.impl.js'
import type { Command } from '../core/types/commandType/Command.js'
import type { CommandResponse } from '../core/types/commandType/CommandResponse.js'
import { EBMessageType } from '../core/types/EBMessageType.enum.js'
import { StatusCode } from '../core/types/StatusCode.enum.js'
import type { StreamFrame } from '../core/types/stream/StreamFrame.js'
import type { StreamMessage } from '../core/types/stream/StreamMessage.js'
import type { StreamOpenRequest } from '../core/types/stream/StreamOpenRequest.js'
import { DefaultEventBridge } from '../DefaultEventBridge/DefaultEventBridge.impl.js'
import { getLoggerMock } from '../mocks/getLogger.mock.js'
import { getCommandMessageMock } from '../mocks/messages/getCommandMessage.mock.js'
import {
	generatedModelSchema as generatedSchema,
	projectionsFor,
	rootCommandRequest,
} from './harnessMount.test.fixture.js'
import { HarnessMountRuntime } from './runtime.js'
import type {
	HarnessBusinessGuardContext,
	HarnessMount,
	HarnessTargetPolicy,
	PuristaHostInvocation,
	PuristaToolContext,
} from './types.js'

type WireInput = { value: string }
type ValidatedInput = { normalized: string; length: number }
type GuardContext = HarnessBusinessGuardContext<Record<string, unknown>>

const wireJsonSchema = {
	type: 'object',
	additionalProperties: false,
	required: ['value'],
	properties: { value: { type: 'string' } },
} as const
const validatedJsonSchema = {
	type: 'object',
	additionalProperties: false,
	required: ['normalized', 'length'],
	properties: { normalized: { type: 'string' }, length: { type: 'number' } },
} as const
const owner = Object.freeze({ tenantId: 'tenant-a', principalId: 'stored-owner-private' })
const reviewer = Object.freeze({ tenantId: 'tenant-a', principalId: 'current-reviewer' })
const usage = { inputTokens: 1, outputTokens: 1, totalTokens: 2 }

function countedInput() {
	const counters = { validations: 0, transforms: 0 }
	const schema = generatedSchema<WireInput, ValidatedInput>(wireJsonSchema, validatedJsonSchema, value => {
		counters.validations += 1
		if (typeof value.value !== 'string') throw new Error('Expected one string value.')
		counters.transforms += 1
		const normalized = value.value.trim()
		return { normalized, length: normalized.length }
	})
	return { schema, counters }
}

function persistentStorage() {
	// This process-local adapter is a test double for the persistence capability;
	// its real checkpoint, immutable identity and atomic lease operations are retained.
	const storage = new InMemoryHarnessStorage()
	const capabilities = Object.freeze([...storage.capabilities, 'storage.persistent'] as const)
	Object.defineProperty(storage, 'capabilities', { value: capabilities })
	Object.defineProperty(storage, 'info', { value: Object.freeze({ ...storage.info, capabilities }) })
	return storage
}

function approvalDefinition(
	options: { storedOwner?: boolean; authorize?: (context: GuardContext) => Promise<void> } = {},
) {
	const input = countedInput()
	const effects: HarnessIdentity[] = []
	const tool = defineTool('reviewEffect', {
		description: 'Perform the approved effect.',
		input: generatedSchema<string, string>({ type: 'string' }),
		output: generatedSchema<string, string>({ type: 'string' }),
		async handler(context, value) {
			effects.push({ ...context.identity })
			return value
		},
	})
	const agent = defineAgent('review', {
		model: 'chat',
		input: input.schema,
		output: generatedSchema<string, string>({ type: 'string' }),
		instructions: 'Request review before the effect.',
		prompt: value => ({ role: 'user', content: value.normalized }),
		tools: [tool],
		governance: {
			policies: [
				{
					kind: 'native',
					id: 'reviewPolicy',
					rules: [{ id: 'reviewRule', tools: [tool.id], effect: 'require_approval' }],
				},
			],
		},
	})
	const definition = defineHarness({ name: 'authorizationHarness', revision: 'authorization-r1' }).addAgent(agent)
	const before = vi.fn(async (context: GuardContext, value: ValidatedInput) => {
		expectTypeOf(value).toEqualTypeOf<ValidatedInput>()
		await options.authorize?.(context)
	})
	const after = vi.fn((_context: GuardContext, _outcome: HarnessTargetRunOutcome<typeof agent.contract>) => {})
	const policy = {
		agents: {
			review: {
				beforeGuards: { authorize: before },
				afterGuards: { audit: after },
				...(options.storedOwner === false ? {} : { durableResume: { identity: 'run-owner' as const } }),
			},
		},
	}
	policy.agents.review satisfies HarnessTargetPolicy<typeof agent.contract, Record<string, unknown>>
	return { definition, agent, tool, policy, before, after, effects, ...input }
}

function responsePayload(response: CommandResponse) {
	if (response.messageType !== EBMessageType.CommandSuccessResponse) {
		throw new HandledError(response.payload.status, response.payload.message, response.payload.data)
	}
	return response.payload
}

function approvalResult(response: CommandResponse): ToolApprovalResume {
	const result = responsePayload(response) as {
		outcome: HarnessTargetRunOutcome<ReturnType<typeof approvalDefinition>['agent']['contract']>
	}
	if (result.outcome.status !== 'interrupted' || result.outcome.interrupt.type !== 'tool-approval') {
		throw new Error('Expected an approval interruption.')
	}
	const approval = result.outcome.interrupt.requests[0]
	if (!approval) throw new Error('Expected one approval request.')
	return {
		type: 'tool-approval',
		runId: result.outcome.runId,
		interruptId: result.outcome.interrupt.id,
		revision: result.outcome.interrupt.revision,
		eventId: 'review-event',
		decisions: [{ approvalId: approval.approvalId, approved: true }],
	}
}

type Terminal = ExecutionTerminalOutcome<JsonValue, HarnessInterrupt>
type HostedRequest = HostedTargetRequest<AnyHarnessTargetContract, PuristaHostInvocation>
type HostedStream = AsyncIterable<ExecutionEvent<JsonValue>> & {
	result: Promise<Terminal>
	cancel(reason?: string): Promise<void>
}
type HostedFacade = {
	runHosted(request: HostedRequest): Promise<Terminal>
	streamHosted(request: HostedRequest): Promise<HostedStream>
	streamDispatched(
		request: HostedDispatchedTargetRequest<AnyHarnessTargetContract, PuristaHostInvocation>,
	): Promise<HostedStream>
}

async function startAuthorizationFixture(options: { definition: object; policy?: object; ai?: object }) {
	const eventBridge = new DefaultEventBridge({ logger: getLoggerMock().mock })
	await eventBridge.start()
	const commandRegistration = vi.spyOn(eventBridge, 'registerCommand')
	const streamRegistration = vi.spyOn(eventBridge, 'registerStream')
	const publications = vi.spyOn(eventBridge, 'emitMessage')
	// The runtime owns an erased graph. Keep exact target types at call sites and
	// cross that invariant definition/configuration boundary only in this fixture.
	const definition = options.definition as HarnessMount['definition']
	const policy = options.policy as HarnessMount['policy']
	const config = (options.ai ?? { storage: persistentStorage() }) as ConstructorParameters<
		typeof HarnessMountRuntime
	>[0]['config']
	const runtime = new HarnessMountRuntime({
		serviceName: 'Harness',
		serviceVersion: '1',
		eventBridge,
		logger: getLoggerMock().mock,
		mount: { definition, policy, projections: projectionsFor(definition, policy) },
		config,
		resources: {},
		hostOwner: createHostOwnerToken<PuristaToolContext>(),
		createHostContext: () => {
			throw new Error('This fixture has no host tools.')
		},
	})
	await runtime.start()
	// Explicit integrator seam: the public lifecycle is real, but this one private
	// facade is observed/replaced to inspect exact Core-owned request fields.
	const hosted = Reflect.get(runtime, 'runtime') as HostedFacade
	return {
		runtime,
		eventBridge,
		hosted,
		publications,
		replaceHosted(replacement: Partial<HostedFacade>) {
			Reflect.set(runtime, 'runtime', { ...Reflect.get(runtime, 'runtime'), ...replacement })
		},
		command(target: string) {
			const registration = commandRegistration.mock.calls.find(([address]) => address.serviceTarget === target)
			if (!registration) throw new Error(`Missing command receiver ${target}.`)
			return registration[1]
		},
		stream(target: string) {
			const registration = streamRegistration.mock.calls.find(([address]) => address.serviceTarget === target)
			if (!registration) throw new Error(`Missing stream receiver ${target}.`)
			return registration[1]
		},
		frames() {
			return publications.mock.calls.flatMap(([message]) => {
				if (message.messageType !== EBMessageType.Stream) return []
				return [message.payload as StreamFrame['payload']]
			})
		},
		async stop() {
			try {
				await runtime.shutdown()
			} finally {
				await new Promise<void>(resolve => setImmediate(resolve))
				await eventBridge.destroy()
				commandRegistration.mockRestore()
				streamRegistration.mockRestore()
				publications.mockRestore()
			}
		},
	}
}

type ApprovalDefinition = ReturnType<typeof approvalDefinition>

function commandFor(
	definition: object,
	policy: object | undefined,
	targetName: string,
	parameter: Record<string, unknown> = {},
	identity: HarnessIdentity = reviewer,
	sessionId = 'authorization-session',
): Command {
	return getCommandMessageMock(
		rootCommandRequest(
			{ value: '  authorized value  ' },
			{
				definition: definition as HarnessMount['definition'],
				policy: policy as HarnessMount['policy'],
				targetName,
				parameter,
				...identity,
				sessionId,
			},
		),
	)
}

function asStream(command: Command): StreamOpenRequest {
	return { ...command, messageType: EBMessageType.Stream, payload: { ...command.payload, frameType: 'open' } }
}

function response(value: CommandResponse | undefined): CommandResponse {
	if (!value) throw new Error('Expected a receiver response.')
	return value
}

async function startApproval(options: Parameters<typeof approvalDefinition>[0] = {}) {
	const fixture = approvalDefinition(options)
	const storage = persistentStorage()
	const provider = new FakeModelProvider({ strict: true })
	provider.enqueueText(
		textReply('', {
			toolCalls: [{ id: 'reviewed-call', name: fixture.tool.id, arguments: 'approved effect' }],
			usage,
			finishReason: 'tool_calls',
		}),
	)
	const mounted = await startAuthorizationFixture({
		...fixture,
		ai: { models: { chat: { provider, model: 'fake' } }, storage },
	})
	const first = response(
		await mounted.command('review')(commandFor(fixture.definition, fixture.policy, 'review', {}, owner)),
	)
	const resume = approvalResult(first)
	const interruptedAfter = fixture.after.mock.calls.slice()
	fixture.before.mockClear()
	fixture.after.mockClear()
	fixture.counters.validations = 0
	fixture.counters.transforms = 0
	return { ...fixture, mounted, storage, provider, resume, interruptedAfter }
}

function resumeCommand(
	fixture: ApprovalDefinition & { resume: ToolApprovalResume },
	identity: HarnessIdentity = reviewer,
) {
	return commandFor(fixture.definition, fixture.policy, 'review', { resume: fixture.resume }, identity)
}

function deferred<Value>() {
	let resolve!: (value: Value) => void
	const promise = new Promise<Value>(done => {
		resolve = done
	})
	return { promise, resolve }
}

function echoDefinition(handler?: (input: ValidatedInput) => Promise<ValidatedInput>, input = countedInput()) {
	const executed = vi.fn(async (value: ValidatedInput) => (handler ? handler(value) : value))
	const workflow = defineWorkflow('echo', {
		input: input.schema,
		output: generatedSchema<ValidatedInput, ValidatedInput>(validatedJsonSchema),
		async handler(context) {
			expectTypeOf<typeof context.input>().toExtend<ValidatedInput>()
			expectTypeOf<ValidatedInput>().toExtend<typeof context.input>()
			return executed(context.input)
		},
	})
	const definition = defineHarness({ name: 'authorizationEcho', revision: 'authorization-r1' }).addWorkflow(workflow)
	return { ...input, definition, workflow, executed }
}

describe('P4-004 mounted Harness authorization', () => {
	it('validates and transforms fresh input once and authorizes the exact logical value as the current reviewer', async () => {
		const fixture = echoDefinition()
		expectTypeOf<(typeof fixture.workflow.contract)['$infer']['input']>().toExtend<WireInput>()
		expectTypeOf<WireInput>().toExtend<(typeof fixture.workflow.contract)['$infer']['input']>()
		expectTypeOf<(typeof fixture.workflow.contract)['$infer']['validatedInput']>().toExtend<ValidatedInput>()
		expectTypeOf<ValidatedInput>().toExtend<(typeof fixture.workflow.contract)['$infer']['validatedInput']>()
		const order: string[] = []
		const before = vi.fn((context: GuardContext, input: ValidatedInput) => {
			expectTypeOf(input).toEqualTypeOf<ValidatedInput>()
			expect(context.identity).toEqual(reviewer)
			expect(context.message.principalId).toBe(reviewer.principalId)
			expect(input).toEqual({ normalized: 'authorized value', length: 16 })
			expect(Object.isFrozen(input)).toBe(true)
			order.push('before')
		})
		const after = vi.fn(
			(_context: GuardContext, outcome: HarnessTargetRunOutcome<typeof fixture.workflow.contract>) => {
				expectTypeOf(outcome).toEqualTypeOf<HarnessTargetRunOutcome<typeof fixture.workflow.contract>>()
				order.push(`after:${outcome.status}`)
			},
		)
		const policy = {
			workflows: { echo: { beforeGuards: { authorize: before }, afterGuards: { audit: after } } },
		}
		policy.workflows.echo satisfies HarnessTargetPolicy<typeof fixture.workflow.contract, Record<string, unknown>>
		const mounted = await startAuthorizationFixture({ ...fixture, policy })
		let sentInput: unknown
		let authorizedInput: unknown
		mounted.replaceHosted({
			async runHosted(request) {
				if (request.delivery !== 'fresh') throw new Error('Expected fresh delivery.')
				sentInput = request.input
				return mounted.hosted.runHosted({
					...request,
					authorize: authorization => {
						authorizedInput = authorization.input
						return request.authorize(authorization)
					},
				})
			},
		})
		try {
			const reply = response(await mounted.command('echo')(commandFor(fixture.definition, policy, 'echo')))
			expect(responsePayload(reply)).toMatchObject({
				outcome: { status: 'completed', output: { normalized: 'authorized value', length: 16 } },
			})
			expect(fixture.counters).toEqual({ validations: 1, transforms: 1 })
			expect(before).toHaveBeenCalledOnce()
			expect(before.mock.calls[0]?.[1]).toEqual(sentInput)
			expect(before.mock.calls[0]?.[1]).toBe(authorizedInput)
			expect(fixture.executed).toHaveBeenCalledOnce()
			expect(order).toEqual(['before', 'after:completed'])
		} finally {
			await mounted.stop()
		}
	})

	it('skips validation and transformation on resume, omits own input/idempotencyKey, and separates reviewer from stored owner', async () => {
		const fixture = await startApproval()
		expect(fixture.interruptedAfter).toHaveLength(1)
		expect(fixture.interruptedAfter[0]?.[1]).toMatchObject({ status: 'interrupted', runId: fixture.resume.runId })
		let requestSeen: HostedRequest | undefined
		fixture.mounted.replaceHosted({
			async runHosted(request) {
				requestSeen = request
				return fixture.mounted.hosted.runHosted(request)
			},
		})
		fixture.provider.enqueueText(textReply('approved', { toolCalls: [], usage, finishReason: 'stop' }))
		try {
			const reply = response(await fixture.mounted.command('review')(resumeCommand(fixture)))
			expect(responsePayload(reply)).toMatchObject({
				outcome: { status: 'completed', runId: fixture.resume.runId, output: 'approved' },
			})
			expect(requestSeen?.delivery).toBe('resume')
			expect(requestSeen && Object.hasOwn(requestSeen, 'input')).toBe(false)
			expect(requestSeen && Object.hasOwn(requestSeen.invokeOptions, 'idempotencyKey')).toBe(false)
			expect(requestSeen?.invokeOptions).toMatchObject({ resumeIdentity: 'stored-run-owner', resume: fixture.resume })
			expect(requestSeen?.hostInvocation.identity).toEqual(reviewer)
			expect(fixture.counters).toEqual({ validations: 0, transforms: 0 })
			expect(fixture.before).toHaveBeenCalledOnce()
			expect(fixture.before.mock.calls[0]?.[0].identity).toEqual(reviewer)
			expect(fixture.before.mock.calls[0]?.[1]).toEqual({ normalized: 'authorized value', length: 16 })
			expect(Object.isFrozen(fixture.before.mock.calls[0]?.[1])).toBe(true)
			expect(fixture.after).toHaveBeenCalledOnce()
			expect(fixture.after.mock.calls[0]?.[0].identity).toEqual(reviewer)
			expect(fixture.effects).toEqual([owner])
			expect((await fixture.storage.getSession('authorization-session'))?.identity).toEqual(owner)
			expect(JSON.stringify(reply)).not.toContain(owner.principalId)
			fixture.provider.assertExhausted()
		} finally {
			await fixture.mounted.stop()
		}
	})

	it.each([
		['cross-tenant', { tenantId: 'tenant-b', principalId: 'current-reviewer' }, 409],
		['missing tenant', { principalId: 'current-reviewer' }, 409],
		['missing principal', { tenantId: 'tenant-a' }, 409],
		['empty principal', { tenantId: 'tenant-a', principalId: '' }, 400],
	] as const)('rejects a %s reviewer before guards, leases or execution', async (_label, identity, status) => {
		const fixture = await startApproval()
		const acquire = vi.spyOn(fixture.storage, 'acquireRun')
		const beforeEvents = await fixture.storage.listEvents(fixture.resume.runId)
		try {
			const command = resumeCommand(fixture)
			const message = {
				...command,
				tenantId: 'tenantId' in identity ? identity.tenantId : undefined,
				principalId: 'principalId' in identity ? identity.principalId : undefined,
			}
			const reply = response(await fixture.mounted.command('review')(message))
			expect(reply).toMatchObject({ messageType: EBMessageType.CommandErrorResponse, payload: { status } })
			expect(fixture.before).not.toHaveBeenCalled()
			expect(fixture.after).not.toHaveBeenCalled()
			expect(acquire).not.toHaveBeenCalled()
			expect(fixture.effects).toEqual([])
			expect(fixture.provider.requests).toHaveLength(1)
			expect(await fixture.storage.listEvents(fixture.resume.runId)).toEqual(beforeEvents)
			expect(JSON.stringify(reply)).not.toContain(owner.principalId)
		} finally {
			acquire.mockRestore()
			await fixture.mounted.stop()
		}
	})

	it('keeps current-caller identity matching active when stored-run-owner policy is absent', async () => {
		const fixture = await startApproval({ storedOwner: false })
		try {
			const reply = response(await fixture.mounted.command('review')(resumeCommand(fixture)))
			expect(reply).toMatchObject({ messageType: EBMessageType.CommandErrorResponse, payload: { status: 409 } })
			expect(fixture.before).not.toHaveBeenCalled()
			expect(fixture.effects).toEqual([])
			expect(fixture.provider.requests).toHaveLength(1)
		} finally {
			await fixture.mounted.stop()
		}
	})

	it('rejects an invalid stored owner before authorization and sanitizes operational storage failures', async () => {
		const fixture = await startApproval()
		const original = fixture.storage.getSession.bind(fixture.storage)
		const session = await original('authorization-session')
		if (!session) throw new Error('Expected stored session.')
		const lookup = vi.spyOn(fixture.storage, 'getSession')
		try {
			lookup.mockResolvedValue({ ...session, identity: { tenantId: 'tenant-a' } })
			const invalid = response(await fixture.mounted.command('review')(resumeCommand(fixture)))
			expect(invalid).toMatchObject({ payload: { status: 409 } })
			lookup.mockRejectedValue(new Error('private storage credential'))
			const failed = response(await fixture.mounted.command('review')(resumeCommand(fixture)))
			expect(failed).toMatchObject({ payload: { status: 500, message: 'Harness execution failed.' } })
			expect(JSON.stringify(failed)).not.toContain('private storage credential')
			expect(fixture.before).not.toHaveBeenCalled()
			expect(fixture.effects).toEqual([])
			expect(fixture.provider.requests).toHaveLength(1)
		} finally {
			lookup.mockRestore()
			await fixture.mounted.stop()
		}
	})

	it.each(['before', 'after'] as const)(
		'preserves HandledError from %s guards and sanitizes unknown guard errors for aggregate and stream',
		async phase => {
			for (const handled of [true, false]) {
				for (const delivery of ['aggregate', 'stream'] as const) {
					const fixture = echoDefinition()
					const guard = vi.fn(() => {
						throw handled
							? new HandledError(StatusCode.Forbidden, 'Review denied.', { reason: 'not_assigned' }, 'guard-trace')
							: new Error('private guard credential')
					})
					const policy = {
						workflows: {
							echo: {
								...(phase === 'before' ? { beforeGuards: { authorize: guard } } : { afterGuards: { audit: guard } }),
							},
						},
					}
					const mounted = await startAuthorizationFixture({ ...fixture, policy })
					const command = commandFor(fixture.definition, policy, 'echo')
					try {
						const status = handled ? 403 : 500
						const message = handled ? 'Review denied.' : 'Harness business guard failed.'
						let exposed: unknown
						if (delivery === 'aggregate') {
							const reply = response(await mounted.command('echo')(command))
							expect(reply).toMatchObject({
								messageType: EBMessageType.CommandErrorResponse,
								payload: { status, message },
							})
							if (handled)
								expect(reply.payload).toMatchObject({ data: { reason: 'not_assigned' }, traceId: 'guard-trace' })
							exposed = reply
						} else {
							await mounted.stream('echo')(asStream(command))
							const frames = mounted.frames()
							if (phase === 'before') {
								expect(frames).toEqual([
									expect.objectContaining({ frameType: 'error', error: expect.objectContaining({ status, message }) }),
								])
							} else {
								const complete = frames.find(frame => frame.frameType === 'complete')
								expect(complete).toMatchObject({ final: { status: 'failed', error: { message, meta: { status } } } })
								if (handled)
									expect(complete).toMatchObject({ final: { error: { meta: { data: { reason: 'not_assigned' } } } } })
								expect(frames.some(frame => frame.frameType === 'error')).toBe(false)
							}
							exposed = frames
						}
						expect(guard).toHaveBeenCalledOnce()
						expect(fixture.executed).toHaveBeenCalledTimes(phase === 'before' ? 0 : 1)
						expect(JSON.stringify(exposed)).not.toContain('private guard credential')
					} finally {
						await mounted.stop()
					}
				}
			}
		},
	)

	it.each(['failed', 'cancelled'] as const)(
		'skips after guards for an authoritative %s stream outcome',
		async status => {
			const fixture = echoDefinition()
			const after = vi.fn()
			const policy = { workflows: { echo: { afterGuards: { audit: after } } } }
			const mounted = await startAuthorizationFixture({ ...fixture, policy })
			const terminal: Terminal = {
				status,
				runId: 'terminal-run',
				error: { code: 'PRIVATE_ERROR', message: 'private execution detail', category: 'internal', retriable: false },
			}
			mounted.replaceHosted({
				async streamHosted(request) {
					if (request.delivery !== 'fresh') throw new Error('Expected fresh request.')
					await request.authorize({ delivery: 'fresh', target: request.target, input: request.input })
					return {
						result: Promise.resolve(terminal),
						cancel: async () => {},
						async *[Symbol.asyncIterator]() {
							yield {
								type: 'run.started',
								runId: terminal.runId,
								eventId: 'start',
								sequence: 0,
								at: '2026-09-09T00:00:00.000Z',
							} as const
							yield {
								type: 'run.finished',
								runId: terminal.runId,
								eventId: 'finish',
								sequence: 1,
								at: '2026-09-09T00:00:00.001Z',
								outcome: terminal,
							} as const
						},
					}
				},
			})
			try {
				await mounted.stream('echo')(asStream(commandFor(fixture.definition, policy, 'echo')))
				expect(after).not.toHaveBeenCalled()
				expect(mounted.frames()).toContainEqual(
					expect.objectContaining({
						frameType: 'complete',
						final: expect.objectContaining({ status, runId: terminal.runId }),
					}),
				)
				expect(JSON.stringify(mounted.frames())).not.toContain('private execution detail')
			} finally {
				await mounted.stop()
			}
		},
	)

	it('disables the receiver and Harness timeout with timeoutMs: false', async () => {
		const entered = deferred<void>()
		const release = deferred<void>()
		const fixture = echoDefinition(async input => {
			entered.resolve()
			await release.promise
			return input
		})
		const mounted = await startAuthorizationFixture(fixture)
		vi.useFakeTimers()
		try {
			let settled = false
			const pending = mounted
				.command('echo')(commandFor(fixture.definition, undefined, 'echo', { timeoutMs: false }))
				.then(value => {
					settled = true
					return response(value)
				})
			await entered.promise
			await vi.advanceTimersByTimeAsync(600_000)
			expect(settled).toBe(false)
			release.resolve()
			expect(responsePayload(await pending)).toMatchObject({ outcome: { status: 'completed' } })
		} finally {
			release.resolve()
			vi.useRealTimers()
			await mounted.stop()
		}
	})

	it('returns aggregate 504 after an authorization deadline without creating a session, run or effect', async () => {
		const entered = deferred<void>()
		const release = deferred<void>()
		const fixture = echoDefinition()
		const storage = persistentStorage()
		const authorize = vi.fn(async () => {
			entered.resolve()
			await release.promise
		})
		const policy = { workflows: { echo: { beforeGuards: { authorize } } } }
		const mounted = await startAuthorizationFixture({ ...fixture, policy, ai: { storage } })
		vi.useFakeTimers()
		try {
			const pending = mounted.command('echo')(commandFor(fixture.definition, policy, 'echo', { timeoutMs: 10 }))
			await entered.promise
			await vi.advanceTimersByTimeAsync(11)
			expect(response(await pending)).toMatchObject({ payload: { status: 504 } })
			release.resolve()
			await Promise.resolve()
			expect(await storage.getSession('authorization-session')).toBeUndefined()
			expect(await storage.listRuns('authorization-session')).toEqual([])
			expect(fixture.executed).not.toHaveBeenCalled()
		} finally {
			release.resolve()
			vi.useRealTimers()
			await mounted.stop()
		}
	})

	it.each(['aggregate timeout', 'nested deadline', 'nested consumer cancel'] as const)(
		'settles %s and shutdown while input validation remains pending',
		async interruption => {
			const entered = deferred<void>()
			const release = deferred<void>()
			const input = countedInput()
			let validationReleased = false
			const validate = vi.fn(async (value: unknown) => {
				entered.resolve()
				await release.promise
				validationReleased = true
				return input.schema['~standard'].validate(value)
			})
			const fixture = echoDefinition(undefined, {
				...input,
				schema: { '~standard': { ...input.schema['~standard'], validate } },
			})
			const before = vi.fn()
			const after = vi.fn()
			const policy = {
				workflows: {
					echo: {
						beforeGuards: { authorize: before },
						afterGuards: { audit: after },
						successEvent: 'authorization.completed',
					},
				},
			}
			const storage = persistentStorage()
			const mounted = await startAuthorizationFixture({ ...fixture, policy, ai: { storage } })
			const runHosted = vi.fn(mounted.hosted.runHosted)
			const streamDispatched = vi.fn(mounted.hosted.streamDispatched)
			mounted.replaceHosted({ runHosted, streamDispatched })
			let settled = false
			let reply: CommandResponse | undefined
			let pending: Promise<void> | undefined
			vi.useFakeTimers()
			try {
				const command = commandFor(
					fixture.definition,
					policy,
					'echo',
					interruption === 'aggregate timeout' ? { timeoutMs: 10 } : {},
				)
				const contract = command.harness?.contract
				if (!contract) throw new Error('Expected the target contract envelope.')
				const open: StreamOpenRequest = {
					...asStream(command),
					harness: {
						contract,
						dispatch: {
							sessionId: 'authorization-session',
							rootRunId: 'root-run',
							parentRunId: 'parent-run',
							invocationId: 'nested-invocation',
							parentWorkflowId: 'parent-workflow',
							depth: 1,
							remainingDepth: 1,
							...(interruption === 'nested deadline' ? { deadline: Date.now() + 10 } : {}),
						},
					},
				}
				pending =
					interruption === 'aggregate timeout'
						? mounted
								.command('echo')(command)
								.then(value => {
									reply = response(value)
									settled = true
								})
						: Promise.resolve(mounted.stream('echo')(open)).then(() => {
								settled = true
							})
				await entered.promise
				expect(settled).toBe(false)
				if (interruption === 'nested consumer cancel') {
					const cancel: StreamMessage = {
						...open,
						receiver: { ...open.receiver, instanceId: mounted.eventBridge.instanceId },
						payload: { frameType: 'cancel' },
					}
					await mounted.stream('echo')(cancel)
					await vi.advanceTimersByTimeAsync(0)
				} else await vi.advanceTimersByTimeAsync(11)
				expect(settled).toBe(true)
				expect(validationReleased).toBe(false)
				expect(validate).toHaveBeenCalledOnce()
				const frames = mounted.frames()
				if (interruption === 'aggregate timeout') {
					expect(reply).toMatchObject({ messageType: EBMessageType.CommandErrorResponse, payload: { status: 504 } })
					expect(frames).toEqual([])
				} else
					expect(frames).toEqual([
						expect.objectContaining({
							frameType: 'error',
							error: expect.objectContaining({ status: interruption === 'nested deadline' ? 504 : 408 }),
						}),
					])
				expect(before).not.toHaveBeenCalled()
				expect(after).not.toHaveBeenCalled()
				expect(runHosted).not.toHaveBeenCalled()
				expect(streamDispatched).not.toHaveBeenCalled()
				expect(fixture.executed).not.toHaveBeenCalled()
				expect(await storage.getSession('authorization-session')).toBeUndefined()
				expect(await storage.listRuns('authorization-session')).toEqual([])
				let shutdownSettled = false
				const shutdown = mounted.runtime.shutdown().then(() => {
					shutdownSettled = true
				})
				await vi.advanceTimersByTimeAsync(0)
				expect(shutdownSettled).toBe(true)
				expect(validationReleased).toBe(false)
				await shutdown
				release.resolve()
				await vi.advanceTimersByTimeAsync(0)
				expect(validationReleased).toBe(true)
				expect(before).not.toHaveBeenCalled()
				expect(after).not.toHaveBeenCalled()
				expect(runHosted).not.toHaveBeenCalled()
				expect(streamDispatched).not.toHaveBeenCalled()
				expect(fixture.executed).not.toHaveBeenCalled()
				expect(mounted.frames()).toEqual(frames)
				expect(
					mounted.publications.mock.calls.some(([message]) => message.eventName === 'authorization.completed'),
				).toBe(false)
			} finally {
				release.resolve()
				vi.useRealTimers()
				await pending
				await mounted.stop()
			}
		},
	)

	it('settles aggregate 504 and shutdown while an after guard remains pending', async () => {
		const entered = deferred<void>()
		const release = deferred<void>()
		const fixture = echoDefinition()
		let guardReleased = false
		const after = vi.fn(async () => {
			entered.resolve()
			await release.promise
			guardReleased = true
		})
		const laterGuard = vi.fn()
		const policy = {
			workflows: {
				echo: {
					afterGuards: { block: after, later: laterGuard },
					successEvent: 'authorization.completed',
				},
			},
		}
		const mounted = await startAuthorizationFixture({ ...fixture, policy })
		let reply: CommandResponse | undefined
		let pending: Promise<void> | undefined
		vi.useFakeTimers()
		try {
			pending = mounted
				.command('echo')(commandFor(fixture.definition, policy, 'echo', { timeoutMs: 10 }))
				.then(value => {
					reply = response(value)
				})
			await entered.promise
			expect(reply).toBeUndefined()
			await vi.advanceTimersByTimeAsync(11)
			expect(reply).toMatchObject({ messageType: EBMessageType.CommandErrorResponse, payload: { status: 504 } })
			expect(guardReleased).toBe(false)
			expect(after).toHaveBeenCalledOnce()
			expect(laterGuard).not.toHaveBeenCalled()
			expect(mounted.publications.mock.calls.some(([message]) => message.eventName === 'authorization.completed')).toBe(
				false,
			)
			let shutdownSettled = false
			const shutdown = mounted.runtime.shutdown().then(() => {
				shutdownSettled = true
			})
			await vi.advanceTimersByTimeAsync(0)
			expect(shutdownSettled).toBe(true)
			expect(guardReleased).toBe(false)
			await shutdown
			release.resolve()
			await vi.advanceTimersByTimeAsync(0)
			expect(laterGuard).not.toHaveBeenCalled()
			expect(mounted.publications.mock.calls.some(([message]) => message.eventName === 'authorization.completed')).toBe(
				false,
			)
		} finally {
			release.resolve()
			vi.useRealTimers()
			await pending
			await mounted.stop()
		}
	})

	it.each(['deadline', 'consumer cancel'] as const)(
		'settles one stream terminal and shutdown after %s while an after guard remains pending',
		async interruption => {
			const entered = deferred<string>()
			const release = deferred<void>()
			const fixture = echoDefinition()
			let guardReleased = false
			const after = vi.fn(
				async (_context: GuardContext, outcome: HarnessTargetRunOutcome<typeof fixture.workflow.contract>) => {
					entered.resolve(outcome.runId)
					await release.promise
					guardReleased = true
				},
			)
			const laterGuard = vi.fn()
			const policy = {
				workflows: {
					echo: {
						afterGuards: { block: after, later: laterGuard },
						successEvent: 'authorization.completed',
					},
				},
			}
			const mounted = await startAuthorizationFixture({ ...fixture, policy })
			const open = asStream(
				commandFor(fixture.definition, policy, 'echo', {
					timeoutMs: interruption === 'deadline' ? 10 : false,
				}),
			)
			let settled = false
			let pending: Promise<void> | undefined
			vi.useFakeTimers()
			try {
				pending = Promise.resolve(mounted.stream('echo')(open)).then(() => {
					settled = true
				})
				const runId = await entered.promise
				expect(settled).toBe(false)
				expect(mounted.frames().filter(frame => frame.frameType === 'start')).toHaveLength(1)
				expect(mounted.frames().filter(frame => frame.frameType === 'complete')).toEqual([])
				if (interruption === 'deadline') await vi.advanceTimersByTimeAsync(11)
				else {
					const cancel: StreamMessage = {
						...open,
						receiver: { ...open.receiver, instanceId: mounted.eventBridge.instanceId },
						payload: { frameType: 'cancel' },
					}
					await mounted.stream('echo')(cancel)
					await vi.advanceTimersByTimeAsync(0)
				}
				expect(settled).toBe(true)
				expect(guardReleased).toBe(false)
				expect(after).toHaveBeenCalledOnce()
				expect(laterGuard).not.toHaveBeenCalled()
				const expected = {
					runId,
					status: interruption === 'deadline' ? 'failed' : 'cancelled',
					error: {
						code: interruption === 'deadline' ? 'OPERATION_TIMEOUT' : 'OPERATION_CANCELLED',
						category: interruption === 'deadline' ? 'timeout' : 'cancelled',
						meta: { status: interruption === 'deadline' ? 504 : 408 },
					},
				}
				const frames = mounted.frames()
				const terminals = frames.flatMap(frame => {
					if (
						frame.frameType !== 'chunk' ||
						typeof frame.chunk !== 'object' ||
						frame.chunk === null ||
						!('type' in frame.chunk) ||
						frame.chunk.type !== 'run.finished'
					)
						return []
					return [frame.chunk]
				})
				expect(terminals).toHaveLength(1)
				expect(terminals[0]).toMatchObject({ outcome: expected })
				const completes = frames.filter(frame => frame.frameType === 'complete')
				expect(completes).toHaveLength(1)
				expect(completes[0]).toMatchObject({ final: expected })
				expect(terminals[0]).toMatchObject({ outcome: completes[0]?.final })
				expect(frames.some(frame => frame.frameType === 'error')).toBe(false)
				expect(
					mounted.publications.mock.calls.some(([message]) => message.eventName === 'authorization.completed'),
				).toBe(false)
				let shutdownSettled = false
				const shutdown = mounted.runtime.shutdown().then(() => {
					shutdownSettled = true
				})
				await vi.advanceTimersByTimeAsync(0)
				expect(shutdownSettled).toBe(true)
				expect(guardReleased).toBe(false)
				await shutdown
				release.resolve()
				await vi.advanceTimersByTimeAsync(0)
				expect(mounted.frames()).toEqual(frames)
				expect(laterGuard).not.toHaveBeenCalled()
				expect(
					mounted.publications.mock.calls.some(([message]) => message.eventName === 'authorization.completed'),
				).toBe(false)
			} finally {
				release.resolve()
				vi.useRealTimers()
				await pending
				await mounted.stop()
			}
		},
	)

	it('turns an elapsed post-start stream deadline into failed OPERATION_TIMEOUT and cancels the hosted stream', async () => {
		const fixture = echoDefinition()
		const after = vi.fn()
		const policy = { workflows: { echo: { afterGuards: { audit: after } } } }
		const mounted = await startAuthorizationFixture({ ...fixture, policy })
		const blocked = deferred<void>()
		const cancel = vi.fn(async () => {
			blocked.resolve()
		})
		const neverResult = deferred<Terminal>()
		mounted.replaceHosted({
			async streamHosted() {
				return {
					result: neverResult.promise,
					cancel,
					async *[Symbol.asyncIterator]() {
						yield {
							type: 'run.started',
							runId: 'timeout-run',
							eventId: 'timeout-start',
							sequence: 0,
							at: '2026-09-09T00:00:00.000Z',
						} as const
						await blocked.promise
					},
				}
			},
		})
		vi.useFakeTimers()
		try {
			const pending = mounted.stream('echo')(
				asStream(commandFor(fixture.definition, policy, 'echo', { timeoutMs: 10 })),
			)
			await vi.advanceTimersByTimeAsync(0)
			expect(mounted.frames().some(frame => frame.frameType === 'start')).toBe(true)
			await vi.advanceTimersByTimeAsync(11)
			await pending
			expect(cancel).toHaveBeenCalledOnce()
			expect(after).not.toHaveBeenCalled()
			expect(mounted.frames()).toContainEqual(
				expect.objectContaining({
					frameType: 'complete',
					final: expect.objectContaining({
						status: 'failed',
						runId: 'timeout-run',
						error: expect.objectContaining({ code: 'OPERATION_TIMEOUT', category: 'timeout', meta: { status: 504 } }),
					}),
				}),
			)
			expect(mounted.frames().some(frame => frame.frameType === 'error')).toBe(false)
		} finally {
			blocked.resolve()
			vi.useRealTimers()
			await mounted.stop()
		}
	})

	it('rechecks cancellation after an asynchronous resume guard before acquiring a lease or executing effects', async () => {
		const entered = deferred<void>()
		const release = deferred<void>()
		const fixture = await startApproval({
			authorize: async context => {
				if (context.identity.principalId === reviewer.principalId) {
					entered.resolve()
					await release.promise
				}
			},
		})
		const acquire = vi.spyOn(fixture.storage, 'acquireRun')
		const beforeEvents = await fixture.storage.listEvents(fixture.resume.runId)
		const open = asStream(resumeCommand(fixture))
		try {
			const pending = fixture.mounted.stream('review')(open)
			await entered.promise
			const cancel: StreamMessage = {
				...open,
				receiver: { ...open.receiver, instanceId: fixture.mounted.eventBridge.instanceId },
				payload: { frameType: 'cancel' },
			}
			await fixture.mounted.stream('review')(cancel)
			release.resolve()
			await pending
			expect(acquire).not.toHaveBeenCalled()
			expect(fixture.effects).toEqual([])
			expect(fixture.provider.requests).toHaveLength(1)
			expect(await fixture.storage.listEvents(fixture.resume.runId)).toEqual(beforeEvents)
			expect(fixture.mounted.frames()).toEqual([
				expect.objectContaining({ frameType: 'error', error: expect.objectContaining({ status: 408 }) }),
			])
		} finally {
			release.resolve()
			acquire.mockRestore()
			await fixture.mounted.stop()
		}
	})

	it('allows only one competing authorized resume to acquire the run and execute effects', async () => {
		const bothEntered = deferred<void>()
		let authorizations = 0
		const fixture = await startApproval({
			authorize: async context => {
				if (context.identity.principalId !== reviewer.principalId) return
				authorizations += 1
				if (authorizations === 2) bothEntered.resolve()
				await bothEntered.promise
			},
		})
		fixture.provider.enqueueText(textReply('approved once', { toolCalls: [], usage, finishReason: 'stop' }))
		try {
			const replies = await Promise.all([
				fixture.mounted.command('review')(resumeCommand(fixture)),
				fixture.mounted.command('review')(resumeCommand(fixture)),
			])
			expect(fixture.before).toHaveBeenCalledTimes(2)
			expect(replies.filter(reply => reply?.messageType === EBMessageType.CommandSuccessResponse)).toHaveLength(1)
			expect(replies.filter(reply => reply?.messageType === EBMessageType.CommandErrorResponse)).toEqual([
				expect.objectContaining({ payload: expect.objectContaining({ status: 409 }) }),
			])
			expect(fixture.effects).toEqual([owner])
			expect(fixture.provider.requests).toHaveLength(2)
			expect(fixture.after).toHaveBeenCalledOnce()
			expect(fixture.counters).toEqual({ validations: 0, transforms: 0 })
		} finally {
			bothEntered.resolve()
			await fixture.mounted.stop()
		}
	})
})
