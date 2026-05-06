import { describe, expect, it } from 'vitest'
import {
	EventBridgeCommandTransport,
	EventBridgeLateResponseHandling,
	EventBridgeResponseConfirmationLevel,
	EventBridgeStreamLateFrameHandling,
} from '../core/EventBridge/types/index.js'
import { EBMessageType } from '../core/types/index.js'
import {
	exportAsyncApi,
	exportRuntimeCapabilities,
	exportScheduleManifest,
	fromCloudEvent,
	toCloudEvent,
} from './enterpriseInterop.js'
import type { FullDefinition } from './types/index.js'

const fixtureDefinition: FullDefinition = {
	version: '2.2.0',
	services: {
		BillingService: {
			'1': {
				description: 'Billing workflows',
				deprecated: false,
				commands: {
					createInvoice: {
						commandName: 'createInvoice',
						commandDescription: 'Create an invoice',
						eventName: 'billing.invoice.created',
						metadata: {
							expose: {
								inputPayload: {
									type: 'object',
									properties: { accountId: { type: 'string' } },
									required: ['accountId'],
								},
								outputPayload: {
									type: 'object',
									properties: { invoiceId: { type: 'string' } },
									required: ['invoiceId'],
								},
							},
						},
						eventBridgeConfig: { durable: true, autoacknowledge: false, shared: true },
						hooks: {},
						invokes: {},
						streamInvokes: {},
						emitList: {},
						queueInvokes: {},
					} as never,
				},
				subscriptions: {
					sendReceipt: {
						subscriptionName: 'sendReceipt',
						subscriptionDescription: 'Send receipt emails',
						eventName: 'billing.invoice.created',
						messageType: EBMessageType.CustomMessage,
						metadata: { expose: { inputPayload: { type: 'object' } } },
						eventBridgeConfig: { durable: true, autoacknowledge: false, shared: true },
						hooks: {},
						invokes: {},
						streamInvokes: {},
						emitList: {},
						queueInvokes: {},
						deprecated: false,
					} as never,
				},
				streams: {
					invoiceProgress: {
						streamName: 'invoiceProgress',
						streamDescription: 'Invoice progress stream',
						finalEventName: 'billing.invoice.progress.completed',
						metadata: { expose: { chunkPayload: { type: 'object' }, finalPayload: { type: 'object' } } },
						eventBridgeConfig: { durable: false, autoacknowledge: true, shared: true },
						hooks: {},
						invokes: {},
						streamInvokes: {},
						emitList: {},
						queueInvokes: {},
						chunkValidationEnabled: true,
						finalValidationEnabled: true,
						aggregateChunks: true,
					} as never,
				},
				queues: {
					'billing.invoice.generate': {
						queueName: 'billing.invoice.generate',
						description: 'Generate invoices',
						tags: ['billing'],
						deprecated: false,
						queueBridgeConfig: { orderingGuarantee: 'fifo', prefetch: 1 },
						workers: [],
						resultPolicy: {
							mode: 'event',
							successEventName: 'billing.invoice.generate.succeeded',
							failureEventName: 'billing.invoice.generate.failed',
							eventId: 'jobIdAndStatus',
							delivery: 'required',
						},
					} as never,
				},
				queueWorkers: {
					generateInvoiceWorker: {
						name: 'generateInvoiceWorker',
						queueName: 'billing.invoice.generate',
						description: 'Generate invoice worker',
					} as never,
				},
				schedules: {
					monthlyBilling: {
						name: 'monthlyBilling',
						description: 'Monthly billing trigger',
						targetKind: 'event',
						targetName: 'billing.monthly.due',
						targetServiceName: 'BillingService',
						targetServiceVersion: '1',
						expression: { kind: 'cron', value: '0 2 1 * *', timezone: 'Europe/Berlin' },
						concurrencyPolicy: 'forbid',
						missedRunPolicy: 'runOnce',
						enabledByDefault: true,
					},
				},
				eventToQueueBindings: [
					{
						eventName: 'billing.monthly.due',
						queueName: 'billing.invoice.generate',
						idempotencyMode: 'strict',
						idempotencyKey: 'messageId',
					},
				],
			},
		},
	},
}

