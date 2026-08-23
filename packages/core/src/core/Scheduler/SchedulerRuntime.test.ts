import { describe, expect, it } from 'vitest'
import { getEventBridgeMock } from '../../mocks/getEventBridge.mock.js'
import { SchedulerBuilder } from '../../SchedulerBuilder/SchedulerBuilder.impl.js'
import { DefaultSchedulerProvider } from './DefaultSchedulerProvider.impl.js'
import { SchedulerRuntime } from './SchedulerRuntime.impl.js'
import type { SchedulerClock, SchedulerRegistration } from './types.js'

const createClock = (initialNow = 0): SchedulerClock & { advanceBy(milliseconds: number): void } => {
	let now = initialNow
	return {
		now: () => now,
		setTimeout: () => ({}) as ReturnType<typeof setTimeout>,
		clearTimeout: () => undefined,
		advanceBy: milliseconds => {
			now += milliseconds
		},
	}
}

const schedule = (overrides: Partial<SchedulerRegistration> = {}): SchedulerRegistration => ({
	scheduleKey: 'billing/1/monthly-billing-cycle',
	scheduleName: 'monthly-billing-cycle',
	targetKind: 'event',
	targetName: 'billing.monthlyCycleDue',
	expression: { kind: 'interval', everyMs: 1_000 },
	schedulerGroup: 'billing',
	...overrides,
})

