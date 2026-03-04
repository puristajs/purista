import type { Span } from '@opentelemetry/api'
import { SpanStatusCode, trace } from '@opentelemetry/api'
import { DefaultConfigStore } from '../../DefaultConfigStore/DefaultConfigStore.impl.js'
import { DefaultQueueBridge } from '../../DefaultQueueBridge/DefaultQueueBridge.impl.js'
import { DefaultSecretStore } from '../../DefaultSecretStore/DefaultSecretStore.impl.js'
import { DefaultStateStore } from '../../DefaultStateStore/DefaultStateStore.impl.js'
import type { Infer, Schema } from '../../schema/index.js'
import { validate } from '../../schema/index.js'
import { puristaVersion } from '../../version.js'
import type { ConfigDeleteFunction } from '../ConfigStore/types/ConfigDeleteFunction.js'
import type { ConfigGetterFunction } from '../ConfigStore/types/ConfigGetterFunction.js'
import type { ConfigSetterFunction } from '../ConfigStore/types/ConfigSetterFunction.js'

import { HandledError } from '../Error/HandledError.impl.js'
import { UnhandledError } from '../Error/UnhandledError.impl.js'
import { createAgentInvokeFunctionProxy } from '../helper/createAgentInvokeFunctionProxy.impl.js'
import { createErrorResponse } from '../helper/createErrorResponse.impl.js'
import { createInfoMessage } from '../helper/createInfoMessage.impl.js'
import { createInvokeFunctionProxy } from '../helper/createInvokeFunctionProxy.impl.js'
import { createOpenStreamFunctionProxy } from '../helper/createOpenStreamFunctionProxy.impl.js'
import { createQueueEnqueueProxy } from '../helper/createQueueEnqueueProxy.impl.js'
import { createQueueScheduleProxy } from '../helper/createQueueScheduleProxy.impl.js'
import { createSuccessResponse } from '../helper/createSuccessResponse.impl.js'
import { getCleanedMessage } from '../helper/getCleanedMessage.impl.js'
import { deserializeOtp, serializeOtp } from '../helper/serializeOtp.impl.js'
import type { QueueBridge } from '../QueueBridge/types/QueueBridge.js'
import type { QueueEnqueueResult } from '../QueueBridge/types/QueueEnqueueResult.js'
import type { QueueRetryRequest } from '../QueueBridge/types/QueueRetryRequest.js'
import type { SecretDeleteFunction } from '../SecretStore/types/SecretDeleteFunction.js'
import type { SecretGetterFunction } from '../SecretStore/types/SecretGetterFunction.js'
import type { SecretSetterFunction } from '../SecretStore/types/SecretSetterFunction.js'
import type { StateDeleteFunction } from '../StateStore/types/StateDeleteFunction.js'
import type { StateGetterFunction } from '../StateStore/types/StateGetterFunction.js'
import type { StateSetterFunction } from '../StateStore/types/StateSetterFunction.js'
import type {
	AgentInvocation,
	AgentInvokeList,
	AgentProtocolPayload,
	AgentProtocolResponse,
} from '../types/agent/index.js'
import type { ContextBase } from '../types/ContextBase.js'
import type { CustomMessage } from '../types/CustomMessage.js'
import type { Command } from '../types/commandType/Command.js'
import type { CommandDefinition } from '../types/commandType/CommandDefinition.js'
import type { CommandDefinitionListResolved } from '../types/commandType/CommandDefinitionList.js'
import type { CommandFunctionContext } from '../types/commandType/CommandFunctionContext.js'
import type { EBMessage } from '../types/EBMessage.js'
import type { EBMessageAddress } from '../types/EBMessageAddress.js'
import type { EBMessageSenderAddress } from '../types/EBMessageSenderAddress.js'
import { EBMessageType } from '../types/EBMessageType.enum.js'
import type { EmitSchemaList } from '../types/EmitSchemaList.js'
import type { EmptyObject } from '../types/EmptyObject.js'
import type { InvokeList } from '../types/InvokeList.js'
import type { InfoMessageType } from '../types/infoType/InfoMessage.js'
import type { Logger } from '../types/Logger.js'
import type { OpenStreamFunction } from '../types/OpenStreamFunction.js'
import type { PrincipalId } from '../types/PrincipalId.js'
import { PuristaSpanName } from '../types/PuristaSpanName.enum.js'
import { PuristaSpanTag } from '../types/PuristaSpanTag.enum.js'
import { defaultQueueLifecycleConfig } from '../types/queue/defaultQueueLifecycleConfig.js'
import type { QueueContext } from '../types/queue/QueueContext.js'
import type { QueueDefinition } from '../types/queue/QueueDefinition.js'
import type { QueueDefinitionListResolved } from '../types/queue/QueueDefinitionList.js'
import type { QueueEnqueueOptions } from '../types/queue/QueueEnqueueOptions.js'
import type { QueueHandlerResult } from '../types/queue/QueueHandlerResult.js'
import type { QueueInvokeList } from '../types/queue/QueueInvokeList.js'
import type { QueueJobContext } from '../types/queue/QueueJobContext.js'
import type { QueueLease } from '../types/queue/QueueLease.js'
import type { QueueLifecycleConfig } from '../types/queue/QueueLifecycleConfig.js'
import type { QueueMessage } from '../types/queue/QueueMessage.js'
import type { QueueMetrics } from '../types/queue/QueueMetrics.js'
import type { QueueTransformContext } from '../types/queue/QueueTransformHook.js'
import type { QueueWorkerDefinition } from '../types/queue/QueueWorkerDefinition.js'
import type { QueueWorkerDefinitionListResolved } from '../types/queue/QueueWorkerDefinitionList.js'
import type { ServiceClass } from '../types/ServiceClass.js'
import type { ServiceClassTypes } from '../types/ServiceClassTypes.js'
import type { ServiceConstructorInput } from '../types/ServiceConstructorInput.js'
import { ServiceEventsNames } from '../types/ServiceEvents.js'
import type { QueueHealthState, ServiceHealthState } from '../types/ServiceHealthState.js'
import { StatusCode } from '../types/StatusCode.enum.js'
import { StoreType } from '../types/StoreType.enum.js'
import type { StreamInvokeList } from '../types/StreamInvokeList.js'
import { isStreamControl } from '../types/stream/isStreamControl.impl.js'
import { isStreamOpenRequest } from '../types/stream/isStreamOpenRequest.impl.js'
import type { StreamDefinition } from '../types/stream/StreamDefinition.js'
import type { StreamDefinitionListResolved } from '../types/stream/StreamDefinitionList.js'
import type { StreamFrame } from '../types/stream/StreamFrame.js'
import type { StreamMessage } from '../types/stream/StreamMessage.js'
import type { StreamOpenRequest } from '../types/stream/StreamOpenRequest.js'
import type { StreamWriter } from '../types/stream/StreamWriter.js'
import type { Subscription } from '../types/subscription/Subscription.js'
import type { SubscriptionDefinition } from '../types/subscription/SubscriptionDefinition.js'
import type { SubscriptionDefinitionListResolved } from '../types/subscription/SubscriptionDefinitionList.js'
import type { SubscriptionFunctionContext } from '../types/subscription/SubscriptionFunctionContext.js'
import type { TenantId } from '../types/TenantId.js'
import type { TraceId } from '../types/TraceId.js'
import { commandTransformInput } from './commandTransformInput.impl.js'
import { ServiceBaseClass } from './ServiceBaseClass/ServiceBaseClass.impl.js'
import { subscriptionTransformInput } from './subscriptionTransformInput.impl.js'

type LeaseHeartbeatController = {
	stop: () => void
}

/**
 * Base class for all services.
 * This class provides base functions to work with the event bridge, logging and so on
 *
 * Every service should extend this class and should not directly access the eventbridge or other service
 *
 * ```typescript
 * class MyService extends Service {
 *
 *   async start() {
 *     await super.start()
 *     // your custom implementation
 *   }
 *
 *   async destroy() {
 *     // your custom implementation
 *    await super.destroy()
 *   }
 * }
 * ```
 *
 * @group Service
 */
