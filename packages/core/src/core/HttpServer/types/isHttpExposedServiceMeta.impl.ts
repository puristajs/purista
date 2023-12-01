import type { HttpExposedServiceMeta } from './HttpExposedServiceMeta'

/**
 * Checks if given input is type of HttpExposedServiceMeta
 * @param input
 * @returns boolean - true if input is type of HttpExposedServiceMeta
 */
export const isHttpExposedServiceMeta = (input?: any): input is HttpExposedServiceMeta => {
  if (!input || typeof input !== 'object') {
    return false
  }
  if (!input.expose?.http) {
    return false
  }
  return true
}
