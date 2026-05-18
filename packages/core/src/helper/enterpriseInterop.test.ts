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
	exportKubernetesCronJobs,
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
					refreshCache: {
						name: 'Refresh Cache!',
						description: 'Refresh cache trigger',
						targetKind: 'command',
						targetName: 'refreshCache',
						targetServiceName: 'BillingService',
						targetServiceVersion: '1',
						expression: { kind: 'cron', value: '*/5 * * * *' },
						concurrencyPolicy: 'replace',
						missedRunPolicy: 'skip',
						enabledByDefault: false,
						jitterWindowMs: 1000,
						idempotencyKey: 'schedule-name-and-timestamp',
						providerHints: { kubernetes: { startingDeadlineSeconds: 120 } },
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
			    {
			      "concurrencyPolicy": "replace",
			      "description": "Refresh cache trigger",
			      "enabledByDefault": false,
			      "expression": {
			        "kind": "cron",
			        "value": "*/5 * * * *",
			      },
			      "idempotencyKey": "schedule-name-and-timestamp",
			      "jitterWindowMs": 1000,
			      "missedRunPolicy": "skip",
			      "name": "Refresh Cache!",
			      "providerHints": {
			        "kubernetes": {
			          "startingDeadlineSeconds": 120,
			        },
			      },
			      "targetKind": "command",
			      "targetName": "refreshCache",
			      "targetServiceName": "BillingService",
			      "targetServiceVersion": "1",
			    },
			  ],
			  "title": "Billing schedules",
			  "version": "1.0.0",
			}
		`)
	})

	it('exports deterministic Kubernetes CronJob manifests for cron schedules', async () => {
		const manifests = await exportKubernetesCronJobs({
			services: fixtureDefinition,
			trigger: {
				image: 'registry.example.com/purista-trigger:1.0.0',
				command: ['/app/trigger'],
				args: ['--kind', '{{targetKind}}', '--service', '{{targetServiceName}}', '--target', '{{targetName}}'],
			},
			labels: { 'app.kubernetes.io/part-of': 'billing' },
			annotations: { 'example.com/owner': 'platform' },
		})
		const normalized = JSON.parse(JSON.stringify(manifests))

		expect(
			JSON.parse(
				JSON.stringify(
					await exportKubernetesCronJobs({
						services: fixtureDefinition,
						trigger: {
							image: 'registry.example.com/purista-trigger:1.0.0',
							command: ['/app/trigger'],
							args: ['--kind', '{{targetKind}}', '--service', '{{targetServiceName}}', '--target', '{{targetName}}'],
						},
						labels: { 'app.kubernetes.io/part-of': 'billing' },
						annotations: { 'example.com/owner': 'platform' },
					}),
				),
			),
		).toStrictEqual(normalized)

		expect(normalized).toMatchObject([
			{
				apiVersion: 'batch/v1',
				kind: 'CronJob',
				metadata: {
					name: 'monthlybilling',
					labels: { 'app.kubernetes.io/part-of': 'billing' },
					annotations: {
						'example.com/owner': 'platform',
						'purista.dev/schedule-name': 'monthlyBilling',
						'purista.dev/target-kind': 'event',
						'purista.dev/target-name': 'billing.monthly.due',
						'purista.dev/target-service-name': 'BillingService',
						'purista.dev/target-service-version': '1',
						'purista.dev/missed-run-policy': 'runOnce',
					},
				},
				spec: {
					schedule: '0 2 1 * *',
					timeZone: 'Europe/Berlin',
					concurrencyPolicy: 'Forbid',
					jobTemplate: {
						spec: {
							template: {
								spec: {
									restartPolicy: 'OnFailure',
									containers: [
										{
											name: 'purista-trigger',
											image: 'registry.example.com/purista-trigger:1.0.0',
											command: ['/app/trigger'],
											args: ['--kind', 'event', '--service', 'BillingService', '--target', 'billing.monthly.due'],
										},
									],
								},
							},
						},
					},
				},
			},
			{
				metadata: {
					name: 'refresh-cache',
					annotations: {
						'purista.dev/schedule-name': 'Refresh Cache!',
						'purista.dev/target-kind': 'command',
						'purista.dev/jitter-window-ms': '1000',
						'purista.dev/idempotency-key': 'schedule-name-and-timestamp',
						'purista.dev/provider-hints': '{"kubernetes":{"startingDeadlineSeconds":120}}',
					},
				},
				spec: {
					schedule: '*/5 * * * *',
					concurrencyPolicy: 'Replace',
					suspend: true,
				},
			},
		])
	})

	it('exports Kubernetes CronJob manifests from provider-neutral schedule manifests and HTTP trigger config', async () => {
		const scheduleManifest = await exportScheduleManifest({
			title: 'Billing schedules',
			version: '1.0.0',
			services: fixtureDefinition,
		})

		const manifests = await exportKubernetesCronJobs({
			manifest: scheduleManifest,
			namespace: 'jobs',
			trigger: {
				image: 'curlimages/curl:8.8.0',
				http: {
					method: 'POST',
					url: 'https://purista.example.test/schedules/{{targetKind}}/{{targetName}}',
					headers: { 'content-type': 'application/json' },
					body: { schedule: '{{scheduleName}}', target: '{{targetName}}' },
				},
			},
		})

		expect(manifests[0]).toMatchObject({
			metadata: { namespace: 'jobs' },
			spec: {
				concurrencyPolicy: 'Forbid',
				jobTemplate: {
					spec: {
						template: {
							spec: {
								containers: [
									{
										command: ['sh', '-c'],
										args: [
											`curl --fail --silent --show-error --request POST --header 'content-type: application/json' --data '{"schedule":"monthlyBilling","target":"billing.monthly.due"}' 'https://purista.example.test/schedules/event/billing.monthly.due'`,
										],
									},
								],
							},
						},
					},
				},
			},
		})
	})

	it('maps allow concurrency policy to Kubernetes Allow', async () => {
		const manifests = await exportKubernetesCronJobs({
			manifest: {
				version: '1.0.0',
				schedules: [
					{
						name: 'allow-policy',
						targetKind: 'queue',
						targetName: 'billing.invoice.generate',
						targetServiceName: 'BillingService',
						targetServiceVersion: '1',
						expression: { kind: 'cron', value: '* * * * *' },
						concurrencyPolicy: 'allow',
						missedRunPolicy: 'skip',
						enabledByDefault: true,
					},
				],
			},
			trigger: {
				image: 'registry.example.com/purista-trigger:1.0.0',
				command: ['/app/trigger'],
			},
		})

		expect(manifests[0]?.spec.concurrencyPolicy).toBe('Allow')
	})

	it('rejects interval and one-shot schedules for Kubernetes CronJob export', async () => {
		const baseSchedule = {
			name: 'unsupported',
			targetKind: 'event' as const,
			targetName: 'billing.monthly.due',
			targetServiceName: 'BillingService',
			targetServiceVersion: '1',
			concurrencyPolicy: 'forbid' as const,
			missedRunPolicy: 'skip' as const,
			enabledByDefault: true,
		}
		const trigger = {
			image: 'registry.example.com/purista-trigger:1.0.0',
			command: ['/app/trigger'],
		}

		await expect(
			exportKubernetesCronJobs({
				manifest: {
					version: '1.0.0',
					schedules: [{ ...baseSchedule, expression: { kind: 'interval' as const, everyMs: 300_000 } }],
				},
				trigger,
			}),
		).rejects.toThrow('Kubernetes CronJob export only supports cron schedules')

		await expect(
			exportKubernetesCronJobs({
				manifest: {
					version: '1.0.0',
					schedules: [{ ...baseSchedule, expression: { kind: 'oneShot' as const, runAt: '2026-06-01T00:00:00.000Z' } }],
				},
				trigger,
			}),
		).rejects.toThrow('Kubernetes CronJob export only supports cron schedules')
	})

	it('rejects missing trigger configuration and subscription schedule targets', async () => {
		await expect(
			exportKubernetesCronJobs({
				manifest: {
					version: '1.0.0',
					schedules: [
						{
							name: 'subscription-target',
							targetKind: 'subscription' as never,
							targetName: 'sendReceipt',
							targetServiceName: 'BillingService',
							targetServiceVersion: '1',
							expression: { kind: 'cron', value: '* * * * *' },
							concurrencyPolicy: 'forbid',
							missedRunPolicy: 'skip',
							enabledByDefault: true,
						},
					],
				},
				trigger: {
					image: 'registry.example.com/purista-trigger:1.0.0',
					command: ['/app/trigger'],
				},
			}),
		).rejects.toThrow('direct subscription targets are not supported')

		await expect(
			exportKubernetesCronJobs({
				manifest: { version: '1.0.0', schedules: [] },
				trigger: { image: 'registry.example.com/purista-trigger:1.0.0' },
			}),
		).rejects.toThrow('requires command/args or http trigger configuration')
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