export class Service<S extends ServiceClassTypes = ServiceClassTypes>
	extends ServiceBaseClass
	implements ServiceClass<S>
{
	protected subscriptions = new Map<
		string,
		SubscriptionDefinition<any, any, any, any, any, any, any, any, S['Resources'], any, any, any, any, any, any>
	>()
	protected commands = new Map<
		string,
		CommandDefinition<any, any, any, any, any, any, any, any, any, any, S['Resources'], any, any, any, any, any, any>
	>()
	protected streams = new Map<
		string,
		StreamDefinition<any, any, any, any, any, any, any, S['Resources'], any, any, any, any, any, any>
	>()
	protected queueDefinitionList: QueueDefinitionListResolved<any>
	protected queueWorkerDefinitionList: QueueWorkerDefinitionListResolved<any>
	protected activeStreamSessions = new Map<
		string,
		{
			cancelled: boolean
			cancelReason?: string
			onCancel: Array<(reason?: string) => void>
		}
	>()
	private queueBridge: QueueBridge
	private readonly queueDefinitionMap: Map<string, QueueDefinition<any, any, any, any, any>>
	private queueWorkerTasks = new Set<Promise<void>>()
	private queueWorkersShouldStop = false
	private queueMetricsCache = new Map<string, QueueMetrics>()
	private queueBridgeStarted = false

	public commandDefinitionList: CommandDefinitionListResolved<any>
	public subscriptionDefinitionList: SubscriptionDefinitionListResolved<any>
	public streamDefinitionList: StreamDefinitionListResolved<any>
	public config: S['ConfigType']

	public resources: S['Resources']

	public isStarted = false

	constructor(config: ServiceConstructorInput<S>) {
		super({
			logger: config.logger,
			info: config.info,
			eventBridge: config.eventBridge,
			spanProcessor: config.spanProcessor,
			secretStore: config.secretStore ?? new DefaultSecretStore(),
			configStore: config.configStore ?? new DefaultConfigStore(),
			stateStore: config.stateStore ?? new DefaultStateStore(),
			configSchema: config.configSchema,
		})

		this.config = config.config
		this.resources = config.resources ?? {}
		this.commandDefinitionList = config.commandDefinitionList
		this.subscriptionDefinitionList = config.subscriptionDefinitionList
		this.streamDefinitionList = config.streamDefinitionList ?? []
		this.queueDefinitionList = config.queueDefinitionList ?? []
		this.queueWorkerDefinitionList = config.queueWorkerDefinitionList ?? []
		this.queueBridge = config.queueBridge ?? new DefaultQueueBridge()
		this.queueDefinitionMap = new Map(
			this.queueDefinitionList.map(def => [this.normalizeQueueName(def.queueName), def]),
		)
	}

	get name() {
		return `${this.info.serviceName}V${this.info.serviceVersion}`
	}

	/**
	 * It connects to the event bridge and subscribes to the topics that are in the subscription list.
	 */
	async start() {
		if (this.isStarted) {
			throw new UnhandledError(StatusCode.InternalServerError, 'Service already started')
		}
		return this.startActiveSpan('purista.start', {}, undefined, async span => {
			try {
				if (this.configSchema) {
					const validationResult = await validate(this.configSchema, this.config)
					if (!validationResult.success) {
						const err = new UnhandledError(
							StatusCode.InternalServerError,
							`service ${this.serviceInfo.serviceName} ${this.serviceInfo.serviceVersion}: invalid service configuration provided`,
							validationResult.issues,
						)
						this.logger.error({ ...span.spanContext(), puristaVersion, err }, err.message)
						throw err
					}
				}

				await this.initializeEventbridgeConnect(
					this.commandDefinitionList,
					this.subscriptionDefinitionList,
					this.streamDefinitionList,
				)
				await this.initializeQueues()
				await this.sendServiceInfo(EBMessageType.InfoServiceReady)
				this.logger.info(
					{ ...span.spanContext(), puristaVersion },
					`service ${this.serviceInfo.serviceName} ${this.serviceInfo.serviceVersion} started`,
				)
				this.emit(ServiceEventsNames.ServiceStarted)
			} catch (err) {
				this.logger.error({ err, ...span.spanContext(), puristaVersion }, 'failed to start service')
				this.emit(ServiceEventsNames.ServiceUnavailable, err)
				throw err
			}

			this.isStarted = true
		})
	}

	/**
	 * Connect service to event bridge to receive commands and command responses
	 */
	protected async initializeEventbridgeConnect(
		commandDefinitionList: CommandDefinitionListResolved<any>,
		subscriptions: SubscriptionDefinitionListResolved<any>,
		streams: StreamDefinitionListResolved<any>,
	) {
		return this.startActiveSpan('purista.initializeEventbridgeConnect', {}, undefined, async span => {
			const isEventBridgeReady = await this.eventBridge.isHealthy()

			if (!isEventBridgeReady) {
				const err = new UnhandledError(StatusCode.ServiceUnavailable, 'eventbridge not healthy')
				this.logger.error({ err }, 'Eventbridge is not ready - can not start service')
				throw err
			}

			// send info message that this service is going to start up now
			await this.sendServiceInfo(EBMessageType.InfoServiceInit)

			// register commands for this service
			const commandProms = commandDefinitionList.map(command => this.registerCommand(command))
			await Promise.all(commandProms)

			// register subscriptions for this service
			const subscriptionProms = subscriptions.map(subscription => {
				this.logger.debug({ name: subscription.subscriptionName, ...span.spanContext() }, 'start subscription')
				return this.registerSubscription(subscription)
			})
			await Promise.all(subscriptionProms)

			const streamProms = streams.map(stream => {
				this.logger.debug({ name: stream.streamName, ...span.spanContext() }, 'start stream')
				return this.registerStream(stream)
			})
			await Promise.all(streamProms)
		})
	}

	protected async initializeQueues() {
		if (!this.hasQueueFeatures()) {
			this.logger.debug('no queues/workers declared; skipping queue bridge startup')
			return
		}

		if (!this.queueBridgeStarted) {
			await this.queueBridge.start()
			this.queueBridgeStarted = true
		}

		const isQueueBridgeReady = await this.queueBridge.isHealthy()
		if (!isQueueBridgeReady) {
			const err = new UnhandledError(StatusCode.ServiceUnavailable, 'queue bridge not healthy')
			this.logger.error({ err }, 'Queue bridge is not ready - can not start service')
			throw err
		}
		this.startQueueWorkers()
	}

	/**
	 * Broadcast service info message
	 * @param infoType type of info message
	 * @param target function name is need in messages like InfoServiceFunctionAdded
	 */
	protected async sendServiceInfo(infoType: InfoMessageType, target?: string, payload?: Record<string, unknown>) {
		return this.startActiveSpan('purista.sendServiceInfo', {}, undefined, async span => {
			const info = createInfoMessage(
				infoType,
				{
					serviceName: this.info.serviceName,
					serviceVersion: this.info.serviceVersion,
					serviceTarget: target ?? '',
					instanceId: this.eventBridge.instanceId,
				},
				{ payload },
			)

			const result = await this.eventBridge.emitMessage(info)

			span.end()
			return result
		})
	}

	protected getInvokeFunction<Invokes extends InvokeList>(
		serviceTarget: string,
		traceId?: TraceId,
		principalId?: PrincipalId,
		tenantId?: TenantId,
		invokes?: Invokes,
	) {
		const sender: EBMessageSenderAddress = {
			serviceName: this.info.serviceName,
			serviceVersion: this.info.serviceVersion,
			serviceTarget,
			instanceId: this.eventBridge.instanceId,
		}

		const invokeCommand = async <Payload, Parameter extends EmptyObject>(
			receiver: EBMessageAddress,
			invokePayload: Payload,
			invokeparameter: Parameter,
			contentType = 'application/json',
			contentEncoding = 'utf-8',
		): Promise<any> => {
			let payload = invokePayload
			let parameter = invokeparameter

			return await this.startActiveSpan(`${serviceTarget}.invoke`, {}, undefined, async span => {
				span.setAttributes({
					[PuristaSpanTag.ReceiverServiceName]: receiver.serviceName,
					[PuristaSpanTag.ReceiverServiceVersion]: receiver.serviceVersion,
					[PuristaSpanTag.ReceiverServiceTarget]: receiver.serviceTarget,
				})

				const payloadSchema =
					invokes?.[receiver.serviceName]?.[receiver.serviceVersion]?.[receiver.serviceTarget]?.payloadSchema

				if (payloadSchema) {
					const res = await validate(payloadSchema, payload)
					if (!res.success) {
						const err = new UnhandledError(StatusCode.BadRequest, 'invoke payload schema validation failed', {
							issues: res.issues,
							invokedFrom: sender,
							responseFrom: receiver,
						})

						span.recordException(err)
						span.setStatus({
							code: SpanStatusCode.ERROR,
							message: err.message,
						})

						throw err
					}
					payload = res.data as Payload
				}

				const parameterSchema =
					invokes?.[receiver.serviceName]?.[receiver.serviceVersion]?.[receiver.serviceTarget]?.parameterSchema

				if (parameterSchema) {
					const res = await validate(parameterSchema, parameter)
					if (!res.success) {
						const err = new UnhandledError(StatusCode.BadRequest, 'invoke parameter schema validation failed', {
							issues: res.issues,
							invokedFrom: sender,
							responseFrom: receiver,
						})

						span.recordException(err)
						span.setStatus({
							code: SpanStatusCode.ERROR,
							message: err.message,
						})

						throw err
					}

					parameter = res.data as Parameter
				}

				const msg: Readonly<Omit<Command, 'correlationId' | 'id' | 'timestamp'>> = Object.freeze({
					messageType: EBMessageType.Command,
					traceId,
					sender,
					receiver,
					contentType,
					contentEncoding,
					payload: {
						payload,
						parameter,
					},
					principalId,
					tenantId,
				})

				const outputSchema =
					invokes?.[receiver.serviceName]?.[receiver.serviceVersion]?.[receiver.serviceTarget]?.outputSchema

				if (!outputSchema) {
					return this.eventBridge.invoke(msg)
				}

				const response = await this.eventBridge.invoke(msg)

				const outResult = await validate(outputSchema, response)

				if (outResult.success) {
					span.setStatus({
						code: SpanStatusCode.OK,
						message: 'OK',
					})
					return outResult.data
				}

				const err = new UnhandledError(
					StatusCode.InternalServerError,
					'invoke response output schema validation failed',
					{
						issues: outResult.issues,
						invokedFrom: sender,
						responseFrom: receiver,
					},
				)

				span.recordException(err)
				span.setStatus({
					code: SpanStatusCode.ERROR,
					message: err.message,
				})

				throw err
			})
		}

		return invokeCommand.bind(this)
	}

	protected getAgentInvokeFunction<Invokes extends AgentInvokeList>(
		serviceTarget: string,
		traceId?: TraceId,
		principalId?: PrincipalId,
		tenantId?: TenantId,
		agentInvokes?: Invokes,
	) {
		const sender: EBMessageSenderAddress = {
			serviceName: this.info.serviceName,
			serviceVersion: this.info.serviceVersion,
			serviceTarget,
			instanceId: this.eventBridge.instanceId,
		}

		const agentInvoke = <
			InvokeResponseType = AgentProtocolResponse,
			PayloadType = AgentProtocolPayload,
			ParameterType = EmptyObject,
		>(
			receiver: EBMessageAddress,
			payload: PayloadType,
			parameter: ParameterType,
		) => {
			const commandMsg: Readonly<Omit<Command, 'correlationId' | 'id' | 'timestamp'>> = Object.freeze({
				messageType: EBMessageType.Command,
				traceId,
				sender,
				receiver,
				contentType: 'application/json',
				contentEncoding: 'utf-8',
				payload: {
					payload,
					parameter,
				},
				principalId,
				tenantId,
			})

			const descriptor = agentInvokes?.[receiver.serviceName]?.[receiver.serviceVersion]
			const payloadSchema = descriptor?.payloadSchema
			const parameterSchema = descriptor?.parameterSchema

			let resolveNext: ((result: IteratorResult<unknown>) => void) | undefined
			let rejectNext: ((error: unknown) => void) | undefined
			const bufferedValues: unknown[] = []
			let iteratorDone = false
			let iteratorError: unknown

			const emitValue = (value: unknown) => {
				if (iteratorDone) {
					return
				}
				if (resolveNext) {
					const resolve = resolveNext
					resolveNext = undefined
					rejectNext = undefined
					resolve({
						value,
						done: false,
					})
					return
				}
				bufferedValues.push(value)
			}

			const emitDone = () => {
				if (iteratorDone) {
					return
				}
				iteratorDone = true
				if (resolveNext) {
					const resolve = resolveNext
					resolveNext = undefined
					rejectNext = undefined
					resolve({
						value: undefined,
						done: true,
					})
				}
			}

			const emitError = (error: unknown) => {
				if (iteratorDone) {
					return
				}
				iteratorDone = true
				iteratorError = error
				if (rejectNext) {
					const reject = rejectNext
					resolveNext = undefined
					rejectNext = undefined
					reject(error)
				}
			}

			const streamOrInvoke = async () => {
				let sawStreamChunk = false

				const openRequest: Omit<StreamOpenRequest, 'id' | 'messageType' | 'timestamp' | 'correlationId'> = {
					traceId,
					sender,
					receiver,
					contentType: 'application/json',
					contentEncoding: 'utf-8',
					payload: {
						frameType: 'open',
						payload,
						parameter,
					},
					principalId,
					tenantId,
				}

				try {
					const handle = await this.eventBridge.openStream<unknown, unknown>(openRequest)
					let streamFinal: unknown
					for await (const frame of handle) {
						if (frame.payload.frameType === 'chunk') {
							sawStreamChunk = true
							emitValue(frame.payload.chunk)
							continue
						}

						if (frame.payload.frameType === 'complete') {
							streamFinal = frame.payload.final
							break
						}

						if (frame.payload.frameType === 'error') {
							throw new UnhandledError(
								StatusCode.InternalServerError,
								frame.payload.error?.message ?? 'agent stream failed',
								frame.payload.error,
							)
						}
					}

					if (streamFinal === undefined) {
						return [] as unknown[]
					}
					return streamFinal
				} catch (error) {
					if (sawStreamChunk) {
						throw error
					}

					const isStreamUnavailable =
						(error instanceof UnhandledError &&
							(error.errorCode === StatusCode.NotImplemented || error.errorCode === StatusCode.BadGateway)) ||
						(error instanceof Error &&
							(error.message.includes('does not support streams') || error.message.includes('InvalidCommand')))

					if (!isStreamUnavailable) {
						throw error
					}

					const fallback = await this.eventBridge.invoke(commandMsg)
					if (Array.isArray(fallback)) {
						for (const value of fallback) {
							emitValue(value)
						}
					} else {
						emitValue(fallback)
					}
					return fallback
				}
			}

			const invocationPromise = (async () => {
				return await this.startActiveSpan(`${serviceTarget}.agentInvoke`, {}, undefined, async span => {
					span.setAttributes({
						[PuristaSpanTag.ReceiverServiceName]: receiver.serviceName,
						[PuristaSpanTag.ReceiverServiceVersion]: receiver.serviceVersion,
						[PuristaSpanTag.ReceiverServiceTarget]: receiver.serviceTarget,
					})

					if (payloadSchema) {
						const res = await validate(payloadSchema, payload)
						if (!res.success) {
							const err = new UnhandledError(StatusCode.BadRequest, 'agent invoke payload schema validation failed', {
								issues: res.issues,
								invokedFrom: sender,
								responseFrom: receiver,
							})

							span.recordException(err)
							span.setStatus({
								code: SpanStatusCode.ERROR,
								message: err.message,
							})

							throw err
						}
					}

					if (parameterSchema) {
						const res = await validate(parameterSchema, parameter)
						if (!res.success) {
							const err = new UnhandledError(StatusCode.BadRequest, 'agent invoke parameter schema validation failed', {
								issues: res.issues,
								invokedFrom: sender,
								responseFrom: receiver,
							})

							span.recordException(err)
							span.setStatus({
								code: SpanStatusCode.ERROR,
								message: err.message,
							})

							throw err
						}
					}

					try {
						const result = await streamOrInvoke()
						emitDone()
						return result
					} catch (error) {
						emitError(error)
						throw error
					}
				})
			})()

			return {
				final: () => invocationPromise,
				[Symbol.asyncIterator]: async function* () {
					while (true) {
						if (bufferedValues.length > 0) {
							yield bufferedValues.shift() as unknown
							continue
						}

						if (iteratorError) {
							throw iteratorError
						}

						if (iteratorDone) {
							return
						}

						const next = await new Promise<IteratorResult<unknown>>((resolve, reject) => {
							resolveNext = resolve
							rejectNext = reject
						})

						if (next.done) {
							return
						}

						yield next.value
					}
				},
			} as unknown as AgentInvocation<InvokeResponseType>
		}

		return agentInvoke
	}

	protected getQueueNamespace(
		queueInvokes?: QueueInvokeList,
		traceId?: TraceId,
		principalId?: PrincipalId,
		tenantId?: TenantId,
	) {
		const enqueue = async <Payload, Params>(
			queueName: string,
			payload: Payload,
			parameter?: Params,
			options?: Omit<QueueEnqueueOptions<Payload, Params>, 'queueName' | 'payload' | 'parameter'>,
		) => {
			return this.enqueueQueue(queueName, payload, parameter, queueInvokes, traceId, principalId, tenantId, options)
		}

		const schedule = async <Payload, Params>(
			queueName: string,
			runAt: Date | number,
			payload: Payload,
			parameter?: Params,
			options?: Omit<QueueEnqueueOptions<Payload, Params>, 'queueName' | 'payload' | 'parameter' | 'delayMs'>,
		) => {
			const epoch = runAt instanceof Date ? runAt.getTime() : runAt
			const delayMs = Math.max(0, epoch - Date.now())
			return this.enqueueQueue(queueName, payload, parameter, queueInvokes, traceId, principalId, tenantId, {
				...options,
				delayMs,
			} as Omit<QueueEnqueueOptions<Payload, Params>, 'queueName' | 'payload' | 'parameter'>)
		}

		type QueueDescriptorType = typeof queueInvokes extends QueueInvokeList ? typeof queueInvokes : QueueInvokeList
		const queueDescriptors = (queueInvokes ?? {}) as QueueDescriptorType
		const enqueueProxy = createQueueEnqueueProxy<QueueDescriptorType>(enqueue, queueDescriptors)
		const scheduleProxy = createQueueScheduleProxy<QueueDescriptorType>(schedule, queueDescriptors)

		return {
			enqueue: enqueueProxy,
			scheduleAt: scheduleProxy,
		}
	}

	private createQueueTransformContext(
		queueName: string,
		queueInvokes?: QueueInvokeList,
		traceId?: TraceId,
		principalId?: PrincipalId,
		tenantId?: TenantId,
		loggerOverride?: Logger,
	): QueueTransformContext {
		const transformLogger =
			loggerOverride ??
			this.logger.getChildLogger({
				serviceTarget: queueName,
				queueName,
				customTraceId: traceId,
				principalId,
				tenantId,
			})

		const queueNamespace = this.getQueueNamespace(queueInvokes, traceId, principalId, tenantId)
		const contextBase = this.getContextFunctions(transformLogger, queueNamespace)

		return {
			...contextBase,
			resources: this.resources,
		}
	}

	private startLeaseHeartbeat(
		queueName: string,
		lease: QueueLease,
		lifecycle: QueueLifecycleConfig,
		logger: Logger,
	): LeaseHeartbeatController {
		if (lifecycle.autoHeartbeat === false || lifecycle.heartbeatIntervalMs <= 0 || lifecycle.maxLeaseExtensions <= 0) {
			return {
				stop: () => {
					// noop
				},
			}
		}

		let stopped = false
		let extensions = 0
		const timer = setInterval(() => {
			if (stopped) {
				return
			}
			if (extensions >= lifecycle.maxLeaseExtensions) {
				logger.warn(
					{ queueName, leaseId: lease.leaseId },
					'max lease extensions reached, letting queue message visibility expire',
				)
				stop()
				return
			}

			void this.queueBridge
				.extendLease(queueName, lease.leaseId, lifecycle.visibilityTimeoutMs)
				.then(() => {
					extensions += 1
				})
				.catch(err => {
					logger.warn({ err, queueName, leaseId: lease.leaseId }, 'failed to extend queue lease')
				})
		}, lifecycle.heartbeatIntervalMs)

		const stop = () => {
			if (stopped) {
				return
			}
			stopped = true
			clearInterval(timer)
		}

		// do not keep the event loop alive for tests/in-process workers
		const nodeTimer = timer as { unref?: () => void }
		nodeTimer.unref?.()

		return {
			stop,
		}
	}

	private async applyQueueBeforeExecuteTransform(
		queueDefinition: QueueDefinition<any, any, any, any, any> | undefined,
		message: QueueMessage,
		logger: Logger,
	): Promise<QueueMessage> {
		if (!queueDefinition?.transformBeforeExecute) {
			return message
		}

		const transformContext = this.createQueueTransformContext(
			message.queueName,
			undefined,
			message.traceId,
			undefined,
			undefined,
			logger,
		)

		const transformed = await queueDefinition.transformBeforeExecute.call(
			this,
			transformContext,
			message.payload as never,
			message.parameter as never,
		)

		const hasParameter = Object.hasOwn(transformed, 'parameter')

		return {
			...message,
			payload: transformed.payload,
			parameter: hasParameter ? transformed.parameter : message.parameter,
		}
	}

	private resolveDeadLetterQueueName(
		queueDefinition: QueueDefinition<any, any, any, any, any> | undefined,
		queueName: string,
	) {
		if (queueDefinition?.deadLetter?.queueName) {
			return queueDefinition.deadLetter.queueName
		}
		const capabilities = this.queueBridge.capabilities
		const prefix = capabilities.defaultDeadLetterPrefix ?? ''
		const suffix = capabilities.defaultDeadLetterSuffix ?? '.dead-letter'
		return `${prefix}${queueName}${suffix}`
	}

	private computeRetryDelay(lifecycle: QueueLifecycleConfig, attempt: number, requestedDelay?: number): number {
		if (typeof requestedDelay === 'number') {
			return Math.max(0, Math.min(requestedDelay, lifecycle.retryStrategy.maxDelayMs))
		}

		const exponent = Math.max(0, attempt - 1)
		const baseDelay = Math.min(
			lifecycle.retryStrategy.maxDelayMs,
			lifecycle.retryStrategy.initialDelayMs * Math.max(1, lifecycle.retryStrategy.multiplier ** exponent),
		)
		if (lifecycle.retryStrategy.jitterFactor <= 0) {
			return Math.round(baseDelay)
		}
		const jittered = baseDelay * (1 + lifecycle.retryStrategy.jitterFactor)
		return Math.round(Math.min(lifecycle.retryStrategy.maxDelayMs, jittered))
	}

	private hasRetryWindowExpired(lifecycle: QueueLifecycleConfig, message: QueueMessage) {
		return Date.now() - message.createdAt >= lifecycle.retryWindowMs
	}

	private async scheduleRetryOrDeadLetter(
		workerQueueName: string,
		queueDefinition: QueueDefinition<any, any, any, any, any> | undefined,
		lease: QueueLease,
		request?: QueueRetryRequest,
	) {
		const lifecycle = queueDefinition?.lifecycle ?? defaultQueueLifecycleConfig
		const attemptsExceeded = lease.message.attempt >= lifecycle.maxAttempts
		const retryWindowExpired = this.hasRetryWindowExpired(lifecycle, lease.message)

		if (attemptsExceeded || retryWindowExpired) {
			const fallbackReason = attemptsExceeded ? 'max_attempts_exceeded' : 'retry_window_expired'
			await this.deadLetterJob(queueDefinition, workerQueueName, lease, request?.reason ?? fallbackReason)
			return
		}

		const delayMs = this.computeRetryDelay(lifecycle, lease.message.attempt, request?.delayMs)
		await this.nackQueueJob(workerQueueName, lease.leaseId, lease.message.id, {
			...request,
			delayMs,
		})
	}

	private async deadLetterJob(
		queueDefinition: QueueDefinition<any, any, any, any, any> | undefined,
		queueName: string,
		lease: QueueLease,
		reason?: string,
	) {
		const dlq = this.resolveDeadLetterQueueName(queueDefinition, queueName)
		await this.moveMessageToDeadLetter(dlq, lease.message, reason)
		await this.ackQueueJob(queueName, lease.leaseId, lease.message.id)
	}

	private async runQueueWorkerBeforeGuards(
		worker: QueueWorkerDefinition<any, any, any, any, any>,
		context: QueueJobContext,
		message: QueueMessage,
	) {
		const beforeGuards = worker.beforeGuards
		if (!beforeGuards || Object.keys(beforeGuards).length === 0) {
			return
		}
		await context.startActiveSpan(`${worker.name}.beforeGuards`, {}, undefined, async () => {
			const guards = Object.entries(beforeGuards).map(([name, hook]) =>
				context.startActiveSpan(`${worker.name}.beforeGuard.${name}`, {}, undefined, () =>
					hook.call(this, context, message),
				),
			)
			await Promise.all(guards)
		})
	}

	private async runQueueWorkerAfterGuards(
		worker: QueueWorkerDefinition<any, any, any, any, any>,
		context: QueueJobContext,
		message: QueueMessage,
		result: QueueHandlerResult | undefined,
	) {
		const afterGuards = worker.afterGuards
		if (!afterGuards || Object.keys(afterGuards).length === 0) {
			return
		}
		await context.startActiveSpan(`${worker.name}.afterGuards`, {}, undefined, async () => {
			const guards = Object.entries(afterGuards).map(([name, hook]) =>
				context.startActiveSpan(`${worker.name}.afterGuard.${name}`, {}, undefined, () =>
					hook.call(this, context, result, message),
				),
			)
			await Promise.all(guards)
		})
	}

	private annotateQueueSpan(span: Span, queueName: string, jobId?: string, attempt?: number) {
		span.setAttribute(PuristaSpanTag.QueueName, queueName)
		span.setAttribute(PuristaSpanTag.QueueBridge, this.queueBridge.name)
		if (jobId) {
			span.setAttribute(PuristaSpanTag.QueueJobId, jobId)
		}
		if (typeof attempt === 'number') {
			span.setAttribute(PuristaSpanTag.QueueAttempt, attempt)
		}
	}

	private async queueSpan<T>(
		name: PuristaSpanName,
		queueName: string,
		jobId: string | undefined,
		attributes: Record<string, string | number | boolean | undefined> | undefined,
		fn: () => Promise<T>,
	) {
		return this.wrapInSpan(name, {}, async span => {
			this.annotateQueueSpan(span, queueName, jobId)
			if (attributes) {
				for (const [key, value] of Object.entries(attributes)) {
					if (value !== undefined) {
						span.setAttribute(key, value)
					}
				}
			}
			return fn()
		})
	}

	private ackQueueJob(queueName: string, leaseId: string, jobId?: string) {
		return this.queueSpan(PuristaSpanName.QueueAck, queueName, jobId, undefined, () =>
			this.queueBridge.ack(queueName, leaseId),
		)
	}

	private nackQueueJob(queueName: string, leaseId: string, jobId: string | undefined, request: QueueRetryRequest = {}) {
		const attrs = {
			[PuristaSpanTag.QueueReason]: request.reason,
			[PuristaSpanTag.QueueDelay]: request.delayMs,
		}
		return this.queueSpan(PuristaSpanName.QueueNack, queueName, jobId, attrs, () =>
			this.queueBridge.nack(queueName, leaseId, request),
		)
	}

	private moveMessageToDeadLetter(targetQueue: string, message: QueueMessage, reason?: string) {
		const attrs = {
			[PuristaSpanTag.QueueReason]: reason,
		}
		return this.queueSpan(PuristaSpanName.QueueDeadLetter, targetQueue, message.id, attrs, () =>
			this.queueBridge.moveToDeadLetter(targetQueue, message, reason),
		)
	}

	private getQueueWorkerParallelism(queueName: string) {
		return (
			this.queueWorkerDefinitionList
				.filter(worker => worker.queueName === queueName)
				.reduce((sum, worker) => sum + Math.max(1, worker.maxParallelHandlers ?? 1), 0) || 1
		)
	}

	private evaluateQueueHealth(queueName: string, metrics: QueueMetrics) {
		const parallelism = this.getQueueWorkerParallelism(queueName)
		const backlogWarn = parallelism * 5
		const backlogError = parallelism * 20

		if (metrics.deadLetter > 0) {
			return { status: 'warn', reason: 'dead-letter backlog detected' } as const
		}
		if (metrics.pending > backlogError) {
			return { status: 'error', reason: 'queue backlog above emergency threshold' } as const
		}
		if (metrics.pending > backlogWarn) {
			return { status: 'warn', reason: 'queue backlog above warning threshold' } as const
		}
		return { status: 'ok' as const }
	}

	private async enqueueQueue<Payload, Params>(
		queueName: string,
		payload: Payload,
		parameter: Params | undefined,
		queueInvokes?: QueueInvokeList,
		traceId?: TraceId,
		principalId?: PrincipalId,
		tenantId?: TenantId,
		options?: Omit<QueueEnqueueOptions<Payload, Params>, 'queueName' | 'payload' | 'parameter'>,
	): Promise<QueueEnqueueResult> {
		const descriptor = queueInvokes?.[queueName]
		if (queueInvokes && !descriptor) {
			throw new UnhandledError(StatusCode.Forbidden, `queue "${queueName}" is not allowed in this handler`)
		}

		const queueDefinition = this.getQueueDefinition(queueName)
		if (!queueDefinition) {
			throw new UnhandledError(StatusCode.NotFound, `queue "${queueName}" is not registered in this service`)
		}

		let validatedPayload = payload
		const payloadSchema = descriptor?.payloadSchema ?? queueDefinition?.payloadSchema
		if (payloadSchema) {
			const validation = await validate(payloadSchema, payload)
			if (!validation.success) {
				throw new UnhandledError(StatusCode.BadRequest, 'queue payload schema validation failed', {
					queueName,
					issues: validation.issues,
				})
			}
			validatedPayload = validation.data as Payload
		}

		let validatedParameter = parameter
		const parameterSchema = descriptor?.parameterSchema ?? queueDefinition?.parameterSchema
		if (parameterSchema) {
			const validation = await validate(parameterSchema, parameter)
			if (!validation.success) {
				throw new UnhandledError(StatusCode.BadRequest, 'queue parameter schema validation failed', {
					queueName,
					issues: validation.issues,
				})
			}
			validatedParameter = validation.data as Params
		}

		let normalizedPayload = validatedPayload
		let normalizedParameter = validatedParameter

		if (queueDefinition?.transformBeforeEnqueue) {
			const transformContext = this.createQueueTransformContext(queueName, queueInvokes, traceId, principalId, tenantId)
			const transformed = await queueDefinition.transformBeforeEnqueue.call(
				this,
				transformContext,
				validatedPayload as never,
				validatedParameter as never,
			)
			normalizedPayload = transformed.payload as Payload
			if (Object.hasOwn(transformed, 'parameter')) {
				normalizedParameter = transformed.parameter as Params | undefined
			}
		}

		const lifecycle = queueDefinition?.lifecycle ?? defaultQueueLifecycleConfig

		return this.wrapInSpan(PuristaSpanName.QueueEnqueue, {}, async span => {
			this.annotateQueueSpan(span, queueName)
			const result = await this.queueBridge.enqueue({
				queueName,
				payload: normalizedPayload,
				parameter: normalizedParameter,
				delayMs: options?.delayMs,
				idempotencyKey: options?.idempotencyKey,
				headers: options?.headers,
				maxAttempts: options?.maxAttempts ?? lifecycle.maxAttempts,
				priority: options?.priority,
				leaseTtlMs: options?.leaseTtlMs ?? lifecycle.visibilityTimeoutMs,
			})
			span.setAttribute(PuristaSpanTag.QueueJobId, result.jobId)
			return result
		})
	}

	protected getConsumeStreamFunction<StreamInvokes extends StreamInvokeList>(
		serviceTarget: string,
		traceId?: TraceId,
		principalId?: PrincipalId,
		tenantId?: TenantId,
		streamInvokes?: StreamInvokes,
	): OpenStreamFunction {
		const sender: EBMessageSenderAddress = {
			serviceName: this.info.serviceName,
			serviceVersion: this.info.serviceVersion,
			serviceTarget,
			instanceId: this.eventBridge.instanceId,
		}

		const consumeStream = async <Payload, Parameter extends EmptyObject>(
			receiver: EBMessageAddress,
			streamPayload: Payload,
			streamParameter: Parameter,
			contentType = 'application/json',
			contentEncoding = 'utf-8',
		) => {
			let payload = streamPayload
			let parameter = streamParameter

			const streamConfig = streamInvokes?.[receiver.serviceName]?.[receiver.serviceVersion]?.[receiver.serviceTarget]

			const payloadSchema = streamConfig?.payloadSchema
			if (payloadSchema) {
				const res = await validate(payloadSchema, payload)
				if (!res.success) {
					throw new UnhandledError(StatusCode.BadRequest, 'stream payload schema validation failed', {
						issues: res.issues,
						invokedFrom: sender,
						responseFrom: receiver,
					})
				}
				payload = res.data as Payload
			}

			const parameterSchema = streamConfig?.parameterSchema
			if (parameterSchema) {
				const res = await validate(parameterSchema, parameter)
				if (!res.success) {
					throw new UnhandledError(StatusCode.BadRequest, 'stream parameter schema validation failed', {
						issues: res.issues,
						invokedFrom: sender,
						responseFrom: receiver,
					})
				}
				parameter = res.data as Parameter
			}

			const message: Omit<StreamOpenRequest, 'id' | 'messageType' | 'timestamp' | 'correlationId'> = {
				traceId,
				sender,
				receiver,
				contentType,
				contentEncoding,
				payload: {
					frameType: 'open',
					payload,
					parameter,
				},
				principalId,
				tenantId,
			}

			const handle = await this.eventBridge.openStream(message)

			return {
				sessionId: handle.sessionId,
				cancel: handle.cancel,
				[Symbol.asyncIterator]: async function* () {
					for await (const frame of handle) {
						if (
							frame.payload.frameType === 'chunk' &&
							streamConfig?.chunkSchema &&
							streamConfig.validateChunk !== false
						) {
							const res = await validate(streamConfig.chunkSchema, frame.payload.chunk)
							if (!res.success) {
								throw new UnhandledError(StatusCode.InternalServerError, 'stream chunk validation failed', {
									issues: res.issues,
									invokedFrom: sender,
									responseFrom: receiver,
								})
							}
						}

						if (
							frame.payload.frameType === 'complete' &&
							streamConfig?.finalSchema &&
							streamConfig.validateFinal !== false
						) {
							const res = await validate(streamConfig.finalSchema, frame.payload.final)
							if (!res.success) {
								throw new UnhandledError(StatusCode.InternalServerError, 'stream final validation failed', {
									issues: res.issues,
									invokedFrom: sender,
									responseFrom: receiver,
								})
							}
						}
						yield frame
					}
				},
			}
		}

		return consumeStream.bind(this) as OpenStreamFunction
	}

	protected getEmitFunction<EmitList extends Record<string, Schema> = EmptyObject>(
		serviceTarget: string,
		traceId?: TraceId,
		principalId?: PrincipalId,
		tenantId?: TenantId,
		emitList?: EmitList,
	) {
		const sender: EBMessageSenderAddress = {
			serviceName: this.info.serviceName,
			serviceVersion: this.info.serviceVersion,
			serviceTarget,
			instanceId: this.eventBridge.instanceId,
		}

		const emitCustomEvent = async <K extends keyof EmitList, Payload = EmitList[K]>(
			eventName: K,
			eventPayload?: Payload,
			contentType = 'application/json',
			contentEncoding = 'utf-8',
		) => {
			await this.startActiveSpan('purista.emitEvent', {}, undefined, async span => {
				const eventSchemas = emitList as EmitSchemaList<EmitList>
				const schema = eventSchemas[eventName]

				if (!schema) {
					const err = new UnhandledError(StatusCode.InternalServerError, `No schema for ${eventName as string} found`, {
						eventName,
					})
					span.recordException(err)
					span.setStatus({
						code: SpanStatusCode.ERROR,
						message: err.message,
					})
					throw err
				}

				const validation = await validate(schema, eventPayload)
				if (!validation.success) {
					const err = new UnhandledError(
						StatusCode.InternalServerError,
						`Payload validation for event ${eventName as string} failed`,
						{ eventName, issues: validation.issues },
					)
					span.recordException(err)
					span.setStatus({
						code: SpanStatusCode.ERROR,
						message: err.message,
					})
					throw err
				}

				span.addEvent(eventName as string)
				const msg: Readonly<Omit<CustomMessage<Infer<typeof schema>>, 'id' | 'timestamp'>> = Object.freeze({
					messageType: EBMessageType.CustomMessage,
					traceId,
					contentType,
					contentEncoding,
					sender,
					eventName: eventName as string,
					payload: validation.data,
					principalId,
					tenantId,
				})

				const res = this.eventBridge.emitMessage(msg)

				span.setStatus({
					code: SpanStatusCode.OK,
					message: 'OK',
				})

				return res
			})
		}

		return emitCustomEvent.bind(this)
	}

	public getContextFunctions(logger: Logger, queueNamespace?: QueueContext): ContextBase {
		const getSecretFunction = async function (this: Service<S>, ...secretNames: string[]) {
			return this.wrapInSpan(PuristaSpanName.SecretStoreGetValue, {}, async span => {
				try {
					span.setAttributes({
						[PuristaSpanTag.StoreName]: this.secretStore.name,
						[PuristaSpanTag.StoreType]: StoreType.SecretStore,
					})
					return this.secretStore.getSecret(...secretNames)
				} catch (err) {
					span.recordException(err as Error)
					throw err
				}
			})
		}
		const getSecret: SecretGetterFunction = getSecretFunction.bind(this)

		const setSecretFunction = async function (this: Service<S>, secretName: string, value: string) {
			return this.wrapInSpan(PuristaSpanName.SecretStoreGetValue, {}, async span => {
				try {
					span.setAttributes({
						[PuristaSpanTag.StoreName]: this.secretStore.name,
						[PuristaSpanTag.StoreType]: StoreType.SecretStore,
					})
					return this.secretStore.setSecret(secretName, value)
				} catch (err) {
					span.recordException(err as Error)
					throw err
				}
			})
		}
		const setSecret: SecretSetterFunction = setSecretFunction.bind(this)

		const removeSecretFunction = async function (this: Service<S>, secretName: string) {
			return this.wrapInSpan(PuristaSpanName.SecretStoreGetValue, {}, async span => {
				try {
					span.setAttributes({
						[PuristaSpanTag.StoreName]: this.secretStore.name,
						[PuristaSpanTag.StoreType]: StoreType.SecretStore,
					})
					return this.secretStore.removeSecret(secretName)
				} catch (err) {
					span.recordException(err as Error)
					throw err
				}
			})
		}
		const removeSecret: SecretDeleteFunction = removeSecretFunction.bind(this)

		const getConfigFunction = async function (this: Service<S>, ...configNames: string[]) {
			return this.wrapInSpan(PuristaSpanName.ConfigStoreGetValue, {}, async span => {
				try {
					span.setAttributes({
						[PuristaSpanTag.StoreName]: this.configStore.name,
						[PuristaSpanTag.StoreType]: StoreType.ConfigStore,
					})
					return this.configStore.getConfig(...configNames)
				} catch (err) {
					span.recordException(err as Error)
					throw err
				}
			})
		}
		const getConfig: ConfigGetterFunction = getConfigFunction.bind(this)

		const setConfigFunction = async function (this: Service<S>, configName: string, value: unknown) {
			return this.wrapInSpan(PuristaSpanName.ConfigStoreGetValue, {}, async span => {
				try {
					span.setAttributes({
						[PuristaSpanTag.StoreName]: this.configStore.name,
						[PuristaSpanTag.StoreType]: StoreType.ConfigStore,
					})
					return this.configStore.setConfig(configName, value)
				} catch (err) {
					span.recordException(err as Error)
					throw err
				}
			})
		}
		const setConfig: ConfigSetterFunction = setConfigFunction.bind(this)

		const removeConfigFunction = async function (this: Service<S>, configName: string) {
			return this.wrapInSpan(PuristaSpanName.ConfigStoreGetValue, {}, async span => {
				try {
					span.setAttributes({
						[PuristaSpanTag.StoreName]: this.configStore.name,
						[PuristaSpanTag.StoreType]: StoreType.ConfigStore,
					})
					return this.configStore.removeConfig(configName)
				} catch (err) {
					span.recordException(err as Error)
					throw err
				}
			})
		}
		const removeConfig: ConfigDeleteFunction = removeConfigFunction.bind(this)

		const getStateFunction = async function (this: Service<S>, ...stateNames: string[]) {
			return this.wrapInSpan(PuristaSpanName.StateStoreGetValue, {}, async span => {
				try {
					span.setAttributes({
						[PuristaSpanTag.StoreName]: this.stateStore.name,
						[PuristaSpanTag.StoreType]: StoreType.StateStore,
					})
					return this.stateStore.getState(...stateNames)
				} catch (err) {
					span.recordException(err as Error)
					throw err
				}
			})
		}
		const getState: StateGetterFunction = getStateFunction.bind(this)

		const setStateFunction = async function (this: Service<S>, stateName: string, value: unknown) {
			return this.wrapInSpan(PuristaSpanName.StateStoreGetValue, {}, async span => {
				try {
					span.setAttributes({
						[PuristaSpanTag.StoreName]: this.stateStore.name,
						[PuristaSpanTag.StoreType]: StoreType.StateStore,
					})
					return this.stateStore.setState(stateName, value)
				} catch (err) {
					span.recordException(err as Error)
					throw err
				}
			})
		}
		const setState: StateSetterFunction = setStateFunction.bind(this)

		const removeStateFunction = async function (this: Service<S>, stateName: string) {
			return this.wrapInSpan(PuristaSpanName.StateStoreGetValue, {}, async span => {
				try {
					span.setAttributes({
						[PuristaSpanTag.StoreName]: this.stateStore.name,
						[PuristaSpanTag.StoreType]: StoreType.StateStore,
					})
					return this.stateStore.removeState(stateName)
				} catch (err) {
					span.recordException(err as Error)
					throw err
				}
			})
		}
		const removeState: StateDeleteFunction = removeStateFunction.bind(this)

		const queue = queueNamespace ?? this.getQueueNamespace()

		return {
			logger,
			wrapInSpan: this.wrapInSpan.bind(this),
			startActiveSpan: this.startActiveSpan.bind(this),
			secrets: {
				getSecret,
				setSecret,
				removeSecret,
			},
			configs: {
				getConfig,
				setConfig,
				removeConfig,
			},
			states: {
				getState,
				setState,
				removeState,
			},
			queue,
		}
	}

	/**
	 * Called when a command is received by the service
	 *
	 * @param message Command envelope to execute
	 */
	public async executeCommand(message: Readonly<Command>) {
		const command = this.commands.get(message.receiver.serviceTarget)

		const context = deserializeOtp(this.logger, message.otp)

		return this.startActiveSpan(command?.commandName ?? 'purista.executeCommand', {}, context, async span => {
			const traceId = message.traceId

			const logger = this.logger.getChildLogger({
				serviceTarget: command?.commandName,
				...span.spanContext(),
				customTraceId: traceId,
				principalId: message.principalId,
				tenantId: message.tenantId,
			})

			if (message.principalId) {
				span.setAttribute(PuristaSpanTag.PrincipalId, message.principalId)
			}

			if (message.tenantId) {
				span.setAttribute(PuristaSpanTag.TenantId, message.tenantId)
			}

			if (!command) {
				logger.error({ message: getCleanedMessage(message) }, 'received invalid command')

				span.setStatus({
					code: SpanStatusCode.ERROR,
					message: 'received invalid command',
				})
				return await this.startActiveSpan('sendErrorResponse', {}, undefined, async () =>
					createErrorResponse(this.eventBridge.instanceId, message, StatusCode.NotImplemented),
				)
			}

			try {
				const { payload, parameter } = await commandTransformInput(this, logger, command, message)
				const queueClient = this.getQueueNamespace(
					this.resolveQueueInvokes(command.queueInvokes),
					traceId,
					message.principalId,
					message.tenantId,
				)

				let result = await this.startActiveSpan(
					`${command.commandName}.functionExecution`,
					{},
					undefined,
					async _subSpan => {
						const contextBase = this.getContextFunctions(logger, queueClient)
						const context: CommandFunctionContext = {
							message,
							emit: this.getEmitFunction(
								command.commandName,
								traceId,
								message.principalId,
								message.tenantId,
								command.emitList,
							),
							...contextBase,
							service: createInvokeFunctionProxy(
								this.getInvokeFunction(
									command.commandName,
									traceId,
									message.principalId,
									message.tenantId,
									command.invokes,
								),
							),
							stream: createOpenStreamFunctionProxy(
								this.getConsumeStreamFunction(
									command.commandName,
									traceId,
									message.principalId,
									message.tenantId,
									command.streamInvokes,
								),
							),
							invokeAgent: createAgentInvokeFunctionProxy(
								this.getAgentInvokeFunction(
									command.commandName,
									traceId,
									message.principalId,
									message.tenantId,
									command.agentInvokes,
								),
							),
							resources: this.resources,
						} as unknown as CommandFunctionContext
						const call = command.call.bind(this, context)
						return (await call(payload as Readonly<typeof payload>, parameter as Readonly<typeof parameter>)) as unknown
					},
				)

				if (Object.keys(command.hooks.afterGuard ?? {}).length) {
					const guards = command.hooks.afterGuard

					await this.startActiveSpan(`${command.commandName}.afterGuardHooks`, {}, undefined, async () => {
						const guardsPromises: Promise<void>[] = []

						for (const [name, hook] of Object.entries(guards ?? {})) {
							const contextBase = this.getContextFunctions(logger, queueClient)
							const context: CommandFunctionContext = {
								message,
								emit: this.getEmitFunction(
									command.commandName,
									traceId,
									message.principalId,
									message.tenantId,
									command.emitList,
								),
								...contextBase,
								service: createInvokeFunctionProxy(
									this.getInvokeFunction(
										command.commandName,
										traceId,
										message.principalId,
										message.tenantId,
										command.invokes,
									),
								),
								stream: createOpenStreamFunctionProxy(
									this.getConsumeStreamFunction(
										command.commandName,
										traceId,
										message.principalId,
										message.tenantId,
										command.streamInvokes,
									),
								),
								invokeAgent: createAgentInvokeFunctionProxy(
									this.getAgentInvokeFunction(
										command.commandName,
										traceId,
										message.principalId,
										message.tenantId,
										command.agentInvokes,
									),
								),
								resources: this.resources,
							} as unknown as CommandFunctionContext

							const guardPromise = this.wrapInSpan(`afterGuardHook.${name}`, {}, async _subSpan => {
								return hook.bind(this)(
									context,
									result as Readonly<typeof result>,
									payload as Readonly<typeof payload>,
									parameter as Readonly<typeof parameter>,
								)
							})
							guardsPromises.push(guardPromise)
						}

						await Promise.all(guardsPromises)
					})
				}

				if (command.hooks.transformOutput) {
					const transformOutput = command.hooks.transformOutput
					await this.startActiveSpan(`${command.commandName}.outputTransformation`, {}, undefined, async subSpan => {
						const afterTransform = transformOutput.transformFunction.bind(this, {
							message,
							...this.getContextFunctions(logger, queueClient),
							resources: this.resources,
						})
						const resultTransformed = await afterTransform(
							result as Readonly<typeof result>,
							parameter as Readonly<typeof parameter>,
						)

						const validationResult = await validate(transformOutput.transformOutputSchema, resultTransformed)
						if (!validationResult.success) {
							const err = new UnhandledError(StatusCode.InternalServerError, undefined, validationResult.issues)
							subSpan.recordException(err)
							logger.warn({ ...subSpan.spanContext(), err }, 'transform output validation failed:', err.message)

							subSpan.setStatus({
								code: SpanStatusCode.ERROR,
								message: 'transform output validation failed',
							})
							throw err
						}
						result = validationResult.data as unknown
					})
				}

				return await this.startActiveSpan(`${command.commandName}.success`, {}, undefined, async subSpan => {
					if (command.eventName) {
						subSpan.addEvent(command.eventName)
						this.emit(`custom-${command.eventName}`, result)
					}
					return {
						...createSuccessResponse(this.eventBridge.instanceId, message, result, command.eventName),
						otp: serializeOtp(),
					}
				})
			} catch (error) {
				span.recordException(error as Error)

				if (error instanceof HandledError) {
					this.emit(ServiceEventsNames.CommandHandledError, {
						commandName: command.commandName,
						error,
						traceId,
					})
					span.setStatus({
						code: SpanStatusCode.ERROR,
						message: error.message,
					})

					return await this.startActiveSpan('sendErrorResponse', {}, undefined, async () =>
						createErrorResponse(this.eventBridge.instanceId, message, error.errorCode, error),
					)
				}

				this.emit(ServiceEventsNames.CommandUnhandledError, {
					commandName: command.commandName,
					error,
					traceId,
				})

				logger.error(
					{ err: error, message: getCleanedMessage(message), ...span.spanContext() },
					'executeCommand unhandled error',
				)

				span.setStatus({
					code: SpanStatusCode.ERROR,
					message: 'executeCommand unhandled error',
				})

				return await this.startActiveSpan(`${command.commandName}.error`, {}, undefined, async () =>
					createErrorResponse(this.eventBridge.instanceId, message, StatusCode.InternalServerError, error),
				)
			}
		})
	}

	public async registerCommand(
		commandDefinition: CommandDefinition<
			any,
			any,
			any,
			any,
			any,
			any,
			any,
			any,
			any,
			any,
			S['Resources'],
			any,
			any,
			any
		>,
	): Promise<void> {
		return this.startActiveSpan('purista.registerCommand', {}, undefined, async span => {
			this.logger.debug({ ...this.serviceInfo, ...span.spanContext() }, 'register command')

			span.setAttributes({
				serviceName: this.serviceInfo.serviceName,
				serviceVersion: this.serviceInfo.serviceVersion,
				commandName: commandDefinition.commandName,
			})

			this.commands.set(commandDefinition.commandName, commandDefinition)

			await this.eventBridge.registerCommand(
				{
					serviceName: this.serviceInfo.serviceName,
					serviceVersion: this.serviceInfo.serviceVersion,
					serviceTarget: commandDefinition.commandName,
				},
				this.executeCommand.bind(this),
				commandDefinition.metadata,
				commandDefinition.eventBridgeConfig,
			)

			span.end()
		})
	}

	protected startQueueWorkers() {
		if (this.queueWorkerDefinitionList.length === 0) {
			return
		}
		this.queueWorkersShouldStop = false
		for (const worker of this.queueWorkerDefinitionList) {
			const parallelism = worker.mode === 'sequential' ? 1 : Math.max(1, worker.maxParallelHandlers)
			for (let slot = 0; slot < parallelism; slot += 1) {
				const task = this.runQueueWorker(worker, slot)
				this.queueWorkerTasks.add(task)
				task.finally(() => this.queueWorkerTasks.delete(task))
			}
		}
	}

	protected async stopQueueWorkers() {
		this.queueWorkersShouldStop = true
		await Promise.allSettled(Array.from(this.queueWorkerTasks))
		this.queueWorkerTasks.clear()
	}

	private async runQueueWorker(worker: QueueWorkerDefinition<any, any, any, any, any>, slot = 0): Promise<void> {
		const workerLogger = this.logger.getChildLogger({
			serviceTarget: `${worker.name}:${worker.queueName}:${slot}`,
		})

		while (!this.queueWorkersShouldStop) {
			let lease: QueueLease | undefined
			let jobState: { handled: boolean } | undefined
			let heartbeat: LeaseHeartbeatController | undefined
			try {
				lease = await this.wrapInSpan(PuristaSpanName.QueueLease, {}, async span => {
					span.setAttribute(PuristaSpanTag.QueueName, worker.queueName)
					span.setAttribute(PuristaSpanTag.QueueBridge, this.queueBridge.name)
					const result = await this.queueBridge.leaseNext(worker.queueName)
					if (result) {
						this.annotateQueueSpan(span, worker.queueName, result.message.id, result.message.attempt)
					}
					return result
				})
				if (!lease) {
					await this.waitForNextPoll(worker)
					continue
				}

				const activeLease = lease
				const queueDefinition = this.getQueueDefinition(worker.queueName)
				activeLease.message = await this.applyQueueBeforeExecuteTransform(
					queueDefinition,
					activeLease.message,
					workerLogger,
				)
				const lifecycle = queueDefinition?.lifecycle ?? defaultQueueLifecycleConfig

				heartbeat = this.startLeaseHeartbeat(worker.queueName, activeLease, lifecycle, workerLogger)
				jobState = { handled: false }
				const stopHeartbeat = () => heartbeat?.stop()

				const context = this.createQueueJobContext(
					worker,
					queueDefinition,
					activeLease,
					workerLogger,
					jobState,
					stopHeartbeat,
				)
				await this.runQueueWorkerBeforeGuards(worker, context, activeLease.message)
				const result = await this.startActiveSpan(PuristaSpanName.QueueProcess, {}, undefined, async span => {
					this.annotateQueueSpan(span, worker.queueName, activeLease.message.id, activeLease.message.attempt)
					return worker.handler.call(this, context, activeLease.message)
				})
				await this.runQueueWorkerAfterGuards(worker, context, activeLease.message, result)

				if (!jobState.handled) {
					await this.handleQueueResult(worker, queueDefinition, activeLease, result, jobState, stopHeartbeat)
				}
			} catch (err) {
				heartbeat?.stop()
				workerLogger.error({ err }, 'queue worker execution failed')
				if (lease && !jobState?.handled) {
					try {
						await this.nackQueueJob(worker.queueName, lease.leaseId, lease.message.id, {
							reason: err instanceof Error ? err.message : 'queue worker failure',
						})
					} catch (nackErr) {
						workerLogger.error({ err: nackErr }, 'nack failed after worker error')
					}
				}
				await this.waitForNextPoll(worker)
			} finally {
				heartbeat?.stop()
				if (worker.mode === 'interval') {
					await this.waitForNextPoll(worker)
				}
			}
		}
	}

	private async waitForNextPoll(worker: QueueWorkerDefinition<any, any, any, any, any>) {
		const delay = worker.mode === 'interval' ? (worker.intervalMs ?? 1_000) : 200
		await new Promise(resolve => {
			setTimeout(resolve, delay)
		})
	}

	private createQueueJobContext(
		worker: QueueWorkerDefinition<any, any, any, any, any>,
		queueDefinition: QueueDefinition<any, any, any, any, any> | undefined,
		lease: QueueLease,
		logger: Logger,
		jobState: { handled: boolean },
		stopHeartbeat: () => void,
	): QueueJobContext {
		const settle = () => {
			if (jobState.handled) {
				return false
			}
			jobState.handled = true
			stopHeartbeat()
			return true
		}

		const jobControls = {
			complete: async (_output?: unknown, _headers?: Record<string, string>) => {
				if (!settle()) return
				await this.ackQueueJob(worker.queueName, lease.leaseId, lease.message.id)
			},
			retry: async (request?: QueueRetryRequest) => {
				if (!settle()) return
				await this.scheduleRetryOrDeadLetter(worker.queueName, queueDefinition, lease, request)
			},
			fail: async (reason: string, fatal?: boolean) => {
				if (!settle()) return
				if (fatal) {
					await this.deadLetterJob(queueDefinition, worker.queueName, lease, reason)
				} else {
					await this.scheduleRetryOrDeadLetter(worker.queueName, queueDefinition, lease, { reason })
				}
			},
			extendLease: async (durationMs: number) => {
				await this.queueBridge.extendLease(worker.queueName, lease.leaseId, durationMs)
			},
		}

		const traceId = lease.message.traceId

		return {
			message: lease.message,
			job: jobControls,
			emit: this.getEmitFunction(worker.name, traceId, undefined, undefined, {}),
			...this.getContextFunctions(logger),
			service: createInvokeFunctionProxy(this.getInvokeFunction(worker.name, traceId, undefined, undefined, {})),
			stream: createOpenStreamFunctionProxy(
				this.getConsumeStreamFunction(worker.name, traceId, undefined, undefined, {}),
			),
			resources: this.resources,
		} as QueueJobContext
	}

	private async handleQueueResult(
		worker: QueueWorkerDefinition<any, any, any, any, any>,
		queueDefinition: QueueDefinition<any, any, any, any, any> | undefined,
		lease: QueueLease,
		result: QueueHandlerResult | undefined,
		jobState: { handled: boolean },
		stopHeartbeat: () => void,
	) {
		jobState.handled = true
		stopHeartbeat()

		if (!result || result.status === 'success') {
			await this.ackQueueJob(worker.queueName, lease.leaseId, lease.message.id)
			return
		}

		if (result.status === 'retry') {
			await this.scheduleRetryOrDeadLetter(worker.queueName, queueDefinition, lease, {
				delayMs: result.delayMs,
				reason: result.reason,
			})
			return
		}

		if (result.status === 'fail') {
			if (result.fatal) {
				await this.deadLetterJob(queueDefinition, worker.queueName, lease, result.reason)
			} else {
				await this.scheduleRetryOrDeadLetter(worker.queueName, queueDefinition, lease, {
					reason: result.reason,
					delayMs: result.delayMs,
				})
			}
		}
	}

	public async getServiceHealth(): Promise<ServiceHealthState> {
		const eventBridgeHealthy = await this.eventBridge.isHealthy()
		const hasQueues = this.hasQueueFeatures()

		let queueBridgeHealthy = true
		let queues: QueueHealthState[] = []

		if (hasQueues) {
			queueBridgeHealthy = await this.queueBridge.isHealthy()
			queues = await Promise.all(
				this.queueDefinitionList.map(async queue => {
					try {
						const metrics = await this.queueBridge.metrics(queue.queueName)
						this.queueMetricsCache.set(queue.queueName, metrics)
						const health = this.evaluateQueueHealth(queue.queueName, metrics)
						return {
							queueName: queue.queueName,
							status: health.status,
							reason: health.reason,
							metrics,
						} as QueueHealthState
					} catch (error) {
						const fallback: QueueMetrics = { pending: 0, inflight: 0, deadLetter: 0, retries: 0 }
						const reason = error instanceof Error ? error.message : 'queue metrics unavailable'
						return {
							queueName: queue.queueName,
							status: 'error',
							reason,
							metrics: this.queueMetricsCache.get(queue.queueName) ?? fallback,
						} as QueueHealthState
					}
				}),
			)
		}

		let status: ServiceHealthState['status'] = 'ok'
		if (!eventBridgeHealthy || !queueBridgeHealthy || queues.some(queue => queue.status === 'error')) {
			status = 'error'
		} else if (queues.some(queue => queue.status === 'warn')) {
			status = 'warn'
		}

		return {
			status,
			eventBridgeHealthy,
			queueBridgeHealthy,
			queues,
		}
	}

	public async executeStream(message: Readonly<StreamMessage>) {
		if (isStreamControl(message)) {
			const active = this.activeStreamSessions.get(message.correlationId)
			if (!active) {
				return
			}
			active.cancelled = true
			active.cancelReason = message.payload.reason
			for (const fn of active.onCancel) {
				fn(message.payload.reason)
			}
			return
		}

		if (!isStreamOpenRequest(message)) {
			return
		}

		const stream = this.streams.get(message.receiver.serviceTarget)
		const context = deserializeOtp(this.logger, message.otp)

		return this.startActiveSpan(stream?.streamName ?? 'purista.executeStream', {}, context, async span => {
			const traceId = message.traceId
			const logger = this.logger.getChildLogger({
				serviceTarget: stream?.streamName,
				...span.spanContext(),
				customTraceId: traceId,
				principalId: message.principalId,
				tenantId: message.tenantId,
			})

			if (!stream) {
				logger.error({ message: getCleanedMessage(message) }, 'received invalid stream open request')
				return
			}

			const payload = message.payload.payload
			const parameter = message.payload.parameter

			const activeSession = {
				cancelled: false,
				cancelReason: undefined as string | undefined,
				onCancel: [] as Array<(reason?: string) => void>,
			}
			this.activeStreamSessions.set(message.correlationId, activeSession)

			let sequence = 0
			const chunks: unknown[] = []

			const publishFrame = async (frame: StreamFrame['payload']) => {
				const streamFrame: Omit<StreamFrame, 'id' | 'timestamp'> = {
					messageType: EBMessageType.Stream,
					correlationId: message.correlationId,
					contentType: 'application/json',
					contentEncoding: 'utf-8',
					traceId: message.traceId,
					principalId: message.principalId,
					tenantId: message.tenantId,
					sender: {
						serviceName: this.info.serviceName,
						serviceVersion: this.info.serviceVersion,
						serviceTarget: stream.streamName,
						instanceId: this.eventBridge.instanceId,
					},
					receiver: {
						...message.sender,
					},
					payload: frame,
				}
				await this.eventBridge.emitMessage(
					streamFrame as unknown as Omit<EBMessage, 'id' | 'timestamp' | 'correlationId'>,
				)
			}

			const writer: StreamWriter = {
				get cancelled() {
					return activeSession.cancelled
				},
				write: async chunk => {
					if (activeSession.cancelled) {
						return
					}
					if (stream.chunkValidationEnabled && stream.chunkSchema) {
						const chunkValidationResult = await validate(stream.chunkSchema, chunk)
						if (!chunkValidationResult.success) {
							throw new UnhandledError(StatusCode.InternalServerError, 'stream chunk output validation failed', {
								issues: chunkValidationResult.issues,
								stream: stream.streamName,
							})
						}
					}
					chunks.push(chunk)
					await publishFrame({
						frameType: 'chunk',
						sequence: sequence++,
						chunk,
					})
				},
				close: async final => {
					let finalPayload = final
					if (stream.aggregateChunks && finalPayload === undefined) {
						finalPayload = {
							chunkCount: chunks.length,
							chunks,
						}
					}

					if (stream.finalValidationEnabled && stream.finalSchema) {
						const finalValidationResult = await validate(stream.finalSchema, finalPayload)
						if (!finalValidationResult.success) {
							throw new UnhandledError(StatusCode.InternalServerError, 'stream final output validation failed', {
								issues: finalValidationResult.issues,
								stream: stream.streamName,
							})
						}
					}

					if (stream.finalEventName && finalPayload !== undefined) {
						await this.eventBridge.emitMessage({
							messageType: EBMessageType.CustomMessage,
							contentType: 'application/json',
							contentEncoding: 'utf-8',
							traceId: message.traceId,
							principalId: message.principalId,
							tenantId: message.tenantId,
							sender: {
								serviceName: this.info.serviceName,
								serviceVersion: this.info.serviceVersion,
								serviceTarget: stream.streamName,
								instanceId: this.eventBridge.instanceId,
							},
							eventName: stream.finalEventName,
							payload: finalPayload,
						} as Omit<EBMessage, 'id' | 'timestamp' | 'correlationId'>)
					}

					await publishFrame({
						frameType: 'complete',
						sequence: sequence++,
						final: finalPayload,
					})
				},
				fail: async error => {
					const err = error instanceof HandledError ? error : UnhandledError.fromError(error)
					await publishFrame({
						frameType: 'error',
						sequence: sequence++,
						error: {
							status: err.errorCode,
							message: err.message,
							isHandledError: err instanceof HandledError,
							data: err.data,
							traceId: err.traceId,
						},
					})
				},
				onCancel: cb => {
					activeSession.onCancel.push(cb)
				},
			}

			try {
				const streamQueue = this.getQueueNamespace(
					this.resolveQueueInvokes(stream.queueInvokes),
					traceId,
					message.principalId,
					message.tenantId,
				)
				await publishFrame({
					frameType: 'start',
					sequence: sequence++,
				})

				const call = stream.call.bind(this)
				const streamContext = {
					message,
					emit: this.getEmitFunction(
						stream.streamName,
						traceId,
						message.principalId,
						message.tenantId,
						stream.emitList,
					),
					...this.getContextFunctions(logger, streamQueue),
					service: createInvokeFunctionProxy(
						this.getInvokeFunction(stream.streamName, traceId, message.principalId, message.tenantId, stream.invokes),
					),
					stream: createOpenStreamFunctionProxy(
						this.getConsumeStreamFunction(
							stream.streamName,
							traceId,
							message.principalId,
							message.tenantId,
							stream.streamInvokes,
						),
					),
					invokeAgent: createAgentInvokeFunctionProxy(
						this.getAgentInvokeFunction(
							stream.streamName,
							traceId,
							message.principalId,
							message.tenantId,
							stream.agentInvokes,
						),
					),
					resources: this.resources,
				}

				await call(streamContext as any, payload as any, parameter as any, writer)

				if (activeSession.cancelled) {
					await publishFrame({
						frameType: 'cancel',
						sequence: sequence++,
						reason: activeSession.cancelReason,
					})
					return
				}

				// If producer did not close explicitly, auto-complete.
				if (sequence <= 1 || chunks.length > 0) {
					await writer.close()
				}
			} catch (error) {
				await writer.fail(error)
			} finally {
				this.activeStreamSessions.delete(message.correlationId)
			}
		})
	}

	public async registerStream(
		streamDefinition: StreamDefinition<any, any, any, any, any, any, any, S['Resources'], any, any, any, any, any, any>,
	): Promise<void> {
		return this.startActiveSpan('purista.registerStream', {}, undefined, async span => {
			this.logger.debug({ ...this.serviceInfo, ...span.spanContext() }, 'register stream')

			span.setAttributes({
				serviceName: this.serviceInfo.serviceName,
				serviceVersion: this.serviceInfo.serviceVersion,
				streamName: streamDefinition.streamName,
			})

			this.streams.set(streamDefinition.streamName, streamDefinition)

			await this.eventBridge.registerStream(
				{
					serviceName: this.serviceInfo.serviceName,
					serviceVersion: this.serviceInfo.serviceVersion,
					serviceTarget: streamDefinition.streamName,
				},
				this.executeStream.bind(this),
				streamDefinition.metadata,
				streamDefinition.eventBridgeConfig,
			)

			span.end()
		})
	}

	public async executeSubscription(
		message: Readonly<EBMessage>,
		subscriptionName: string,
	): Promise<Omit<CustomMessage, 'id' | 'timestamp'> | undefined> {
		const subscription = this.subscriptions.get(subscriptionName)

		const otpContext = deserializeOtp(this.logger, message.otp)
		const spanContext = otpContext ? trace.getSpanContext(otpContext) : undefined

		return this.startActiveSpan(
			subscriptionName || 'purista.executeSubscription',
			{ links: spanContext ? [{ context: spanContext }] : [] },
			undefined,
			async span => {
				const traceId = message.traceId

				const logger = this.logger.getChildLogger({
					serviceTarget: subscriptionName,
					...span.spanContext(),
					customTraceId: traceId,
					principalId: message.principalId,
					tenantId: message.tenantId,
				})

				if (message.principalId) {
					span.setAttribute(PuristaSpanTag.PrincipalId, message.principalId)
				}

				if (message.tenantId) {
					span.setAttribute(PuristaSpanTag.TenantId, message.tenantId)
				}

				if (!subscription) {
					logger.error({ message: getCleanedMessage(message) }, 'received message for invalid subscription')

					span.setStatus({
						code: SpanStatusCode.ERROR,
						message: 'received message for invalid subscription',
					})
					return
				}

				try {
					const subscriptionQueue = this.getQueueNamespace(
						this.resolveQueueInvokes(subscription.queueInvokes),
						traceId,
						message.principalId,
						message.tenantId,
					)
					const { payload, parameter } = await subscriptionTransformInput(this, logger, subscription, message)

					let result: unknown = await this.startActiveSpan(
						`${subscription.subscriptionName}.functionExecution`,
						{},
						undefined,
						async _subSpan => {
							const context: SubscriptionFunctionContext = {
								message,
								emit: this.getEmitFunction(
									subscriptionName,
									traceId,
									message.principalId,
									message.tenantId,
									subscription.emitList,
								),
								...this.getContextFunctions(logger, subscriptionQueue),
								service: createInvokeFunctionProxy(
									this.getInvokeFunction(
										subscriptionName,
										traceId,
										message.principalId,
										message.tenantId,
										subscription.invokes,
									),
								),
								stream: createOpenStreamFunctionProxy(
									this.getConsumeStreamFunction(
										subscriptionName,
										traceId,
										message.principalId,
										message.tenantId,
										subscription.streamInvokes,
									),
								),
								invokeAgent: createAgentInvokeFunctionProxy(
									this.getAgentInvokeFunction(
										subscriptionName,
										traceId,
										message.principalId,
										message.tenantId,
										subscription.agentInvokes,
									),
								),
								resources: this.resources,
							} as unknown as SubscriptionFunctionContext
							const call2 = subscription.call.bind(this, context)
							return await call2(payload, parameter)
						},
					)

					if (Object.keys(subscription.hooks.afterGuard ?? {}).length) {
						const guards = subscription.hooks.afterGuard

						await this.startActiveSpan(`${subscription.subscriptionName}.afterGuardHooks`, {}, undefined, async () => {
							const guardsPromises: Promise<void>[] = []

							for (const [name, hook] of Object.entries(guards ?? {})) {
								const context: SubscriptionFunctionContext = {
									message,
									emit: this.getEmitFunction(
										subscription.subscriptionName,
										traceId,
										message.principalId,
										message.tenantId,
										subscription.emitList,
									),
									...this.getContextFunctions(logger, subscriptionQueue),
									service: createInvokeFunctionProxy(
										this.getInvokeFunction(
											subscription.subscriptionName,
											traceId,
											message.principalId,
											message.tenantId,
											subscription.invokes,
										),
									),
									stream: createOpenStreamFunctionProxy(
										this.getConsumeStreamFunction(
											subscription.subscriptionName,
											traceId,
											message.principalId,
											message.tenantId,
											subscription.streamInvokes,
										),
									),
									invokeAgent: createAgentInvokeFunctionProxy(
										this.getAgentInvokeFunction(
											subscription.subscriptionName,
											traceId,
											message.principalId,
											message.tenantId,
											subscription.agentInvokes,
										),
									),
									resources: this.resources,
								} as unknown as SubscriptionFunctionContext

								const guardPromise = this.wrapInSpan(`afterGuardHook.${name}`, {}, async _subSpan => {
									return hook.bind(this)(context, result as Readonly<unknown>, payload, parameter)
								})
								guardsPromises.push(guardPromise)
							}

							await Promise.all(guardsPromises)
						})
					}

					if (subscription.hooks.transformOutput) {
						const transformOutput = subscription.hooks.transformOutput
						await this.startActiveSpan(
							`${subscription.subscriptionName}.outputTransformation`,
							{},
							undefined,
							async subSpan => {
								const afterTransform = transformOutput.transformFunction.bind(this, {
									message,
									...this.getContextFunctions(logger, subscriptionQueue),
									resources: this.resources,
								})
								const resultTransformed = await afterTransform(result as Readonly<unknown>, parameter)

								const validationResult = await validate(transformOutput.transformOutputSchema, resultTransformed)
								if (!validationResult.success) {
									const err = new UnhandledError(StatusCode.InternalServerError, undefined, validationResult.issues)
									subSpan.recordException(err)
									logger.warn({ ...subSpan.spanContext(), err }, 'transform output validation failed:', err.message)

									subSpan.setStatus({
										code: SpanStatusCode.ERROR,
										message: 'transform output validation failed',
									})
									throw err
								}
								result = validationResult.data
							},
						)
					}

					if (subscription.emitEventName) {
						return await this.startActiveSpan(
							`${subscription.subscriptionName}.success`,
							{},
							undefined,
							async subSpan => {
								this.emit(`custom-${subscription.emitEventName}`, result)
								subSpan.addEvent(subscription.emitEventName as string)
								const resultMsg: Omit<CustomMessage, 'id' | 'timestamp'> = {
									messageType: EBMessageType.CustomMessage,
									contentType: subscription.metadata.expose.contentTypeResponse ?? 'application/json',
									contentEncoding: subscription.metadata.expose.contentEncodingResponse ?? 'utf-8',
									sender: {
										serviceName: this.serviceInfo.serviceName,
										serviceVersion: this.serviceInfo.serviceVersion,
										serviceTarget: subscription.subscriptionName,
										instanceId: this.eventBridge.instanceId,
									},
									payload: result,
									eventName: subscription.emitEventName as string,
									otp: serializeOtp(),
								}
								return resultMsg
							},
						)
					}
					return undefined
				} catch (err) {
					logger.error({ err }, 'Error in subscription execution')
					if (err instanceof HandledError) {
						this.emit(ServiceEventsNames.SubscriptionHandledError, {
							subscriptionName,
							error: err,
							traceId,
						})
						// handled errors prevent that the message is re-delivered for retry
						return
					}
					if (err instanceof UnhandledError) {
						this.emit(ServiceEventsNames.SubscriptionUnhandledError, {
							subscriptionName,
							error: err,
							traceId,
						})
					}
					span.recordException(err as Error)

					span.setStatus({
						code: SpanStatusCode.ERROR,
						message: (err as Error).message,
					})

					// re-throw error here, so the underlaying event bridge driver can handle ack/re-delivery for retry
					throw err
				}
			},
		)
	}

	public async registerSubscription(
		subscriptionDefinition: SubscriptionDefinition<
			any,
			any,
			any,
			any,
			any,
			any,
			any,
			any,
			S['Resources'],
			any,
			any,
			any
		>,
	): Promise<void> {
		return this.startActiveSpan('purista.registerSubscription', {}, undefined, async span => {
			this.logger.debug({ ...this.serviceInfo, ...span.spanContext() }, 'register subscription')

			span.setAttributes({
				serviceName: this.info.serviceName,
				serviceVersion: this.info.serviceVersion,
				subscriptionName: subscriptionDefinition.subscriptionName,
			})

			this.subscriptions.set(subscriptionDefinition.subscriptionName, subscriptionDefinition)

			const subscription: Subscription = {
				sender: subscriptionDefinition.sender,
				receiver: subscriptionDefinition.receiver,
				messageType: subscriptionDefinition.messageType,
				eventName: subscriptionDefinition.eventName,
				emitEventName: subscriptionDefinition.emitEventName,
				subscriber: {
					serviceName: this.info.serviceName,
					serviceVersion: this.info.serviceVersion,
					serviceTarget: subscriptionDefinition.subscriptionName,
				},
				eventBridgeConfig: subscriptionDefinition.eventBridgeConfig,
				principalId: subscriptionDefinition.principalId,
				tenantId: subscriptionDefinition.tenantId,
			}

			await this.eventBridge.registerSubscription(subscription, (message: EBMessage) =>
				this.executeSubscription(message, subscriptionDefinition.subscriptionName),
			)

			span.end()
		})
	}

	private normalizeQueueName(name: string) {
		return name.trim().toLowerCase()
	}

	private hasQueueFeatures() {
		return this.queueDefinitionList.length > 0 || this.queueWorkerDefinitionList.length > 0
	}

	private getQueueDefinition(queueName: string) {
		return this.queueDefinitionMap.get(this.normalizeQueueName(queueName))
	}

	private resolveQueueInvokes(queueInvokes?: QueueInvokeList) {
		return queueInvokes
	}

	async destroy() {
		for (const [_, session] of this.activeStreamSessions) {
			session.cancelled = true
		}
		this.activeStreamSessions.clear()
		await this.stopQueueWorkers()
		if (this.queueBridgeStarted) {
			await this.queueBridge.destroy()
			this.queueBridgeStarted = false
		}
		this.emit(ServiceEventsNames.ServiceDrain)
		this.emit(ServiceEventsNames.ServiceStopped)
		this.removeAllListeners()
		await super.destroy()
	}
}
