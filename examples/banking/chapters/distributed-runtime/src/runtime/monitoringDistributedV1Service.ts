import { createMonitoringV1ServiceBuilder } from '../service/monitoring/v1/monitoringV1ServiceBuilder.js'
import { createObserveLargeDebitSubscriptionBuilder } from '../service/monitoring/v1/subscription/observeLargeDebit/observeLargeDebitSubscriptionBuilder.js'

const serviceBuilder = createMonitoringV1ServiceBuilder()
const subscription = createObserveLargeDebitSubscriptionBuilder(serviceBuilder)
	.adviceDurable(true)
	.adviceAutoacknowledgeMessage(false)
	.adviceConsumerFailureHandling({
		mode: 'strict',
		maxAttempts: 3,
		retryDelayMs: 250,
		deadLetterTarget: 'example-bank.monitoring.dead-letter',
	})

export const monitoringDistributedV1Service = serviceBuilder.addSubscriptionDefinition(
	subscription.getDefinition(),
)
