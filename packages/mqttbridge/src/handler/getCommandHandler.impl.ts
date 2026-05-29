import { SpanKind, SpanStatusCode } from '@opentelemetry/api'
import type {
	BrokerHeaderCommandResponseMsg,
	Command,
	CommandDefinitionMetadataBase,
	CommandErrorResponse,
	CommandSuccessResponse,
	DefinitionEventBridgeConfig,
	EBMessage,
	EBMessageAddress,
} from '@purista/core'
import {
	createErrorResponse,
	deserializeOtp,
	isCommand,
	PuristaSpanName,
	PuristaSpanTag,
	StatusCode,
	serializeOtp,
	UnhandledError,
} from '@purista/core'

import { deserializeOtpFromMqtt } from '../deserializeOtpFromMqtt.impl.js'
import { msToSec } from '../msToSec.impl.js'
import { serializeOtpToMqtt } from '../serializeOtpToMqtt.impl.js'
import { getTopicName } from '../topic/getTopicName.impl.js'
import type { IncomingMessageFunction } from '../types/IncomingMessageFunction.js'

/**
 * Creates an MQTT command handler for a PURISTA command address.
 *
 * The handler decodes JSON command messages, invokes the registered callback,
 * and publishes a correlated response. MQTT does not provide bridge-managed
 * command retry or dead-letter behavior.
 */
export const getCommandHandler = (
	address: EBMessageAddress,
	cb: (message: Command) => Promise<CommandSuccessResponse | CommandErrorResponse>,
	_metadata: CommandDefinitionMetadataBase,
	_eventBridgeConfig: DefinitionEventBridgeConfig,
) => {
	void address
	const handleCommand: IncomingMessageFunction = async function (command: EBMessage, packet) {
		return this.runInFlight(async () => {
			const context = deserializeOtpFromMqtt(this.logger, command, packet.properties?.userProperties)
			return this.startActiveSpan(
				PuristaSpanName.EventBridgeCommandReceived,
				{ kind: SpanKind.CONSUMER },
				context,
				async span => {
					const log = this.logger.getChildLogger({ ...span.spanContext(), customTraceId: command.traceId })
					try {
						if (!isCommand(command)) {
							const err = new UnhandledError(StatusCode.InternalServerError, 'expected a command message')
							log.error({ err }, err.message)
							span.setStatus({
								code: SpanStatusCode.ERROR,
								message: err.message,
							})
							span.recordException(err)
							return
						}

						const result = await cb(command)

						const returnContext = deserializeOtp(log, result.otp)
						return this.startActiveSpan(
							PuristaSpanName.EventBridgeCommandResponseSent,
							{ kind: SpanKind.PRODUCER },
							returnContext,
							async subSpan => {
								const responseMessage = {
									...result,
									sender: {
										...result.sender,
										instanceId: this.instanceId,
									},
									otp: result.otp ?? serializeOtp(),
								}

								subSpan.setAttribute(PuristaSpanTag.SenderServiceName, responseMessage.sender.serviceName)
								subSpan.setAttribute(PuristaSpanTag.SenderServiceVersion, responseMessage.sender.serviceVersion)
								subSpan.setAttribute(PuristaSpanTag.SenderServiceTarget, responseMessage.sender.serviceTarget)

								if (responseMessage.eventName) {
									subSpan.addEvent(responseMessage.eventName)
								}

								const userProperties: BrokerHeaderCommandResponseMsg = serializeOtpToMqtt({
									messageType: responseMessage.messageType,
									senderServiceName: responseMessage.sender.serviceName,
									senderServiceVersion: responseMessage.sender.serviceVersion,
									senderServiceTarget: responseMessage.sender.serviceTarget,
									senderInstanceId: responseMessage.sender.instanceId,
									receiverServiceName: responseMessage.receiver.serviceName,
									receiverServiceVersion: responseMessage.receiver.serviceVersion,
									receiverServiceTarget: responseMessage.receiver.serviceTarget,
									receiverInstanceId: responseMessage.receiver.instanceId,
								})

								if (responseMessage.eventName) {
									userProperties.eventName = responseMessage.eventName
								}

								if (responseMessage.principalId) {
									userProperties.principalId = responseMessage.principalId
								}

								if (responseMessage.tenantId) {
									userProperties.tenantId = responseMessage.tenantId
								}

								// emit the message 1st time as direct response
								const responseTopic = getTopicName.bind(this)(responseMessage)
								await this.client?.publish(responseTopic, JSON.stringify(responseMessage), {
									qos: this.config.qosCommand,
									properties: {
										messageExpiryInterval: responseMessage.eventName
											? msToSec(this.config.defaultMessageExpiryInterval)
											: msToSec(this.config.defaultCommandTimeout ?? this.defaultCommandTimeout),
										contentType: 'application/json',
										userProperties,
										correlationData: Buffer.from(responseMessage.correlationId),
									},
								})
							},
						)
					} catch (error) {
						const err =
							error instanceof UnhandledError ? error : UnhandledError.fromError(error, StatusCode.InternalServerError)
						span.setStatus({
							code: SpanStatusCode.ERROR,
							message: err.message,
						})
						span.recordException(err)
						log.error({ err }, 'Failed to consume command message')

						const errorResponse = createErrorResponse(this.instanceId, command as Command, err.errorCode, err)
						const responseTopic = getTopicName.bind(this)(errorResponse)
						await this.client?.publish(responseTopic, JSON.stringify(errorResponse), {
							qos: this.config.qosCommand,
							properties: {
								messageExpiryInterval: msToSec(this.config.defaultCommandTimeout ?? this.defaultCommandTimeout),
								contentType: 'application/json',
								correlationData: Buffer.from(errorResponse.correlationId),
							},
						})
					}
				},
			)
		}, 'command')
	}

	return handleCommand
}
