import type { InstanceId } from './InstanceId.js'

/**
 * A event bridge message address describes the sender or receiver of a message.
 */
export type EBMessageAddress = {
	/** the name of the service */
	serviceName: Exclude<string, ''>
	/** the version of the service */
	serviceVersion: Exclude<string, ''>
	/** the name of the command or subscription */
	serviceTarget: Exclude<string, ''>
	/** instance id of eventbridge */
	instanceId?: Exclude<InstanceId, ''>
}
