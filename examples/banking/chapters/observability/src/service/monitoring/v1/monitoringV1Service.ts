import { monitoringV1ServiceBuilder } from './monitoringV1ServiceBuilder.js'
import { observeLargeDebitSubscriptionBuilder } from './subscription/observeLargeDebit/observeLargeDebitSubscriptionBuilder.js'

export const monitoringV1Service = monitoringV1ServiceBuilder.addSubscriptionDefinition(
	observeLargeDebitSubscriptionBuilder.getDefinition(),
)
