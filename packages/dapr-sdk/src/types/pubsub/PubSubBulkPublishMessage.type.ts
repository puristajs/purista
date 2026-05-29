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

import type { KeyValueType } from './KeyValue.type.js'

/**
 * Explicit Dapr bulk publish message with per-entry metadata.
 */
export type PubSubBulkPublishMessageExplicit = {
	/** Optional caller-provided entry id. */
	entryID?: string
	/** Event payload published for this entry. */
	event: object | string
	/** Dapr metadata sent with this entry. */
	metadata?: KeyValueType
	/** Content type for the event payload. */
	contentType?: string
}

/**
 * PubSubBulkPublishMessage is a message in a bulk publish request.
 */
export type PubSubBulkPublishMessage = PubSubBulkPublishMessageExplicit | object | string
