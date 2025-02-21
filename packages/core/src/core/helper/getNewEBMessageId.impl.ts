import type { EBMessageId } from '../types/EBMessageId.js'
import { getUniqueId } from './getUniqueId.impl.js'

/**
 * Create a new unique event bridge message id
 *
 * @returns EBMessageId
 *
 * @group Helper
 */
export const getNewEBMessageId = (): EBMessageId => getUniqueId()
