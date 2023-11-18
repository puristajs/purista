import type { ClientOptions } from 'google-gax'

/**
 * Google Secret Manager store config
 */
export type GoogleSecretStoreConfig = {
  /**
   * The google project id in format of projects/* without ending /secrets
   * @example projects/428371962963
   */
  project: string
  /**
   * Google client options
   */
  client?: ClientOptions
}
