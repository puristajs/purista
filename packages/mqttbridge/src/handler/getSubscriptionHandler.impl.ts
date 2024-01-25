import { SpanKind, SpanStatusCode } from '@opentelemetry/api'
import type { BrokerHeaderCustomMsg, CustomMessage, EBMessage, Subscription } from '@purista/core'
import {
  deserializeOtp,
  EventBridgeEventNames,
  PuristaSpanName,
  PuristaSpanTag,
  serializeOtp,
  StatusCode,
  UnhandledError,
} from '@purista/core'

import { deserializeOtpFromMqtt } from '../deserializeOtpFromMqtt.impl.js'
import { serializeOtpToMqtt } from '../serializeOtpToMqtt.impl.js'
import { getTopicName } from '../topic/index.js'
import type { IncomingMessageFunction } from '../types/index.js'

export const getSubscriptionHandler = (
  _subscription: Subscription,
  cb: (message: EBMessage) => Promise<Omit<CustomMessage, 'id' | 'timestamp'> | undefined>,
) => {
  const handler: IncomingMessageFunction = async function (message: EBMessage, packet) {
    const context = deserializeOtpFromMqtt(this.logger, message, packet.properties?.userProperties)
    return this.startActiveSpan(
      PuristaSpanName.EventBridgeCommandReceived,
      { kind: SpanKind.CONSUMER },
      context,
      async (span) => {
        const log = this.logger.getChildLogger({ ...span.spanContext(), customTraceId: message.traceId })

        try {
          const result = await cb(message)

          if (!result) {
            return
          }

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
                otp: serializeOtp(),
              }

              subSpan.setAttribute(PuristaSpanTag.SenderServiceName, responseMessage.sender.serviceName)
              subSpan.setAttribute(PuristaSpanTag.SenderServiceVersion, responseMessage.sender.serviceVersion)
              subSpan.setAttribute(PuristaSpanTag.SenderServiceTarget, responseMessage.sender.serviceTarget)

              if (!responseMessage.eventName) {
                return
              }

              subSpan.addEvent(responseMessage.eventName)

              const userProperties: BrokerHeaderCustomMsg = serializeOtpToMqtt({
                messageType: responseMessage.messageType,
                senderServiceName: responseMessage.sender.serviceName,
                senderServiceVersion: responseMessage.sender.serviceVersion,
                senderServiceTarget: responseMessage.sender.serviceTarget,
                senderInstanceId: responseMessage.sender.instanceId,
                eventName: responseMessage.eventName,
              })

              if (responseMessage.principalId) {
                userProperties.principalId = responseMessage.principalId
              }

              if (responseMessage.tenantId) {
                userProperties.tenantId = responseMessage.tenantId
              }

              const topic = getTopicName.bind(this)(responseMessage as EBMessage)
              await this.client?.publish(topic, JSON.stringify(responseMessage), {
                qos: this.config.qoSSubscription,
                properties: {
                  messageExpiryInterval: this.config.defaultMessageExpiryInterval,
                  contentType: 'application/json',
                  userProperties,
                },
              })
            },
          )
        } catch (error) {
          const err = new UnhandledError(StatusCode.InternalServerError, 'Failed to consume subscription message', {
            error,
          })
          span.setStatus({
            code: SpanStatusCode.ERROR,
            message: err.message,
          })
          span.recordException(err)
          this.emit(EventBridgeEventNames.EventbridgeError, err)
          log.error({ err }, 'Failed to consume subscription message')
        }
      },
    )
  }

  return handler
}
