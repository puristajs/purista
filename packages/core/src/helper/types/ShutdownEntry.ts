/**
 * Entry of thing you like to shutdown gracefully
 */
export type ShutdownEntry = {
  /** the name */
  name: string
  /** a async function that is called during shutdown  */
  destroy: () => Promise<void>
}
