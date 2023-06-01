import { SpanKind, SpanStatusCode } from '@opentelemetry/api'
import {
  BrokerHeaderCommandResponseMsg,
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

          const returnContext = deserializeOtp(log, result.otp)
          return this.startActiveSpan(
            PuristaSpanName.EventBridgeCommandResponseSent,
            { kind: SpanKind.PRODUCER },
            returnContext,
            async (subSpan) => {
              const responseMessage = {
                ...result,
                sender: {
                  ...result.sender,
                  instanceId: this.instanceId,
                },
                otp: result.otp || serializeOtp(),
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

              // emit the message 1st time as direct response
              const responseTopic = getTopicName.bind(this)(responseMessage)
              await this.client.publish(responseTopic, JSON.stringify(responseMessage), {
                qos: this.config.qosCommand,
                properties: {
                  messageExpiryInterval: responseMessage.eventName
                    ? msToSec(this.config.defaultMessageExpiryInterval)
                    : this.config.defaultCommandTimeout,
                  contentType: 'application/json',
                  userProperties,
                  correlationData: Buffer.from(responseMessage.correlationId),
                },
              })
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
