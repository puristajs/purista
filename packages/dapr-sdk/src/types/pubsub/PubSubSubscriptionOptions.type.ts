/*
Copyright 2022 The Dapr Authors
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import type { BulkSubscribeConfig } from './BulkSubscribeConfig.type.js'
import type { TypeDaprPubSubCallback } from './DaprPubSubCallback.type.js'
import type { DaprPubSubRouteType } from './DaprPubSubRouteType.type.js'
import type { KeyValueType } from './KeyValue.type.js'

/**
 * PubSubSubscriptionOptionsType defines the options we can pass while subscribing
 */
export type PubSubSubscriptionOptionsType = {
	// Metadata
	/**
	 * Stores the metadata value exposed by PubSubSubscriptionOptionsType.
	 * Treat this property as runtime state unless the concrete API documents a stronger guarantee.
	 */
	metadata?: KeyValueType

	// The deadletter topic path
	/**
	 * Stores the deadLetterTopic value exposed by PubSubSubscriptionOptionsType.
	 * Treat this property as runtime state unless the concrete API documents a stronger guarantee.
	 */
	deadLetterTopic?: string

	// The deadletter callback to call
	/**
	 * Stores the deadLetterCallback value exposed by PubSubSubscriptionOptionsType.
	 * Treat this property as runtime state unless the concrete API documents a stronger guarantee.
	 */
	deadLetterCallback?: TypeDaprPubSubCallback

	// The default callback
	/**
	 * Stores the callback value exposed by PubSubSubscriptionOptionsType.
	 * Treat this property as runtime state unless the concrete API documents a stronger guarantee.
	 */
	callback?: TypeDaprPubSubCallback

	// The route creation for a single route or DaprPubSubRouteType
	/**
	 * Stores the route value exposed by PubSubSubscriptionOptionsType.
	 * Treat this property as runtime state unless the concrete API documents a stronger guarantee.
	 */
	route?: string | DaprPubSubRouteType

	// The settings for bulk subscribe
	/**
	 * Stores the bulkSubscribe value exposed by PubSubSubscriptionOptionsType.
	 * Treat this property as runtime state unless the concrete API documents a stronger guarantee.
	 */
	bulkSubscribe?: BulkSubscribeConfig
}
