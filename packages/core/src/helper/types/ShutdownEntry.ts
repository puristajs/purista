/**
 * One runtime dependency that participates in graceful shutdown.
 */
export type ShutdownEntry = {
	/** Human-readable dependency name used in shutdown diagnostics. */
	name: string
	/** Async cleanup operation called during shutdown. */
	destroy: () => Promise<void>
}
