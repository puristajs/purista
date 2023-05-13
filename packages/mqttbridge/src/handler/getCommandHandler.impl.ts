import { SpanKind, SpanStatusCode } from '@opentelemetry/api'
import {
  Command,
  CommandDefinitionMetadataBase,
  CommandErrorResponse,
  CommandSuccessResponse,
  DefinitionEventBridgeConfig,
  deserializeOtp,
  EBMessage,
  EBMessageAddress,
  EventBridgeEventNames,
  isCommand,
  isCommandErrorResponse,
  PuristaSpanName,
  PuristaSpanTag,
  serializeOtp,
  StatusCode,
  UnhandledError,
} from '@purista/core'

import { deserializeOtpFromMqtt } from '../deserializeOtpFromMqtt.impl'
import { msToSec } from '../msToSec.impl'
import { serializeOtpToMqtt } from '../serializeOtpToMqtt.impl'
import { getTopicName } from '../topic'
import { IncomingMessageFunction } from '../types'

export const getCommandHandler = (
  address: EBMessageAddress,
  cb: (message: Command) => Promise<CommandSuccessResponse | CommandErrorResponse>,
  _metadata: CommandDefinitionMetadataBase,
  _eventBridgeConfig: DefinitionEventBridgeConfig,
) => {
  const handleCommand: IncomingMessageFunction = async function (command: EBMessage, packet) {
    const context = deserializeOtpFromMqtt(this.logger, command, packet.properties?.userProperties)
    return this.startActiveSpan(
      PuristaSpanName.EventBridgeCommandReceived,
      { kind: SpanKind.CONSUMER },
      context,
      async (span) => {
        const log = this.logger.getChildLogger({ ...span.spanContext(), traceId: command.traceId })
        try {
          const responseTopic = packet.properties?.responseTopic

          if (!responseTopic) {
            const err = new UnhandledError(
              StatusCode.InternalServerError,
              'received a command message without response topic',
            )
            log.error({ err }, err.message)
            span.setStatus({
              code: SpanStatusCode.ERROR,
              message: err.message,
            })
            span.recordException(err)
            this.emit(EventBridgeEventNames.EventbridgeError, err)
            return
          }

          if (!isCommand(command)) {
            const err = new UnhandledError(StatusCode.InternalServerError, 'expected a command message')
            log.error({ err }, err.message)
            span.setStatus({
              code: SpanStatusCode.ERROR,
              message: err.message,
            })
            span.recordException(err)
            this.emit(EventBridgeEventNames.EventbridgeError, err)
            return
          }

          const result = await cb(command)

          result.otp = result.otp || serializeOtp()

          const returnContext = deserializeOtp(log, result.otp)
          return this.startActiveSpan(
            PuristaSpanName.EventBridgeCommandResponseSent,
            { kind: SpanKind.CONSUMER },
            returnContext,
            async (subSpan) => {
              const responseMessage = {
                ...result,
                instanceId: this.instanceId,
                otp: serializeOtp(),
              }

              subSpan.setAttribute(PuristaSpanTag.SenderServiceName, responseMessage.sender.serviceName)
              subSpan.setAttribute(PuristaSpanTag.SenderServiceVersion, responseMessage.sender.serviceVersion)
              subSpan.setAttribute(PuristaSpanTag.SenderServiceTarget, responseMessage.sender.serviceTarget)

              if (responseMessage.eventName) {
                subSpan.addEvent(responseMessage.eventName)
              }

              const userProperties: Record<string, string> = serializeOtpToMqtt({
                messageType: responseMessage.messageType,
                senderServiceName: responseMessage.sender.serviceName,
                senderServiceVersion: responseMessage.sender.serviceVersion,
                senderServiceTarget: responseMessage.sender.serviceTarget,
                receiverServiceName: responseMessage.receiver.serviceName,
                receiverServiceVersion: responseMessage.receiver.serviceVersion,
                receiverServiceTarget: responseMessage.receiver.serviceTarget,
                instanceId: responseMessage.instanceId,
              })

              if (responseMessage.eventName) {
                userProperties.eventName = responseMessage.eventName
              }

              if (responseMessage.principalId) {
                userProperties.principalId = responseMessage.principalId
              }

              // emit the message 1st time as direct response
              await this.client.publish(packet.properties?.responseTopic as string, JSON.stringify(responseMessage), {
                qos: this.config.qosCommand,
                properties: {
                  messageExpiryInterval: this.config.defaultCommandTimeout,
                  contentType: 'application/json',
                  userProperties,
                  correlationData: Buffer.from(responseMessage.correlationId),
                },
              })

              if (this.config.commandResponsePublishTwice === 'never') {
                return
              }

              // emit the message 2nd time as event
              if (
                this.config.commandResponsePublishTwice === 'always' ||
                (responseMessage.eventName && this.config.commandResponsePublishTwice === 'eventOnly') ||
                (isCommandErrorResponse(responseMessage) && this.config.commandResponsePublishTwice === 'eventAndError')
              ) {
                const eventTopic = getTopicName.bind(this)(responseMessage)
                await this.client.publish(eventTopic, JSON.stringify(responseMessage), {
                  qos: this.config.qoSSubscription,
                  properties: {
                    messageExpiryInterval: msToSec(this.config.defaultMessageExpiryInterval),
                    contentType: 'application/json',
                    userProperties,
                  },
                })
              }
            },
          )
        } catch (error) {
          const err = new UnhandledError(StatusCode.InternalServerError, 'Failed to consume command response message', {
            error,
          })
          span.setStatus({
            code: SpanStatusCode.ERROR,
            message: err.message,
          })
          span.recordException(err)
          this.emit(EventBridgeEventNames.EventbridgeError, err)
          log.error({ err }, 'Failed to consume command response message')
        }
      },
    )
  }

  return handleCommand
}
