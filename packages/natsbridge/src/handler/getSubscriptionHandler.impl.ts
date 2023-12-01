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
import type { JsMsg, Msg, NatsError } from 'nats'

import { deserializeOtpFromNats } from '../deserializeOtpFromNats.impl'
import type { NatsBridge } from '../NatsBridge'
import { serializeOtpToNats } from '../serializeOtpToNats.impl'
import { getTopicName } from '../topic'

export const getSubscriptionHandler = (
  subscription: Subscription,
  cb: (message: EBMessage) => Promise<Omit<CustomMessage, 'id' | 'timestamp'> | undefined>,
) => {
  const handler = async function (this: NatsBridge, error: NatsError | null, msg: Msg | JsMsg) {
    if (error) {
      const err = UnhandledError.fromError(error)
      this.logger.error({ err, address: subscription.receiver }, `error in subscription: ${err.message}`)
      return
    }

    let message: EBMessage
    try {
      message = this.sc.decode(msg.data) as EBMessage
    } catch (err) {
      this.logger.error({ err, address: subscription.receiver }, `error in subscription - unable to extract payload`)
      return
    }

    const context = deserializeOtpFromNats(this.logger, message, msg.headers)
    return this.startActiveSpan(
      PuristaSpanName.EventBridgeCommandReceived,
      { kind: SpanKind.CONSUMER },
      context,
      async (span) => {
        const log = this.logger.getChildLogger({ ...span.spanContext(), traceId: message.traceId })

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

              const userProperties: BrokerHeaderCustomMsg = serializeOtpToNats({
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

              this.connection?.publish(topic, this.sc.encode(responseMessage))
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
