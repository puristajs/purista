export type VariablesBase = {
  /**
   * Additional parameter passed to the commands
   */
  additionalParameter?: Record<string, unknown>
  /** The principal ID */
  principalId?: string
  /** The tenant ID */
  tenantId?: string
  /** The custom trace ID */
  traceId?: string
  /** The instance ID */
  instanceId?: string
}
