/**
 * Raw attachment reference supplied by the application layer.
 *
 * Keep storage/provider choices outside the framework. Applications may use
 * hosted URLs, inline test data, or any other source they can normalize into
 * this shape.
 */
export type AgentAttachmentSource =
	| {
			kind: 'url'
			url: string
	  }
	| {
			kind: 'data'
			data: string | Uint8Array | ArrayBuffer
	  }

export type AgentAttachment = {
	attachmentId: string
	mediaType: string
	filename?: string
	title?: string
	byteSize?: number
	source: AgentAttachmentSource
	metadata?: Record<string, unknown>
}

/**
 * Canonical normalized model input surface used across the runtime.
 *
 * Applications should convert higher-level uploads/documents into these parts
 * before model invocation. For non-native formats such as PDF or Office files,
 * use a file-ingestion adapter rather than adding parser logic directly to the
 * framework runtime.
 */
export type AgentTextInputPart = {
	type: 'text'
	text: string
	metadata?: Record<string, unknown>
}

export type AgentImageInputPart = {
	type: 'image'
	attachmentId?: string
	image: string | Uint8Array | ArrayBuffer | URL
	mediaType?: string
	filename?: string
	title?: string
	detail?: 'low' | 'high' | 'auto'
	metadata?: Record<string, unknown>
}

export type AgentFileInputPart = {
	type: 'file'
	attachmentId?: string
	data: string | Uint8Array | ArrayBuffer | URL
	mediaType: string
	filename?: string
	title?: string
	metadata?: Record<string, unknown>
}

export type AgentInputPart = AgentTextInputPart | AgentImageInputPart | AgentFileInputPart

export const isImageMediaType = (mediaType: string) => mediaType.toLowerCase().startsWith('image/')

export const toAttachmentUrl = (url: string) => {
	try {
		return new URL(url)
	} catch {
		return url
	}
}

export const attachmentToInputPart = (attachment: AgentAttachment): AgentInputPart => {
	const shared = {
		attachmentId: attachment.attachmentId,
		filename: attachment.filename,
		title: attachment.title,
		metadata: attachment.metadata,
	}
	const sourceData =
		attachment.source.kind === 'url'
			? toAttachmentUrl(attachment.source.url)
			: attachment.source.data

	if (isImageMediaType(attachment.mediaType)) {
		return {
			type: 'image',
			image: sourceData,
			mediaType: attachment.mediaType,
			...shared,
		}
	}

	return {
		type: 'file',
		data: sourceData,
		mediaType: attachment.mediaType,
		...shared,
	}
}

export const attachmentsToInputParts = (attachments: AgentAttachment[] | undefined): AgentInputPart[] =>
	(attachments ?? []).map(attachmentToInputPart)
