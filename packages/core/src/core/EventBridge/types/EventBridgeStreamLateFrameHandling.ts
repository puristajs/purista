/**
 * Policy for stream frames that arrive after stream timeout.
 *
 * @group Event bridge
 */
export enum EventBridgeStreamLateFrameHandling {
	/** Drop the late frame and write a warning with correlation metadata. */
	IgnoreWithWarning = 'ignore-with-warning',
	/** Late frame handling is not relevant for this transport. */
	NotApplicable = 'not-applicable',
}
