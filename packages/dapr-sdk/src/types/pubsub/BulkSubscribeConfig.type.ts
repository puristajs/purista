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

// https://github.com/dapr/dapr/blob/master/pkg/apis/subscriptions/v2alpha1/types.go#L53

/**
 * BulkSubscribeConfig defines the configuration for a bulk subscription
 **/
export type BulkSubscribeConfig = {
	// Flag to enable/disable bulk subscribe
	/**
	 * Stores the enabled value exposed by BulkSubscribeConfig.
	 * Treat this property as runtime state unless the concrete API documents a stronger guarantee.
	 */
	enabled: boolean

	// Max number of messages to be sent in a single bulk request
	/**
	 * Stores the maxMessagesCount value exposed by BulkSubscribeConfig.
	 * Treat this property as runtime state unless the concrete API documents a stronger guarantee.
	 */
	maxMessagesCount?: number

	// Max duration to wait for messages to be sent in a single bulk request
	/**
	 * Stores the maxAwaitDurationMs value exposed by BulkSubscribeConfig.
	 * Treat this property as runtime state unless the concrete API documents a stronger guarantee.
	 */
	maxAwaitDurationMs?: number
}
