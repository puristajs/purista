// file deepcode ignore ServerLeak: <please specify a reason of ignoring this>
import { Server } from 'node:http'
import type { Http2SecureServer, Http2Server } from 'node:http2'

import { context, propagation, SpanKind, SpanStatusCode } from '@opentelemetry/api'
import type {
	Command,
	CommandErrorResponse,
	CommandResponse,
	CommandSuccessResponse,
	CustomMessage,
	DefinitionEventBridgeConfig,
	EBMessage,
	EBMessageAddress,
	EventBridge,
	EventBridgeConfig,
	HttpExposedServiceMeta,
	Subscription,
} from '@purista/core'
import {
	deserializeOtp,
	EBMessageType,
	EventBridgeBaseClass,
	EventBridgeCommandTransport,
	EventBridgeLateResponseHandling,
	EventBridgeResponseConfirmationLevel,
	EventBridgeStreamLateFrameHandling,
	getErrorMessageForCode,
	getNewCorrelationId,
	getNewEBMessageId,
	HandledError,
	isCommandErrorResponse,
	isHttpExposedServiceMeta,
	isInfoMessage,
	PuristaSpanName,
	PuristaSpanTag,
	StatusCode,
	serializeOtp,
	UnhandledError,
} from '@purista/core'
import { Hono } from 'hono'
import { compress } from 'hono/compress'
import { PatternRouter } from 'hono/router/pattern-router'
import type { ContentfulStatusCode } from 'hono/utils/http-status'

import { getCommandHandler } from './getCommandHandler.impl.js'
import { getCommandHandlerRestApi } from './getCommandHandlerRestApi.impl.js'
import { getDefaultHttpEventBridgeConfig } from './getDefaultHttpEventBridgeConfig.impl.js'
import { getSubscriptionHandler } from './getSubscriptionHandler.impl.js'
import { healthzRoute } from './healthzRoute.impl.js'
import type { HttpEventBridgeClient } from './types/HttpEventBridgeClient.js'
import type { HttpEventBridgeConfig } from './types/HttpEventBridgeConfig.js'

/**
 * Generic HTTP-based event bridge for runtimes that deliver PURISTA messages over HTTP.
 *
 * In environments like Dapr or Knative, communication is commonly handled by
 * sidecar containers or platform routers. This bridge exposes internal POST
 * endpoints for commands and subscriptions, optionally exposes command REST
 * projections, and uses the configured {@link HttpEventBridgeClient} for calls
 * back to the sidecar or platform HTTP API.
 *
 * In these cases, it is expected, that the current instance is a HTTP server, which provides REST endpoints for commands and subscriptions.
 * The communication from the current instance to the sidecar is also done via REST endpoints.
 *
 * HTTP calls from the sidecar to the current instance might be done via CloudEvent schema, which wraps the payload into a defined structure.
 * The HttpEventBridge can be configured to respect this, and to extract the information from CloudEvents.
 *
 * To use the HttpEventBridge, you will need following peer-dependencies installed:
 *
 * - hono
 * - trouter
 */
/**
 * Stores the app value exposed by HttpEventBridge.
 * Start the bridge before registering services and stop it during graceful shutdown.
 * Expose only schemas and metadata that are safe for clients to inspect.
 * Treat this property as runtime state unless the concrete API documents a stronger guarantee.
 */
