/**
 * Client API for applications that consume PURISTA HTTP contracts.
 *
 * This explicit subpath keeps generated-client and outbound HTTP utilities out
 * of the builder-focused application root.
 */
export * from '../ClientBuilder/index.js'
export * from '../HttpClient/index.js'
