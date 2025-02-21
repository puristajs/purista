import type { Encoder } from './types/Encoder.js'
import type { Encrypter } from './types/Encrypter.js'

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
