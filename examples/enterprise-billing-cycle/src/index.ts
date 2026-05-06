import {
	type CustomMessage,
	DefaultEventBridge,
	DefaultQueueBridge,
	EBMessageType,
	type EventBridge,
	extendApi,
	Service,
	ServiceBuilder,
	type ServiceInfoType,
} from '@purista/core'
import { z } from 'zod'

type ServiceWithInProgressBindingHook = {
	createEventToQueueSubscriptionDefinitions?: (bindings: unknown[]) => unknown[]
}

const servicePrototype = Service.prototype as unknown as ServiceWithInProgressBindingHook
servicePrototype.createEventToQueueSubscriptionDefinitions ??= () => []

const BillingEvent = {
	MonthlyCycleDue: 'billing.monthlyCycleDue',
	MonthlyClosingCompleted: 'billing.monthlyClosing.completed',
} as const

const billingCycleDuePayloadSchema = extendApi(
	z.object({
		cycleId: extendApi(z.string().min(1), { title: 'Billing cycle id' }),
		periodStart: extendApi(z.string().datetime(), { title: 'Period start' }),
		periodEnd: extendApi(z.string().datetime(), { title: 'Period end' }),
		tenantId: extendApi(z.string().min(1), { title: 'Tenant id' }),
	}),
	{ title: 'monthly billing cycle due event' },
)

const billingClosingQueuePayloadSchema = extendApi(
	z.object({
		cycleId: extendApi(z.string().min(1), { title: 'Billing cycle id' }),
		periodStart: extendApi(z.string().datetime(), { title: 'Period start' }),
		periodEnd: extendApi(z.string().datetime(), { title: 'Period end' }),
	}),
	{ title: 'monthly billing closing queue payload' },
)

const billingClosingQueueParameterSchema = extendApi(
	z.object({
		tenantId: extendApi(z.string().min(1), { title: 'Tenant id' }),
	}),
	{ title: 'monthly billing closing queue parameter' },
)

const billingClosingCompletedPayloadSchema = extendApi(
	z.object({
		jobId: extendApi(z.string().min(1), { title: 'Queue job id' }),
		queueName: extendApi(z.string().min(1), { title: 'Queue name' }),
		status: extendApi(z.literal('success'), { title: 'Result status' }),
		cycleId: extendApi(z.string().min(1), { title: 'Billing cycle id' }),
		tenantId: extendApi(z.string().min(1), { title: 'Tenant id' }),
		invoiceCount: extendApi(z.number().int().nonnegative(), { title: 'Created invoices' }),
		totalCents: extendApi(z.number().int().nonnegative(), { title: 'Total amount in cents' }),
	}),
	{ title: 'monthly billing closing completed event' },
)

const billingClosingCompletedResultEventSchema = extendApi(
	z.object({
		jobId: extendApi(z.string().min(1), { title: 'Queue job id' }),
		queueName: extendApi(z.string().min(1), { title: 'Queue name' }),
		status: extendApi(z.literal('success'), { title: 'Result status' }),
		attempt: extendApi(z.number().int().positive(), { title: 'Queue attempt' }),
		payload: billingClosingCompletedPayloadSchema,
		headers: extendApi(z.record(z.string(), z.string()).optional(), { title: 'Result headers' }),
		traceId: extendApi(z.string().optional(), { title: 'Trace id' }),
		correlationId: extendApi(z.string().optional(), { title: 'Correlation id' }),
		tenantId: extendApi(z.string().optional(), { title: 'Tenant id' }),
		principalId: extendApi(z.string().optional(), { title: 'Principal id' }),
	}),
	{ title: 'monthly billing closing completed result event' },
)

type BillingCycleDuePayload = z.input<typeof billingCycleDuePayloadSchema>
type BillingClosingQueuePayload = z.input<typeof billingClosingQueuePayloadSchema>
type BillingClosingQueueParameter = z.input<typeof billingClosingQueueParameterSchema>
type BillingClosingCompletedPayload = z.input<typeof billingClosingCompletedPayloadSchema>

type BillingResources = {
	ledger: {
		completed: BillingClosingCompletedPayload[]
	}
}

const billingServiceInfo = {
	serviceName: 'Billing',
	serviceVersion: '1',
	serviceDescription: 'Enterprise billing cycle example',
} as const satisfies ServiceInfoType

const billingServiceBuilder = new ServiceBuilder(billingServiceInfo).defineResource<
	'ledger',
	BillingResources['ledger']
>()

const monthlyBillingSchedule = billingServiceBuilder
	.getScheduleBuilder('monthlyBillingCycle', 'Monthly billing cycle trigger')
	.emitEvent(BillingEvent.MonthlyCycleDue, {
		expression: { kind: 'cron', value: '0 2 1 * *' },
		timezone: 'Europe/Berlin',
		concurrencyPolicy: 'forbid',
		missedRunPolicy: 'runOnce',
		idempotencyKey: 'payload.cycleId',
		payloadSchema: billingCycleDuePayloadSchema,
	})

