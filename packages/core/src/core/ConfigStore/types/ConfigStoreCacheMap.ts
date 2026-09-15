/** In-process cache entries used by {@link ConfigStoreBaseClass}. */
export type ConfigStoreCacheMap = Map<string, { createdAt: number; value: unknown }>