export class HttpEventBridge<CustomConfig extends HttpEventBridgeConfig>
	/**
	 * Stores the isShuttingDown value exposed by HttpEventBridge.
	 * Start the bridge before registering services and stop it during graceful shutdown.
	 * Expose only schemas and metadata that are safe for clients to inspect.
	 * Treat this property as runtime state unless the concrete API documents a stronger guarantee.
	 */
	extends EventBridgeBaseClass<CustomConfig>
	/**
	 * Stores the isStarted value exposed by HttpEventBridge.
	 * Start the bridge before registering services and stop it during graceful shutdown.
	 * Expose only schemas and metadata that are safe for clients to inspect.
	 * Treat this property as runtime state unless the concrete API documents a stronger guarantee.
	 */
	implements EventBridge
{
	/**
	 * Stores the client value exposed by HttpEventBridge.
	 * Start the bridge before registering services and stop it during graceful shutdown.
	 * Expose only schemas and metadata that are safe for clients to inspect.
	 * Treat this property as runtime state unless the concrete API documents a stronger guarantee.
	 */
	/**
	 * Runtime server returned by the configured Hono `serve` adapter.
	 *
	 * It is set during {@link start} and closed during {@link destroy}.
	 */
	public server: Server | Http2Server | Http2SecureServer | undefined
	/**
	 * Hono application that hosts health, command, subscription and REST projection routes.
	 */
	public app: Hono
	/**
	 * Indicates that shutdown has started and new HTTP requests should be rejected.
	 */
	public isShuttingDown = false
	/**
	 * Indicates that the bridge has registered routes and started its HTTP server.
	 */
	public isStarted = false

	/**
	 * HTTP client adapter used for outgoing command invocations, event publication and health checks.
	 */
	public client: HttpEventBridgeClient

	/**
	 * Creates an HTTP event bridge around a sidecar/platform client.
	 *
	 * @param config - Event bridge and HTTP server configuration.
	 * @param client - Client that knows the platform-specific URL layout.
	 */
	constructor(config: EventBridgeConfig<CustomConfig>, client: HttpEventBridgeClient) {
		const defaults = getDefaultHttpEventBridgeConfig()
		const conf = {
			...defaults,
			...config,
		}

		super(conf.name ?? 'HttpEventBridge', conf)
		this.capabilities = {
			supportsStreams: false,
			durableCommands: false,
			durableSubscriptions: false,
			manualAckSupported: false,
			lateResponseHandling: EventBridgeLateResponseHandling.NotApplicable,
			gracefulDrainSupported: true,
			nativeDeadLettering: false,
			commandHandling: {
				transport: EventBridgeCommandTransport.HttpRequest,
				pendingInvocationCancellation: false,
				responseConfirmation: EventBridgeResponseConfirmationLevel.ProtocolLevel,
				strictMode: false,
			},
			streamHandling: {
				incrementalDelivery: false,
				consumerCancellation: false,
				gracefulStreamDrain: false,
				aggregatedFinalSupported: false,
				lateFrameHandling: EventBridgeStreamLateFrameHandling.NotApplicable,
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
		}

		this.client = client

		this.app = new Hono({ router: new PatternRouter() })
	}

	/**
	 * Starts the Hono server and registers common middleware and the `/healthz` route.
	 *
	 * The bridge rejects new requests with `503` while {@link destroy} is draining
	 * in-flight work.
	 */
	async start() {
		this.markObservabilityStarted()
		this.app.notFound(c => {
			const err = new HandledError(StatusCode.NotFound, getErrorMessageForCode(StatusCode.NotFound), {
				method: c.req.method,
				path: c.req.path,
				url: c.req.url,
			})

			this.logger.error({ err }, err.message)

			return c.json(err.getErrorResponse(), err.errorCode as ContentfulStatusCode)
		})

		this.app.onError((err, c) => {
			this.logger.error({ err }, err.message)
			const responseError = UnhandledError.fromError(err)
			return c.json(responseError.getErrorResponse(), responseError.errorCode as ContentfulStatusCode)
		})

		if (this.config.enableHttpCompression) {
			this.app.use('*', compress())
		}

		this.app.use('*', async (_c, next) => {
			if (this.isShuttingDown) {
				const err = { message: 'shut down in progress', status: StatusCode.ServiceUnavailable }
				return new Response(JSON.stringify(err), {
					status: err.status,
					statusText: getErrorMessageForCode(err.status),
					headers: {
						'content-type': 'application/json; charset=utf-8',
					},
				})
			}
			await next()
		})

		this.app.get('/healthz', healthzRoute)

		this.server = this.config.serve({
			fetch: this.app.fetch,
			port: this.config.serverPort,
			hostname: this.config.serverHost,
		})
		this.isShuttingDown = false
		this.isStarted = true

		this.server.on('listening', () => {
			this.logger.info('http event bridge listening')
		})

		this.server.on('close', () => {
			this.logger.info('http event bridge closed')
		})

		this.server.on('error', err => {
			this.logger.error({ err }, 'http event bridge server error')
		})
	}

	/**
	 * Publishes an event message through the configured HTTP client.
	 *
	 * Info messages are ignored locally. Other messages must carry an `eventName`
	 * because this bridge maps events to the underlying transport's event topic.
	 *
	 * @param message - Event bridge message without generated id, timestamp and correlation id.
	 * @returns The immutable message with generated transport metadata.
	 */
	async emitMessage<T extends EBMessage>(
		message: Omit<EBMessage, 'id' | 'timestamp' | 'correlationId'>,
	): Promise<Readonly<EBMessage>> {
		const currentContext = deserializeOtp(this.logger, message.otp)

		return this.startActiveSpan(
			PuristaSpanName.EventBridgeEmitMessage,
			{ kind: SpanKind.PRODUCER },
			currentContext,
			async span => {
				const msg = Object.freeze({
					...message,
					sender: {
						...message.sender,
						instanceId: this.instanceId,
					},
					id: getNewEBMessageId(),
					timestamp: Date.now(),
					traceId: message.traceId,
					otp: serializeOtp(),
				})

				if (isInfoMessage(msg as EBMessage)) {
					this.logger.debug('skipping info message')
					return msg as Readonly<T>
				}

				if (!msg.eventName) {
					const err = new UnhandledError(StatusCode.BadRequest, 'message must contain a event name')
					this.logger.error({ err }, err.message)
					span.recordException(err)

					span.setStatus({
						code: SpanStatusCode.ERROR,
						message: err.message,
					})
					throw err
				}

				span.setAttribute(PuristaSpanTag.SenderServiceName, msg.sender.serviceName)
				span.setAttribute(PuristaSpanTag.SenderServiceVersion, msg.sender.serviceVersion)
				span.setAttribute(PuristaSpanTag.SenderServiceTarget, msg.sender.serviceTarget)

				span.addEvent(msg.eventName)

				const headers: Record<string, string> = {}
				propagation.inject(context.active(), headers)

				await this.client.sendEvent(msg as EBMessage)

				return msg as Readonly<T>
			},
		)
	}

	/**
	 * Invokes a PURISTA command over HTTP and returns the command payload.
	 *
	 * This is direct request/response command transport. It does not turn the
	 * command into durable queued work; queue behavior must be modelled with a
	 * queue definition and exposed as an async endpoint by the owning service.
	 *
	 * @param input - Command envelope without generated id, message type, timestamp and correlation id.
	 * @param ttl - Optional request timeout forwarded to the HTTP client.
	 * @throws `HandledError` or `UnhandledError` when the remote command returns an error response.
	 */
	async invoke<T>(
		input: Omit<Command, 'id' | 'messageType' | 'timestamp' | 'correlationId'>,
		ttl?: number,
	): Promise<T> {
		const currentContext = deserializeOtp(this.logger, input.otp)
		return this.startActiveSpan(PuristaSpanName.EventBridgeInvokeCommand, {}, currentContext, async span => {
			const command: Command = Object.freeze({
				...input,
				sender: {
					...input.sender,
					instanceId: this.instanceId,
				},
				id: getNewEBMessageId(),
				correlationId: getNewCorrelationId(),
				timestamp: Date.now(),
				messageType: EBMessageType.Command,
				traceId: input.traceId,
				otp: serializeOtp(),
			})

			span.setAttribute(PuristaSpanTag.SenderServiceName, command.sender.serviceName)
			span.setAttribute(PuristaSpanTag.SenderServiceVersion, command.sender.serviceVersion)
			span.setAttribute(PuristaSpanTag.SenderServiceTarget, command.sender.serviceTarget)
			span.setAttribute(PuristaSpanTag.ReceiverServiceName, command.receiver.serviceName)
			span.setAttribute(PuristaSpanTag.ReceiverServiceVersion, command.receiver.serviceVersion)
			span.setAttribute(PuristaSpanTag.ReceiverServiceTarget, command.receiver.serviceTarget)

			const headers: Record<string, string> = {}
			propagation.inject(context.active(), headers)

			const message: CommandResponse = await this.client.invoke(command, headers, ttl)

			if (message === undefined) {
				return undefined as T
			}

			if (typeof message !== 'object' || message === null) {
				throw new UnhandledError(StatusCode.BadGateway, 'invalid command response from sidecar')
			}

			if (isCommandErrorResponse(message)) {
				const err = message.isHandledError ? HandledError.fromMessage(message) : UnhandledError.fromMessage(message)
				this.logger.error({ err }, err.message)
				span.recordException(err)
				span.setStatus({
					code: SpanStatusCode.ERROR,
					message: err.message,
				})

				throw err
			}

			return message.payload as T
		})
	}

	/**
	 * Registers the internal command endpoint, plus an optional REST projection.
	 *
	 * Internal command endpoints accept full PURISTA command messages. REST
	 * projections are generated only when command metadata declares HTTP exposure
	 * and `enableRestApiExpose` is enabled.
	 *
	 * @returns The internal command route path.
	 */
	async registerCommand(
		address: EBMessageAddress,
		cb: (
			message: Command,
		) => Promise<
			Readonly<Omit<CommandSuccessResponse, 'instanceId'>> | Readonly<Omit<CommandErrorResponse, 'instanceId'>>
		>,
		metadata: HttpExposedServiceMeta,
		eventBridgeConfig: DefinitionEventBridgeConfig,
	): Promise<string> {
		const rawHandler = getCommandHandler.call(
			this,
			address,
			cb,
			metadata,
			eventBridgeConfig,
			this.config.commandPayloadAsCloudEvent,
		)
		const handler = ((...args: Parameters<typeof rawHandler>) =>
			this.runInFlight(() => rawHandler.call(this, ...args))) as typeof rawHandler

		const path = this.client.getInternalPathForCommand(address)

		this.app.post(path, handler)
		this.logger.debug({ path }, 'command added')

		if (isHttpExposedServiceMeta(metadata) && this.config.enableRestApiExpose) {
			const httpMeta = metadata.expose.http
			const apiPath = this.client.getApiPathForCommand(address, metadata)

			this.logger.debug({ apiPath })

			const rawHandlerRest = getCommandHandlerRestApi.call(this, address, cb, metadata, eventBridgeConfig)
			const handlerRest = ((...args: Parameters<typeof rawHandlerRest>) =>
				this.runInFlight(() => rawHandlerRest.call(this, ...args))) as typeof rawHandlerRest

			switch (httpMeta.method) {
				case 'DELETE':
					this.app.delete(apiPath, handlerRest)
					break
				case 'GET':
					this.app.get(apiPath, handlerRest)
					break
				case 'PATCH':
					this.app.patch(apiPath, handlerRest)
					break
				case 'POST':
					this.app.post(apiPath, handlerRest)
					break
				case 'PUT':
					this.app.put(apiPath, handlerRest)
					break
			}

			this.logger.debug({ path, method: httpMeta.method }, 'command added')
		}
		return path
	}

	/**
	 * Placeholder for transport-specific command unregistration.
	 *
	 * Hono route removal is not supported by this bridge after registration.
	 */
	async unregisterCommand(address: EBMessageAddress): Promise<void> {
		this.logger.debug({ address }, 'unregister command')
	}

	/**
	 * Registers a subscription endpoint before the HTTP server starts.
	 *
	 * Subscriptions react to emitted events/facts. They are not queue workers and
	 * should remain idempotent because HTTP/event transports may redeliver.
	 *
	 * @returns The internal subscription route path.
	 */
	async registerSubscription(
		subscription: Subscription,
		cb: (message: EBMessage) => Promise<Omit<CustomMessage, 'id' | 'timestamp'> | undefined>,
	): Promise<string> {
		if (this.isStarted) {
			throw new UnhandledError(
				StatusCode.InternalServerError,
				'subscriptions must be registered before starting the http event bridge',
			)
		}

		const rawHandler = getSubscriptionHandler.call(this, subscription, cb, this.config.subscriptionPayloadAsCloudEvent)
		const handler = ((...args: Parameters<typeof rawHandler>) =>
			this.runInFlight(() => rawHandler.call(this, ...args))) as typeof rawHandler

		const path = this.client.getInternalPathForSubscription(subscription.subscriber)

		this.app.post(path, handler)
		this.logger.debug({ path }, 'subscription added')
		return path
	}

	/**
	 * Placeholder for transport-specific subscription unregistration.
	 *
	 * Hono route removal is not supported by this bridge after registration.
	 */
	async unregisterSubscription(address: EBMessageAddress): Promise<void> {
		this.logger.debug({ address }, 'unregister subscription')
	}

	/**
	 * Reports whether the bridge can accept new HTTP requests.
	 */
	async isReady(): Promise<boolean> {
		return this.isStarted && !this.isShuttingDown
	}

	/**
	 * Reports whether the bridge is started and its sidecar/platform client is reachable.
	 */
	async isHealthy(): Promise<boolean> {
		if (!this.isStarted) {
			return false
		}
		return this.client.isSidecarAvailable()
	}

	/**
	 * Shut down event bridge as gracefully as possible
	 */
	async destroy(): Promise<void> {
		if (!this.server) {
			return
		}
		this.isShuttingDown = true
		if (this.server instanceof Server) {
			this.server.closeIdleConnections()
		}
		const drained = await this.waitForInFlightDrain()
		if (!drained) {
			this.logger.error('Some HTTP bridge requests did not finish before shutdown')
		}
		const server = this.server
		await new Promise(resolve => server.close(resolve))
		this.isStarted = false
		this.server = undefined
	}
}