const billingClosingQueue = billingServiceBuilder
	.getQueueBuilder('billing.monthlyClosing', 'Close a monthly billing cycle and emit a result event')
	.addPayloadSchema(billingClosingQueuePayloadSchema)
	.addParameterSchema(billingClosingQueueParameterSchema)
	.setExecutionProfile('longRunning', {
		maxRuntimeMs: 6 * 60 * 60_000,
	})
	.emitResultAsEvent(BillingEvent.MonthlyClosingCompleted, {
		failureEventName: 'billing.monthlyClosing.failed',
		delivery: 'required',
	})

const billingClosingWorker = billingServiceBuilder
	.getQueueWorkerBuilder('billing.monthlyClosing', 'closeMonthlyBillingCycle')
	.setMode('continuous')
	.setHandler(async function (context, message) {
		const payload = message.payload as BillingClosingQueuePayload
		const parameter = message.parameter as BillingClosingQueueParameter

		context.logger.info({ cycleId: payload.cycleId, jobId: message.id }, 'closing monthly billing cycle')
		await context.job.extendLease(5 * 60_000)

		const result: BillingClosingCompletedPayload = {
			jobId: message.id,
			queueName: message.queueName,
			status: 'success',
			cycleId: payload.cycleId,
			tenantId: parameter.tenantId,
			invoiceCount: 42,
			totalCents: 198_500,
		}

		await context.job.complete(result)
		return undefined
	})

const recordBillingResult = billingServiceBuilder
	.getSubscriptionBuilder('recordBillingResult', 'Record completed billing cycle result events')
	.subscribeToEvent(BillingEvent.MonthlyClosingCompleted)
	.addPayloadSchema(billingClosingCompletedResultEventSchema)
	.setSubscriptionFunction(async function (context, payload) {
		context.resources.ledger.completed.push(payload.payload)
		context.logger.info(
			{ cycleId: payload.payload.cycleId, totalCents: payload.payload.totalCents },
			'recorded billing result event',
		)
	})

export const billingService = billingServiceBuilder
	.addScheduleDefinition(monthlyBillingSchedule)
	.addQueueDefinition(billingClosingQueue.getDefinition())
	.addQueueWorkerDefinition(billingClosingWorker.getDefinition())
	.addSubscriptionDefinition(recordBillingResult.getDefinition())
	.bindEventToQueue(BillingEvent.MonthlyCycleDue, 'billing.monthlyClosing', {
		idempotencyMode: 'advisory',
		idempotencyKey: (event: BillingCycleDuePayload) => `billing-cycle:${event.cycleId}`,
		mapPayload: (event: BillingCycleDuePayload) => ({
			cycleId: event.cycleId,
			periodStart: event.periodStart,
			periodEnd: event.periodEnd,
		}),
		mapParameter: (event: BillingCycleDuePayload) => ({ tenantId: event.tenantId }),
		onEnqueueFailure: { delayMs: 60_000, reason: 'billing_cycle_enqueue_failed' },
	})

const emitCustomEvent = async <Payload>(
	eventBridge: EventBridge,
	eventName: string,
	payload: Payload,
	serviceTarget: string,
) => {
	const message = {
		messageType: EBMessageType.CustomMessage,
		contentType: 'application/json',
		contentEncoding: 'utf-8',
		sender: {
			serviceName: billingServiceInfo.serviceName,
			serviceVersion: billingServiceInfo.serviceVersion,
			serviceTarget,
			instanceId: eventBridge.instanceId,
		},
		eventName,
		payload,
	} satisfies Omit<CustomMessage<Payload>, 'id' | 'timestamp' | 'correlationId'>

	await eventBridge.emitMessage(message)
}

const waitUntil = async (predicate: () => boolean) => {
	const startedAt = Date.now()
	while (!predicate()) {
		if (Date.now() - startedAt > 5_000) {
			throw new Error('billing cycle example timed out')
		}
		await new Promise(resolve => setTimeout(resolve, 25))
	}
}

export const main = async () => {
	const eventBridge = new DefaultEventBridge()
	const queueBridge = new DefaultQueueBridge()
	const ledger: BillingResources['ledger'] = { completed: [] }

	await eventBridge.start()
	await queueBridge.start()

	const service = await billingService.getInstance(eventBridge, {
		queueBridge,
		resources: {
			ledger,
		},
	})

	await service.start()

	await emitCustomEvent<BillingCycleDuePayload>(
		eventBridge,
		BillingEvent.MonthlyCycleDue,
		{
			cycleId: '2026-04',
			periodStart: '2026-04-01T00:00:00.000Z',
			periodEnd: '2026-04-30T23:59:59.999Z',
			tenantId: 'tenant-acme',
		},
		'localScheduleRunner',
	)

	await waitUntil(() => ledger.completed.length === 1)

	process.stdout.write(`${JSON.stringify(ledger.completed[0], null, 2)}\n`)

	await service.destroy()
	await queueBridge.destroy()
	await eventBridge.destroy()
}

main().catch(error => {
	process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`)
	process.exitCode = 1
})
