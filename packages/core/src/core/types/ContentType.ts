/**
 * List of content types for message payloads.
 * If the content type is other than `application/json`, the message payload must be a string.
 * It is up to the implementation to extract the content type from the original message and to convert or transform data.
 */
export type ContentType =
  | 'application/json'
  | 'application/javascript'
  | 'text/csv'
  | 'text/css'
  | 'text/html'
  | 'text/javascript'
  | 'text/markdown'
  | 'text/plain'
  | 'text/xml'
  | string
