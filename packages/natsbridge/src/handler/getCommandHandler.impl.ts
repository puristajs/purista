import { SpanKind, SpanStatusCode } from '@opentelemetry/api'
import type {
	BrokerHeaderCommandResponseMsg,
	Command,
	CommandDefinitionMetadataBase,
	CommandErrorResponse,
	CommandSuccessResponse,
	DefinitionEventBridgeConfig,
	EBMessageAddress,
} from '@purista/core'
import {
	createErrorResponse,
	deserializeOtp,
	isCommand,
	isCommandErrorResponse,
	PuristaSpanName,
	PuristaSpanTag,
	StatusCode,
	serializeOtp,
	UnhandledError,
} from '@purista/core'
import type { Msg, MsgHdrs } from 'nats'
import { headers as getNewHeaders } from 'nats'

import { deserializeOtpFromNats } from '../deserializeOtpFromNats.impl.js'
import { serializeOtpToNats } from '../serializeOtpToNats.impl.js'
import { getTopicName } from '../topic/getTopicName.impl.js'
import type { IncomingMessageFunction } from '../types/IncomingMessageFunction.js'

export const getCommandHandler = (
	address: EBMessageAddress,
	cb: (message: Command) => Promise<CommandSuccessResponse | CommandErrorResponse>,
	_metadata: CommandDefinitionMetadataBase,
	_eventBridgeConfig: DefinitionEventBridgeConfig,
) => {
	const handleCommand: IncomingMessageFunction = async function (error, msg) {
		return this.runInFlight(async () => {
			if (error) {
				const err = UnhandledError.fromError(error)
				this.logger.error({ err, address }, `error in command subscription: ${err.message}`)
				return
			}

			let command: Command
			try {
				command = this.sc.decode(msg.data) as Command
			} catch (err) {
				this.logger.error({ err, address }, 'error in command subscription - unable to extract payload')
				return
			}

			const context = deserializeOtpFromNats(this.logger, command, msg.headers)
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

								let headers: MsgHdrs | undefined
								if (this.connection?.info?.headers) {
									headers = getNewHeaders()

									const userProperties: BrokerHeaderCommandResponseMsg = serializeOtpToNats({
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

									for (const value of Object.entries(userProperties)) {
										headers?.set(value[0], value[1])
									}
								}

								const responseData = this.sc.encode(responseMessage)
								const replyMessage = msg as Partial<Msg>
								if (typeof replyMessage.respond === 'function') {
									replyMessage.respond(responseData, {
										headers,
									})
								} else if (replyMessage.reply) {
									this.connection?.publish(replyMessage.reply, responseData, { headers })
								} else {
									throw new UnhandledError(
										StatusCode.InternalServerError,
										'NATS command message does not provide a reply target',
									)
								}

								if (this.config.commandResponsePublishTwice === 'never') {
									return
								}

								// emit the message 2nd time as event
								if (
									this.config.commandResponsePublishTwice === 'always' ||
									(responseMessage.eventName && this.config.commandResponsePublishTwice === 'eventOnly') ||
									(isCommandErrorResponse(responseMessage) &&
										this.config.commandResponsePublishTwice === 'eventAndError')
								) {
									const eventTopic = getTopicName.bind(this)(responseMessage)

									this.connection?.publish(eventTopic, responseData, { headers })
								}
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

						const errorResponse = createErrorResponse(this.instanceId, command, err.errorCode, err)
						const responseData = this.sc.encode(errorResponse)
						const replyMessage = msg as Partial<Msg>

						if (typeof replyMessage.respond === 'function') {
							replyMessage.respond(responseData)
							return
						}

						if (replyMessage.reply) {
							this.connection?.publish(replyMessage.reply, responseData)
							return
						}

						log.error(
							{
								commandId: command.id,
								correlationId: command.correlationId,
							},
							'Unable to return command error response because reply target is missing',
						)
					}
				},
			)
		}, 'command')
	}

	return handleCommand
}
