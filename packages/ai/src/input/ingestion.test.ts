import { describe, expect, it } from 'vitest'

import { ingestAttachment, PassthroughImageFileIngestor } from './ingestion.js'

describe('file ingestion', () => {
	it('passes image attachments through as native image parts', async () => {
		const result = await ingestAttachment(
			{
				attachmentId: 'img-1',
				mediaType: 'image/png',
				filename: 'mockup.png',
				source: {
					kind: 'url',
					url: 'https://example.com/mockup.png',
				},
			},
			[new PassthroughImageFileIngestor()],
		)

		expect(result.parts).toEqual([
			{
				type: 'image',
				attachmentId: 'img-1',
				image: new URL('https://example.com/mockup.png'),
				mediaType: 'image/png',
				filename: 'mockup.png',
				title: undefined,
				metadata: undefined,
			},
		])
	})

	it('throws when no ingestor supports the media type', async () => {
		await expect(
			ingestAttachment(
				{
					attachmentId: 'pdf-1',
					mediaType: 'application/pdf',
					source: {
						kind: 'url',
						url: 'https://example.com/brief.pdf',
					},
				},
				[new PassthroughImageFileIngestor()],
			),
		).rejects.toThrow('No file ingestor registered for media type "application/pdf"')
	})
})
