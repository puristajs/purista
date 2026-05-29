/**
 * AWS Systems Manager Parameter Store adapter for PURISTA config values.
 *
 * The store caches reads in memory by default. Configure AWS credentials through
 * the AWS SDK provider chain or `client` options, and use tenant-aware parameter
 * names such as `/tenants/acme/prod/app/theme`.
 *
 * @example
 * ```typescript
 * const store = new AWSConfigStore({
 *   client: { region: 'eu-central-1' },
 *   cacheTtl: 60_000,
 * })
 *
 * await store.setConfig('/tenants/acme/prod/app/theme', 'dark')
 * const config = await store.getConfig('/tenants/acme/prod/app/theme')
 * ```
 *
 * @module
 */
export * from './AWSConfigStore.impl.js'
export * from './types.js'
export * from './version.js'
