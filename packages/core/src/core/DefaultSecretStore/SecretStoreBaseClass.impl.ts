import { Context, Span, SpanOptions, SpanStatusCode } from '@opentelemetry/api'
import { Resource } from '@opentelemetry/resources'
import { NodeTracerProvider, SpanProcessor } from '@opentelemetry/sdk-trace-node'
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions'

import { puristaVersion } from '../../version'
import { initLogger } from '../DefaultLogger'
import { Logger, PuristaSpanTag } from '../types'

/**
 * Base class for secret store adapters
 */
export class SecretStoreBaseClass<ConfigType = Record<string, unknown>> {
  logger: Logger
  traceProvider: NodeTracerProvider
  config: ConfigType

  name: string

  started = false
  healthy = false

  constructor(name: string, config?: ConfigType, options?: { logger?: Logger; spanProcessor?: SpanProcessor }) {
    const logger = options?.logger || initLogger()
    this.logger = logger.getChildLogger({ name })

    const resource = Resource.default().merge(
      new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: name,
        [SemanticResourceAttributes.SERVICE_VERSION]: puristaVersion,
      }),
    )

    this.name = name

    this.traceProvider = new NodeTracerProvider({
      resource,
    })

    if (options?.spanProcessor) {
      this.traceProvider.addSpanProcessor(options?.spanProcessor)
    }

    this.traceProvider.register()

    this.config = config || ({} as ConfigType)
  }

  async isReady() {
    return this.started
  }

  async isHealthy() {
    return this.started && this.healthy
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
      span.setAttribute(PuristaSpanTag.PuristaVersion, puristaVersion)
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
}
