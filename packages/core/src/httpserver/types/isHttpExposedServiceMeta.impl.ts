import { HttpExposedServiceMeta } from './HttpExposedServiceMeta'

/**
 * Checks if given input is type of HttpExposedServiceMeta
 * @param input
 * @returns boolean - true if input is type of HttpExposedServiceMeta
 */
export const isHttpExposedServiceMeta = (input?: unknown): input is HttpExposedServiceMeta => {
  if (!input || typeof input !== 'object') {
    return false
  }
  if (!Object.prototype.hasOwnProperty.call(input, 'expose')) {
    return false
  }
  return true
}
