import type { CorrelationId } from '../types/CorrelationId.js'
import { getUniqueId } from './getUniqueId.impl.js'

/**
 * Create a new unique event bridge correlation id
 * @returns EBMessageId
 *
 * @group Helper
 */
export const getNewCorrelationId = (): CorrelationId => getUniqueId()
