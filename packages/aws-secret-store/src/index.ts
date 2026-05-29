/**
 * AWS Secrets Manager adapter for PURISTA secret values.
 *
 * The store caches reads in memory by default. Configure AWS credentials through
 * the AWS SDK provider chain or `client` options. Never log values returned by
 * this package.
 *
 * @example
 * ```typescript
 * const store = new AWSSecretStore({
 *   client: { region: 'eu-central-1' },
 *   cacheTtl: 30_000,
 * })
 *
 * await store.setSecret('tenants/acme/prod/payments/api-token', 'placeholder-secret')
 * const secret = await store.getSecret('tenants/acme/prod/payments/api-token')
 * ```
 *
 * @module
 */
export * from './AWSSecretStore.impl.js'
export * from './types.js'
export * from './version.js'
