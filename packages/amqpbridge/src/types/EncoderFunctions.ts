/**
 * Encode/decode contract for one content-type codec.
 */
export type EncoderFunctions = {
	/** Encodes a JavaScript value into a binary payload. */
	encode: <T>(input: T) => Promise<Buffer>
	/** Decodes a binary payload into a JavaScript value. */
	decode: <T>(input: Buffer) => Promise<T>
}