describe('enterprise interoperability helpers', () => {
	it('exports deterministic AsyncAPI JSON from service definitions', async () => {
		const asyncApi = await exportAsyncApi({
			title: 'Billing contracts',
			version: '1.0.0',
			services: fixtureDefinition,
		})
		const asyncApiAgain = await exportAsyncApi({
			title: 'Billing contracts',
			version: '1.0.0',
			services: fixtureDefinition,
		})

		const normalized = JSON.parse(JSON.stringify(asyncApi))
		expect(JSON.parse(JSON.stringify(asyncApiAgain))).toStrictEqual(normalized)
		expect(Object.keys(normalized.channels).sort()).toEqual([
			'BillingService.1.command.createInvoice.request',
			'BillingService.1.stream.invoiceProgress',
			'event.billing.invoice.created',
			'queue.billing.invoice.generate',
		])
		expect(Object.keys(normalized.operations).sort()).toEqual([
			'BillingService.1.command.createInvoice.request.receive',
			'BillingService.1.stream.invoiceProgress.receive',
			'BillingService.1.subscription.sendReceipt.receive',
			'binding.billing.monthly.due.billing.invoice.generate',
			'event.billing.invoice.created.send',
			'queue.billing.invoice.generate.receive',
			'queue.billing.invoice.generate.send',
		])
		expect(normalized).toMatchObject({
			asyncapi: '3.0.0',
			defaultContentType: 'application/json',
			info: {
				title: 'Billing contracts',
				version: '1.0.0',
			},
			channels: {
				'queue.billing.invoice.generate': {
					address: 'billing.invoice.generate',
					'x-purista': {
						kind: 'queue',
						queueName: 'billing.invoice.generate',
						resultPolicy: {
							mode: 'event',
							successEventName: 'billing.invoice.generate.succeeded',
							failureEventName: 'billing.invoice.generate.failed',
							eventId: 'jobIdAndStatus',
							delivery: 'required',
						},
					},
				},
			},
			operations: {
				'binding.billing.monthly.due.billing.invoice.generate': {
					action: 'receive',
					channel: {
						$ref: '#/channels/event.billing.monthly.due',
					},
					reply: {
						channel: {
							$ref: '#/channels/queue.billing.invoice.generate',
						},
					},
					'x-purista': {
						kind: 'event-to-queue-binding',
						eventName: 'billing.monthly.due',
						queueName: 'billing.invoice.generate',
						idempotencyMode: 'strict',
						idempotencyKey: 'messageId',
					},
				},
			},
			components: {
				messages: {
					'BillingService.1.command.createInvoice.request.message': {
						payload: {
							type: 'object',
							properties: {
								accountId: {
									type: 'string',
								},
							},
							required: ['accountId'],
						},
					},
				},
				schemas: {
					PuristaHeaders: {
						type: 'object',
					},
				},
			},
		})
	})

	it('exports deterministic provider-neutral schedule manifests', async () => {
		const manifest = await exportScheduleManifest({
			title: 'Billing schedules',
			version: '1.0.0',
			services: fixtureDefinition,
		})

		expect(manifest).toMatchInlineSnapshot(`
			{
			  "schedules": [
			    {
			      "concurrencyPolicy": "forbid",
			      "description": "Monthly billing trigger",
			      "enabledByDefault": true,
			      "expression": {
			        "kind": "cron",
			        "timezone": "Europe/Berlin",
			        "value": "0 2 1 * *",
			      },
			      "missedRunPolicy": "runOnce",
			      "name": "monthlyBilling",
			      "targetKind": "event",
			      "targetName": "billing.monthly.due",
			      "targetServiceName": "BillingService",
			      "targetServiceVersion": "1",
			    },
			  ],
			  "title": "Billing schedules",
			  "version": "1.0.0",
			}
		`)
	})

	it('maps PURISTA custom messages to and from CloudEvents', () => {
		const cloudEvent = toCloudEvent({
			id: 'msg-1',
			timestamp: Date.parse('2026-05-06T12:00:00.000Z'),
			contentType: 'application/json',
			contentEncoding: 'utf-8',
			messageType: EBMessageType.CustomMessage,
			correlationId: 'corr-1',
			traceId: 'trace-1',
			principalId: 'principal-1',
			tenantId: 'tenant-1',
			eventName: 'billing.invoice.created',
			sender: {
				serviceName: 'BillingService',
				serviceVersion: '1',
				serviceTarget: 'createInvoice',
				instanceId: 'instance-1',
			},
			payload: { invoiceId: 'inv-1' },
		})

		expect(cloudEvent).toStrictEqual({
			specversion: '1.0',
			id: 'msg-1',
			source: '/purista/BillingService/1/createInvoice',
			type: 'billing.invoice.created',
			time: '2026-05-06T12:00:00.000Z',
			datacontenttype: 'application/json',
			data: { invoiceId: 'inv-1' },
			correlationid: 'corr-1',
			traceid: 'trace-1',
			tenantid: 'tenant-1',
			principalid: 'principal-1',
			serviceName: 'BillingService',
			serviceVersion: '1',
			serviceTarget: 'createInvoice',
			instanceId: 'instance-1',
			contentencoding: 'utf-8',
		})

		expect(fromCloudEvent(cloudEvent, { mode: 'strict' })).toMatchObject({
			id: 'msg-1',
			eventName: 'billing.invoice.created',
			payload: { invoiceId: 'inv-1' },
			sender: {
				serviceName: 'BillingService',
				serviceVersion: '1',
				serviceTarget: 'createInvoice',
				instanceId: 'instance-1',
			},
		})
	})

	it('rejects missing PURISTA sender metadata in strict CloudEvents mode and accepts compat mode', () => {
		const cloudEvent = {
			specversion: '1.0',
			id: 'external-1',
			source: '/external/billing',
			type: 'billing.external.created',
			data: { id: 'evt-1' },
		}

		expect(() => fromCloudEvent(cloudEvent, { mode: 'strict' })).toThrow('serviceName')
		expect(fromCloudEvent(cloudEvent, { mode: 'compat' })).toMatchObject({
			id: 'external-1',
			eventName: 'billing.external.created',
			sender: {
				serviceName: 'external',
				serviceVersion: '0',
				serviceTarget: 'billing.external.created',
				instanceId: 'external',
			},
		})
	})

	it('exports definition-only runtime capability reports', () => {
		const report = exportRuntimeCapabilities({
			mode: 'definition-only',
			eventBridge: {
				name: 'DefaultEventBridge',
				capabilities: {
					supportsStreams: true,
					durableCommands: false,
					durableSubscriptions: false,
					manualAckSupported: false,
					lateResponseHandling: EventBridgeLateResponseHandling.IgnoreWithWarning,
					gracefulDrainSupported: true,
					nativeDeadLettering: false,
					commandHandling: {
						transport: EventBridgeCommandTransport.InMemory,
						pendingInvocationCancellation: true,
						responseConfirmation: EventBridgeResponseConfirmationLevel.None,
						strictMode: true,
					},
					streamHandling: {
						incrementalDelivery: true,
						consumerCancellation: true,
						gracefulStreamDrain: true,
						aggregatedFinalSupported: true,
						lateFrameHandling: EventBridgeStreamLateFrameHandling.IgnoreWithWarning,
					},
					consumerFailureHandling: {
						boundedRetry: false,
						delayedRetry: false,
						deadLetterTarget: false,
						drop: false,
						stopConsumer: false,
						consumerPauseResume: false,
						bridgeManagedDeadLettering: false,
						nativeDeadLettering: false,
						fatalClassification: false,
						strictMode: true,
					},
				},
			},
			queueBridge: {
				name: 'DefaultQueueBridge',
				capabilities: {
					delayedDelivery: true,
					fifoOrdering: true,
					partitions: false,
					priorities: false,
					deadLetterNative: false,
					exactlyOnce: false,
					maxBatchSize: 1,
					deadLetterInspectable: true,
					deadLetterInspectSupported: true,
					deadLetterReplaySupported: true,
					deadLetterPurgeSupported: true,
					leaseInspectionSupported: false,
					idempotencyEnforcement: false,
					partitionOrdering: false,
					providerManagedDelayedDelivery: false,
					strictStartupValidation: true,
				},
			},
		})

		expect(report.queueBridge?.longRunning).toStrictEqual({
			leaseExtension: true,
			leaseInspection: false,
			strictStartupValidation: true,
		})
		expect(report.queueBridge?.resultPolicies).toStrictEqual({
			event: true,
			state: false,
			stateAndEvent: false,
		})
	})
})
