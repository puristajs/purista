/**
 * The global enum which should contain all known events for all services
 */
export const ServiceEvent = {
	/**
	 * Emitted by pingPong v1 command ping:
	 * send a ping
	 */
	Pinged: 'pinged',
	/**
	 * Emitted by pingPong v1 command pong:
	 * a pong
	 */
	Ponged: 'ponged',
} as const
