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
