/**
 * Policy for command responses that arrive after invocation timeout.
 *
 * @group Event bridge
 */
export enum EventBridgeLateResponseHandling {
	/** Drop the late response and write a warning with correlation metadata. */
	IgnoreWithWarning = 'ignore-with-warning',
	/** Late response handling is not relevant for this transport. */
	NotApplicable = 'not-applicable',
}
