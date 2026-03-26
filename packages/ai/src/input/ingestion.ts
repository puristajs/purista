/**
 * Framework-level extension seam for turning raw file attachments into
 * normalized runtime input parts.
 *
 * Important: the framework provides only the contract and orchestration hook.
 * Concrete PDF, Office, OCR, or domain-specific document parsing belongs in
 * application-provided ingestors.
 */
import type { AgentAttachment, AgentInputPart } from './types.js'
import { attachmentToInputPart, isImageMediaType } from './types.js'

export type FileIngestionContext = {
	tenantId?: string
	principalId?: string
	sessionId?: string
	metadata?: Record<string, unknown>
}

export type FileIngestionResult = {
	attachment: AgentAttachment
	parts: AgentInputPart[]
	extractedText?: string
	previewText?: string
	metadata?: Record<string, unknown>
}

export interface FileIngestor {
	readonly name: string
	supports(attachment: AgentAttachment): boolean
	ingest(attachment: AgentAttachment, context: FileIngestionContext): Promise<FileIngestionResult>
}

export class PassthroughImageFileIngestor implements FileIngestor {
	readonly name = 'passthrough-image'

	supports(attachment: AgentAttachment): boolean {
		return isImageMediaType(attachment.mediaType)
	}

	async ingest(attachment: AgentAttachment): Promise<FileIngestionResult> {
		return {
			attachment,
			parts: [attachmentToInputPart(attachment)],
			previewText: attachment.title ?? attachment.filename,
		}
	}
}

export const ingestAttachment = async (
	attachment: AgentAttachment,
	ingestors: FileIngestor[],
	context: FileIngestionContext = {},
): Promise<FileIngestionResult> => {
	const ingestor = ingestors.find(candidate => candidate.supports(attachment))
	if (!ingestor) {
		throw new Error(`No file ingestor registered for media type "${attachment.mediaType}"`)
	}
	return await ingestor.ingest(attachment, context)
}
