import type { Context, Span, SpanOptions } from '@opentelemetry/api'

import type { ConfigDeleteFunction, ConfigGetterFunction, ConfigSetterFunction } from '../ConfigStore/index.js'
import type { SecretDeleteFunction, SecretGetterFunction, SecretSetterFunction } from '../SecretStore/index.js'
import type { StateDeleteFunction, StateGetterFunction, StateSetterFunction } from '../StateStore/index.js'
import type { Logger } from './Logger.js'

/**
 * The ContextBase provides is a basic type.
 * Each context for command function, subscription function and all Hooks and transformers will have at least the properties of this type.
 */
export type ContextBase = {
	/** the logger instance */
	logger: Logger
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
}
