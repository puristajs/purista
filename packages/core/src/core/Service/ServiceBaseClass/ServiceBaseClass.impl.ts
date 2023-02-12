import { Context, Span, SpanOptions, SpanStatusCode } from '@opentelemetry/api'
import { Resource } from '@opentelemetry/resources'
import { NodeTracerProvider, SpanProcessor } from '@opentelemetry/sdk-trace-node'
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions'

import { EventBridge, GenericEventEmitter, Logger, ServiceEvents, ServiceInfoType } from '../../types'
import { ServiceInfoValidator } from '../ServiceInfoValidator.impl'

/**
 * Class which contains basic functions that are not directly related to
 *
 * - handling of messages
 * - handling of commands
 * - handling of subscriptions
 *
 */
export class ServiceBaseClass extends GenericEventEmitter<ServiceEvents> {
  readonly info: ServiceInfoType

  eventBridge: EventBridge

  serviceLogger: Logger

  spanProcessor: SpanProcessor | undefined

  traceProvider: NodeTracerProvider

  constructor(baseLogger: Logger, info: ServiceInfoType, eventBridge: EventBridge, spanProcessor?: SpanProcessor) {
    super()
    this.info = new Proxy(
      {
        serviceName: '',
        serviceDescription: '',
        serviceVersion: '1',
      },
      ServiceInfoValidator,
    )

    this.info.serviceDescription = info.serviceDescription
    this.info.serviceName = info.serviceName
    this.info.serviceVersion = info.serviceVersion

    this.serviceLogger = baseLogger.getChildLogger({
      serviceName: this.info.serviceName,
      serviceVersion: this.info.serviceVersion,
    })
    this.serviceLogger.debug({ ...this.info }, `creating ${this.info.serviceName} ${this.info.serviceVersion}`)

    const resource = Resource.default().merge(
      new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: this.info.serviceName,
        [SemanticResourceAttributes.SERVICE_VERSION]: this.info.serviceVersion,
      }),
    )

    this.traceProvider = new NodeTracerProvider({
      resource,
    })

    if (spanProcessor) {
      this.traceProvider.addSpanProcessor(spanProcessor)
    }

    this.traceProvider.register()

    this.eventBridge = eventBridge
  }

  /**
   * Get service info
   */
  get serviceInfo(): ServiceInfoType {
    return Object.freeze({ ...this.info })
  }

  /**
   * Returns open telemetry tracer of this service
   *
   * @returns Tracer
   */
  getTracer() {
    return this.traceProvider.getTracer(this.serviceInfo.serviceName, this.serviceInfo.serviceVersion)
  }

  /**
   * Start a child span for opentelemetry tracking
   * @param name name of span
   * @param opts span options
   * @param context optional context
   * @param fn function to be executed within the span
   * @returns return value of fn
   */
  async startActiveSpan<F>(
    name: string,
    opts: SpanOptions,
    context: Context | undefined = undefined,
    fn: (span: Span) => Promise<F>,
  ): Promise<F> {
    const tracer = this.getTracer()

    const callback = async (span: Span) => {
      try {
        return await fn(span)
      } catch (error) {
        let message = 'error'
        if (error instanceof Error) {
          message = error.message
        }

        span.recordException(error as Error)
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message,
        })

        throw error
      } finally {
        span.end()
      }
    }

    return context
      ? tracer.startActiveSpan(name, opts, context, callback)
      : tracer.startActiveSpan(name, opts, callback)
  }

  /**
   * Start span for opentelemetry tracking on same level.
   * The created span will not become the "active" span within opentelemetry!
   *
   * This means during logging and similar the spanId of parent span is logged.
   *
   * Use wrapInSpan for marking points in flow of one bigger function,
   * but not to trace the program flow itself
   *
   * @param name name of span
   * @param opts span options
   * @param fn function te be executed in the span
   * @param context span context
   * @returns return value of fn
   */
  async wrapInSpan<F>(name: string, opts: SpanOptions, fn: (span: Span) => Promise<F>, context?: Context): Promise<F> {
    const tracer = this.getTracer()
    const span = tracer.startSpan(name, opts, context)
    try {
      return await fn(span)
    } catch (error) {
      let message = 'error'
      if (error instanceof Error) {
        message = error.message
      }
      span.recordException(error as Error)
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message,
      })

      throw error
    } finally {
      span.end()
    }
  }

  async destroy() {
    await this.traceProvider.shutdown()
  }
}
