import type { SinonSandbox } from 'sinon'
import { createSandbox } from 'sinon'

import { decodeContent } from './decodeContent.impl.js'
import type { Encoder, Encrypter } from './types/index.js'

describe('decodeContent', () => {
	const sandbox: SinonSandbox = createSandbox()

	afterEach(() => {
		sandbox.restore()
	})

	const inputBuffer = Buffer.from('')
	const encryptedBuffer = Buffer.from('encryptedData')
	const decryptedBuffer = Buffer.from('decryptedData')
	const decodedObject = { message: 'Hello, world!' }

	const encryptMock = sandbox.stub().resolves(encryptedBuffer)
	const decryptMock = sandbox.stub().resolves(decryptedBuffer)

	const mockEncrypter: Encrypter = {
		aes256: {
			encrypt: encryptMock,
			decrypt: decryptMock,
		},
	}

	const encodeMock = sandbox.stub().resolves(encryptedBuffer)
	const decodeMock = sandbox.stub().resolves(decodedObject)

	const mockEncoder: Encoder = {
		'application/json': {
			encode: encodeMock,
			decode: decodeMock,
		},
	}

	it('should decode encrypted and encoded content', async () => {
		const result = await decodeContent(inputBuffer, 'application/json', 'aes256', mockEncrypter, mockEncoder)

		expect(result).toEqual(decodedObject)
		expect(decryptMock.calledOnceWith(inputBuffer)).toBe(true)
		expect(decodeMock.calledOnceWith(decryptedBuffer)).toBe(true)
	})

	it('should throw an error if decrypter is not defined', async () => {
		const invalidContentEncoding = 'invalidEncoding'

		await expect(
			decodeContent(inputBuffer, 'application/json', invalidContentEncoding, mockEncrypter, mockEncoder),
		).rejects.toThrow(`Decrypt not defined for ${invalidContentEncoding}`)
	})

	it('should throw an error if decoder is not defined', async () => {
		const invalidContentType = 'invalidType'

		await expect(decodeContent(inputBuffer, invalidContentType, 'aes256', mockEncrypter, mockEncoder)).rejects.toThrow(
			`Decode not defined for ${invalidContentType}`,
		)
	})
})
