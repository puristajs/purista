import { EBMessageType, isHttpExposedServiceMeta } from '@purista/core'

import { honoV1ServiceBuilder } from '../../honoV1ServiceBuilder.js'
import { honoV1ServiceCommandsToRestApiInputPayloadSchema } from './schema.js'

/**
 * Subscription builder that dynamically adds HTTP endpoints for newly announced commands.
 *
 * It listens for service-function info messages on every instance and registers
 * only definitions that carry HTTP exposure metadata. This is endpoint
 * projection, not queue or stream execution.
 */
export const serviceCommandsToRestApiSubscriptionBuilder = honoV1ServiceBuilder
	.getSubscriptionBuilder(
		'serviceCommandsToRestApi',
		'listens for InfoMessages and adds endpoints for commands if they are configured to be exposed as http endpoint',
	)
	.adviceDurable(false)
	.adviceAutoacknowledgeMessage()
	.filterForMessageType(EBMessageType.InfoServiceFunctionAdded)
	.receiveMessageOnEveryInstance()
	.addPayloadSchema(honoV1ServiceCommandsToRestApiInputPayloadSchema)
	.setSubscriptionFunction(async function ({ message }, payload, _parameter) {
		if (!isHttpExposedServiceMeta(payload)) {
			return
		}

		this.addEndpoint(payload, message.sender)
	})
