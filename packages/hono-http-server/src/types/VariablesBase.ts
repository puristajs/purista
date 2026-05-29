/**
 * Hono variables read by generated PURISTA HTTP handlers.
 */
export type VariablesBase = {
	/**
	 * Additional command or stream parameters supplied by middleware.
	 */
	additionalParameter?: Record<string, unknown>
	/** Principal id propagated to the PURISTA command or stream context. */
	principalId?: string
	/** Tenant id propagated to the PURISTA command or stream context. */
	tenantId?: string
	/** Custom trace id mirrored from the configured trace header. */
	traceId?: string
	/** Optional instance id set by application middleware. */
	instanceId?: string
}
