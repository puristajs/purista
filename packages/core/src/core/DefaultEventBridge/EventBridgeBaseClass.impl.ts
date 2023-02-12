import { Context, Span, SpanOptions, SpanStatusCode } from '@opentelemetry/api'
import { Resource } from '@opentelemetry/resources'
import { NodeTracerProvider, SpanProcessor } from '@opentelemetry/sdk-trace-node'
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions'

import { puristaVersion } from '../../version'
import { initLogger } from '../DefaultLogger'
import { EventBridgeEvents, GenericEventEmitter, Logger } from '../types'

export class EventBridgeBaseClass extends GenericEventEmitter<EventBridgeEvents> {
  logger: Logger
  traceProvider: NodeTracerProvider
  constructor(name: string, options?: { logger?: Logger; spanProcessor?: SpanProcessor }) {
    super()

    const logger = options?.logger || initLogger()
    this.logger = logger.getChildLogger({ name })

    const resource = Resource.default().merge(
      new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: name,
        [SemanticResourceAttributes.SERVICE_VERSION]: puristaVersion,
      }),
    )

    this.traceProvider = new NodeTracerProvider({
      resource,
    })

    if (options?.spanProcessor) {
      this.traceProvider.addSpanProcessor(options?.spanProcessor)
    }

    this.traceProvider.register()
  }

  /**
   * Returns open telemetry tracer of this service
   *
   * @returns Tracer
   */
  getTracer() {
    return this.traceProvider.getTracer('DefaultEventBridge', puristaVersion)
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
      span.setAttribute('purista.version', puristaVersion)
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
    span.setAttribute('purista.version', puristaVersion)
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
}