describe('SchedulerRuntime', () => {
	it('publishes a trigger event without instantiating a business service', async () => {
		const clock = createClock()
		const eventBridge = getEventBridgeMock()
		const runtime = new SchedulerRuntime({
			registrations: [schedule()],
			eventBridge: eventBridge.mock,
			provider: new DefaultSchedulerProvider(),
			schedulerGroup: 'billing',
			clock,
		})

		await runtime.start()
		clock.advanceBy(1_000)
		await runtime.tick()

		expect(eventBridge.stubs.emitMessage.callCount).toBe(1)
		expect(eventBridge.stubs.emitMessage.firstCall.args[0]).toMatchObject({
			eventName: 'billing.monthlyCycleDue',
			schedule: {
				scheduleKey: 'billing/1/monthly-billing-cycle',
				scheduleName: 'monthly-billing-cycle',
				scheduledAt: '1970-01-01T00:00:01.000Z',
			},
		})

		await runtime.destroy()
	})

	it('exposes deterministic JSON-safe runtime and publication status', async () => {
		const clock = createClock()
		const eventBridge = getEventBridgeMock()
		const runtime = new SchedulerRuntime({
			registrations: [schedule()],
			eventBridge: eventBridge.mock,
			provider: new DefaultSchedulerProvider(),
			schedulerGroup: 'billing',
			clock,
		})

		await runtime.start()
		clock.advanceBy(1_000)
		await runtime.tick()

		expect(runtime.getRuntimeStatus()).toEqual({
			started: true,
			schedulerGroup: 'billing',
			provider: {
				name: 'DefaultSchedulerProvider',
				capabilities: {
					durableOccurrenceState: false,
					distributedOccurrenceClaims: false,
					idempotentPublication: false,
				},
			},
			schedules: [
				{
					scheduleKey: 'billing/1/monthly-billing-cycle',
					scheduleName: 'monthly-billing-cycle',
					schedulerGroup: 'billing',
					targetKind: 'event',
					targetName: 'billing.monthlyCycleDue',
					enabled: true,
					paused: false,
					lastEvaluatedAt: '1970-01-01T00:00:01.000Z',
					lastAttemptedAt: '1970-01-01T00:00:01.000Z',
					lastAttemptedScheduledAt: '1970-01-01T00:00:01.000Z',
					lastPublishedAt: '1970-01-01T00:00:01.000Z',
					lastPublishedScheduledAt: '1970-01-01T00:00:01.000Z',
					lastPublicationLagMs: 0,
					nextOccurrenceAt: '1970-01-01T00:00:02.000Z',
					lastErrorCode: undefined,
					lastAttemptedOccurrenceId: expect.any(String),
					lastPublishedOccurrenceId: expect.any(String),
				},
			],
		})

		await runtime.destroy()
	})

	it('allows only one active publisher for a shared provider occurrence', async () => {
		const clock = createClock()
		const provider = new DefaultSchedulerProvider()
		const firstBridge = getEventBridgeMock()
		const secondBridge = getEventBridgeMock()
		const first = new SchedulerRuntime({
			registrations: [schedule()],
			eventBridge: firstBridge.mock,
			provider,
			schedulerGroup: 'billing',
			clock,
		})
		const second = new SchedulerRuntime({
			registrations: [schedule()],
			eventBridge: secondBridge.mock,
			provider,
			schedulerGroup: 'billing',
			clock,
		})

		await Promise.all([first.start(), second.start()])
		clock.advanceBy(1_000)
		await Promise.all([first.tick(), second.tick()])

		expect(firstBridge.stubs.emitMessage.callCount + secondBridge.stubs.emitMessage.callCount).toBe(1)

		await Promise.all([first.destroy(), second.destroy()])
	})

	it('rejects a process-local provider when the scheduler host requires distributed claims', async () => {
		const eventBridge = getEventBridgeMock()
		const runtime = new SchedulerRuntime({
			registrations: [schedule()],
			eventBridge: eventBridge.mock,
			provider: new DefaultSchedulerProvider(),
			schedulerGroup: 'billing',
			clock: createClock(),
			requireDistributedClaims: true,
		})

		await expect(runtime.start()).rejects.toMatchObject({ code: 'PURISTA_SCHEDULER_PROVIDER_CAPABILITY_MISSING' })
	})

	it('rejects queue targets instead of executing business work in the scheduler', async () => {
		const eventBridge = getEventBridgeMock()
		const runtime = new SchedulerRuntime({
			registrations: [schedule({ targetKind: 'queue' })],
			eventBridge: eventBridge.mock,
			provider: new DefaultSchedulerProvider(),
			schedulerGroup: 'billing',
			clock: createClock(),
		})

		await expect(runtime.start()).rejects.toMatchObject({ code: 'PURISTA_SCHEDULER_TARGET_UNSUPPORTED' })
	})

	it('rejects business-work concurrency policies at the event boundary', async () => {
		const eventBridge = getEventBridgeMock()
		const runtime = new SchedulerRuntime({
			registrations: [schedule({ concurrencyPolicy: 'forbid' })],
			eventBridge: eventBridge.mock,
			provider: new DefaultSchedulerProvider(),
			schedulerGroup: 'billing',
			clock: createClock(),
		})

		await expect(runtime.start()).rejects.toMatchObject({ code: 'PURISTA_SCHEDULER_CONCURRENCY_UNSUPPORTED' })
	})

	it('uses five-field cron evaluation across a DST transition', async () => {
		const clock = createClock(Date.parse('2026-03-29T00:00:00.000Z'))
		const eventBridge = getEventBridgeMock()
		const runtime = new SchedulerRuntime({
			registrations: [
				schedule({
					expression: { kind: 'cron', value: '0 3 * * *', timezone: 'Europe/Berlin' },
				}),
			],
			eventBridge: eventBridge.mock,
			provider: new DefaultSchedulerProvider(),
			schedulerGroup: 'billing',
			clock,
		})

		await runtime.start()
		clock.advanceBy(60 * 60_000)
		await runtime.tick()

		expect(eventBridge.stubs.emitMessage.callCount).toBe(1)
		expect(eventBridge.stubs.emitMessage.firstCall.args[0]).toMatchObject({
			schedule: { scheduledAt: '2026-03-29T01:00:00.000Z' },
		})
		await runtime.destroy()
	})

	it('collapses missed interval occurrences with runOnce', async () => {
		const clock = createClock()
		const eventBridge = getEventBridgeMock()
		const runtime = new SchedulerRuntime({
			registrations: [schedule({ missedRunPolicy: 'runOnce' })],
			eventBridge: eventBridge.mock,
			provider: new DefaultSchedulerProvider(),
			schedulerGroup: 'billing',
			clock,
		})

		await runtime.start()
		clock.advanceBy(5_000)
		await runtime.tick()

		expect(eventBridge.stubs.emitMessage.callCount).toBe(1)
		expect(eventBridge.stubs.emitMessage.firstCall.args[0]).toMatchObject({
			schedule: { scheduledAt: '1970-01-01T00:00:05.000Z' },
		})
		await runtime.destroy()
	})

	it('uses direct latest-occurrence evaluation for a long runOnce outage', async () => {
		const clock = createClock()
		const eventBridge = getEventBridgeMock()
		const runtime = new SchedulerRuntime({
			registrations: [schedule({ expression: { kind: 'interval', everyMs: 1 }, missedRunPolicy: 'runOnce' })],
			eventBridge: eventBridge.mock,
			provider: new DefaultSchedulerProvider(),
			schedulerGroup: 'billing',
			clock,
			maxOccurrencesPerTick: 10,
		})

		await runtime.start()
		clock.advanceBy(100_000)
		await runtime.tick()

		expect(eventBridge.stubs.emitMessage.callCount).toBe(1)
		expect(eventBridge.stubs.emitMessage.firstCall.args[0]).toMatchObject({
			schedule: { scheduledAt: '1970-01-01T00:01:40.000Z' },
		})
		await runtime.destroy()
	})

	it('reports an occurrence limit instead of retaining an unbounded interval backlog', async () => {
		const clock = createClock()
		const eventBridge = getEventBridgeMock()
		const runtime = new SchedulerRuntime({
			registrations: [schedule({ expression: { kind: 'interval', everyMs: 1 } })],
			eventBridge: eventBridge.mock,
			provider: new DefaultSchedulerProvider(),
			schedulerGroup: 'billing',
			clock,
			maxOccurrencesPerTick: 10,
		})

		await runtime.start()
		clock.advanceBy(1_000)
		await expect(runtime.tick()).rejects.toMatchObject({ code: 'PURISTA_SCHEDULER_OCCURRENCE_LIMIT_EXCEEDED' })
		expect(runtime.listStatus()).toMatchObject([
			{ scheduleKey: 'billing/1/monthly-billing-cycle', lastErrorCode: 'PURISTA_SCHEDULER_OCCURRENCE_LIMIT_EXCEEDED' },
		])
		await runtime.destroy()
	})

	it('rejects payload-bearing trigger declarations until a versioned event envelope exists', async () => {
		const eventBridge = getEventBridgeMock()
		const runtime = new SchedulerRuntime({
			registrations: [schedule({ payloadSchema: { type: 'object' } })],
			eventBridge: eventBridge.mock,
			provider: new DefaultSchedulerProvider(),
			schedulerGroup: 'billing',
			clock: createClock(),
		})

		await expect(runtime.start()).rejects.toMatchObject({ code: 'PURISTA_SCHEDULER_PAYLOAD_UNSUPPORTED' })
	})

	it('loads only its scheduler group through the Core builder', async () => {
		const clock = createClock()
		const eventBridge = getEventBridgeMock()
		const runtime = new SchedulerBuilder('billing')
			.loadManifest({
				version: '1.0.0',
				schedules: [
					{
						name: 'monthly-billing-cycle',
						targetKind: 'event',
						targetServiceName: 'billing',
						targetServiceVersion: '1',
						targetName: 'billing.monthlyCycleDue',
						expression: { kind: 'interval', everyMs: 1_000 },
						schedulerGroup: 'billing',
					},
					{
						name: 'daily-maintenance',
						targetKind: 'event',
						targetServiceName: 'maintenance',
						targetServiceVersion: '1',
						targetName: 'maintenance.daily',
						expression: { kind: 'interval', everyMs: 1_000 },
						schedulerGroup: 'maintenance',
					},
				],
			})
			.useEventBridge(eventBridge.mock)
			.useProvider(new DefaultSchedulerProvider())
			.useClock(clock)
			.getInstance()

		await runtime.start()
		clock.advanceBy(1_000)
		await runtime.tick()

		expect(eventBridge.stubs.emitMessage.callCount).toBe(1)
		expect(eventBridge.stubs.emitMessage.firstCall.args[0]).toMatchObject({ eventName: 'billing.monthlyCycleDue' })
		await runtime.destroy()
	})
})
