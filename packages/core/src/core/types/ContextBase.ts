import type { Context, Span, SpanOptions } from '@opentelemetry/api'

import type { ConfigDeleteFunction } from '../ConfigStore/types/ConfigDeleteFunction.js'
import type { ConfigGetterFunction } from '../ConfigStore/types/ConfigGetterFunction.js'
import type { ConfigSetterFunction } from '../ConfigStore/types/ConfigSetterFunction.js'
import type { SecretDeleteFunction } from '../SecretStore/types/SecretDeleteFunction.js'
import type { SecretGetterFunction } from '../SecretStore/types/SecretGetterFunction.js'
import type { SecretSetterFunction } from '../SecretStore/types/SecretSetterFunction.js'
import type { StateDeleteFunction } from '../StateStore/types/StateDeleteFunction.js'
import type { StateGetterFunction } from '../StateStore/types/StateGetterFunction.js'
import type { StateSetterFunction } from '../StateStore/types/StateSetterFunction.js'
import type { EmptyObject } from './EmptyObject.js'
import type { Logger } from './Logger.js'
import type { PuristaMetricContext, PuristaMetricDefinitions } from './PuristaMetrics.js'
import type { QueueContext } from './queue/QueueContext.js'

/**
 * The ContextBase provides is a basic type.
 * Each context for command function, subscription function and all Hooks and transformers will have at least the properties of this type.
 */
export type ContextBase<Metrics extends PuristaMetricDefinitions = EmptyObject> = {
	/** the logger instance */
	logger: Logger
	/** typed custom metrics declared on the current builder scope */
	metrics: PuristaMetricContext<Metrics>
	/** wrap given function in an opentelemetry span */
	wrapInSpan: <F>(name: string, opts: SpanOptions, fn: (span: Span) => Promise<F>, context?: Context) => Promise<F>
	/** wrap given function in an opentelemetry active span */
	startActiveSpan: <F>(
		name: string,
		opts: SpanOptions,
		context: Context | undefined,
		fn: (span: Span) => Promise<F>,
	) => Promise<F>
	/** the secret store  */
	secrets: {
		/** get a secret from the secret store */
		getSecret: SecretGetterFunction
		/** set a secret in the secret store */
		setSecret: SecretSetterFunction
		/** delete a secret from the secret store */
		removeSecret: SecretDeleteFunction
	}
	/** the config store */
	configs: {
		/** get a config value from the config store */
		getConfig: ConfigGetterFunction
		/** set a config value in the config store */
		setConfig: ConfigSetterFunction
		/** delete a config value from the config store */
		removeConfig: ConfigDeleteFunction
	}
	/** the state store */
	states: {
		/** get a state value from the state store */
		getState: StateGetterFunction
		/** set a state value in the state store */
		setState: StateSetterFunction
		/** delete a state value from the state store */
		removeState: StateDeleteFunction
	}
	queue: QueueContext
}
