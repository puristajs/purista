import type { CorrelationId } from '../types/CorrelationId.js'
import type { HarnessTransportEnvelope } from '../types/commandType/Command.js'
import { getNewCorrelationId } from './getNewCorrelationId.impl.js'

/**
 * The reserved Harness transport metadata accepted by EventBridge implementations.
 *
 * Application invocation parameters never contain this envelope. Core attaches it
 * after validating a mounted target invocation.
 *
 * @group Helper
 */
export type HarnessTransportCorrelationInput = Readonly<{
	readonly harness?: HarnessTransportEnvelope
}>

/**
 * Selects the transport correlation for an EventBridge invocation.
 *
 * Harness roots use their immutable invocation id so aggregate and stream
 * deliveries retain one identity across transports. Other messages receive a new
 * transport correlation id.
 *
 * @example
 * ```ts
 * const correlationId = getHarnessTransportCorrelationId(input)
 * ```
 *
 * @group Helper
 */
export const getHarnessTransportCorrelationId = (input: HarnessTransportCorrelationInput): CorrelationId =>
	input.harness?.root?.invocationId ?? getNewCorrelationId()
