import type { CorrelationId } from '../types'
import { getUniqueId } from './getUniqueId.impl'

/**
 * Create a new unique event bridge correlation id
 * @returns EBMessageId
 *
 * @group Helper
 */
export const getNewCorrelationId = (): CorrelationId => getUniqueId()
