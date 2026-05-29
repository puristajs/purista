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

/**
 * Failed entry reported by Dapr's bulk publish API response.
 */
export type PubSubBulkPublishApiResponseStatus = {
	/** Entry id from the bulk publish request. */
	entryID: string
	/** Error message returned by Dapr for this entry. */
	error: string
}

/**
 * Response from a bulk publish API request.
 */
export type PubSubBulkPublishApiResponse = {
	/** Entries that Dapr rejected while processing the bulk publish request. */
	failedEntries: PubSubBulkPublishApiResponseStatus[]
}
