import { EBMessageId } from '../types'
import { getUniqueId } from './getUniqueId.impl'

/**
 * Create a new unique event bridge message id
 *
 * @returns EBMessageId
 *
 * @group Helper
 */
export const getNewEBMessageId = (): EBMessageId => getUniqueId()
