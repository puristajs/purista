import type { Encoder } from './types/Encoder.js'
import type { Encrypter } from './types/Encrypter.js'

/**
 * Decrypts and decodes an AMQP payload with the configured handlers.
 *
 * `contentEncoding` selects the decrypt function and `contentType` selects the
 * decode function. The default bridge configuration uses JSON plus a no-op
 * UTF-8 encrypter; provide a real encrypter before sending confidential data.
 */
export const decodeContent = async <T>(
	input: Buffer,
	contentType: string,
	contentEncoding: string,
	encrypter: Encrypter,
	encoder: Encoder,
): Promise<T> => {
	const decrypter = encrypter[contentEncoding]
	if (!decrypter) {
		throw new Error(`Decrypt not defined for ${contentEncoding}`)
	}

	const decrypted = await decrypter.decrypt(input)

	const decoder = encoder[contentType]
	if (!decoder) {
		throw new Error(`Decode not defined for ${contentType}`)
	}
	return decoder.decode(decrypted)
}
