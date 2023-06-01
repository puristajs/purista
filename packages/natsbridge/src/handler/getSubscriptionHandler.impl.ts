import { SpanKind, SpanStatusCode } from '@opentelemetry/api'
import {
  CustomMessage,
  deserializeOtp,
  EBMessage,
  EventBridgeEventNames,
  PuristaSpanName,
  PuristaSpanTag,
  serializeOtp,
  StatusCode,
  Subscription,
  UnhandledError,
} from '@purista/core'
import { JsMsg, Msg, NatsError } from 'nats'

import { deserializeOtpFromNats } from '../deserializeOtpFromNats.impl'
import { NatsBridge } from '../NatsBridge'
import { serializeOtpToNats } from '../serializeOtpToNats.impl'
import { getTopicName } from '../topic'

export const getSubscriptionHandler = (
  subscription: Subscription,
  cb: (message: EBMessage) => Promise<Omit<CustomMessage, 'id' | 'timestamp' | 'instanceId'> | undefined>,
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
                instanceId: this.instanceId,
                otp: serializeOtp(),
              }

              subSpan.setAttribute(PuristaSpanTag.SenderServiceName, responseMessage.sender.serviceName)
              subSpan.setAttribute(PuristaSpanTag.SenderServiceVersion, responseMessage.sender.serviceVersion)
              subSpan.setAttribute(PuristaSpanTag.SenderServiceTarget, responseMessage.sender.serviceTarget)

              if (!responseMessage.eventName) {
                return
              }

              subSpan.addEvent(responseMessage.eventName)

              const userProperties: Record<string, string> = serializeOtpToNats({
                messageType: responseMessage.messageType,
                senderServiceName: responseMessage.sender.serviceName,
                senderServiceVersion: responseMessage.sender.serviceVersion,
                senderServiceTarget: responseMessage.sender.serviceTarget,
                instanceId: responseMessage.instanceId,
                eventName: responseMessage.eventName,
              })

              if (responseMessage.principalId) {
                userProperties.principalId = responseMessage.principalId
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
