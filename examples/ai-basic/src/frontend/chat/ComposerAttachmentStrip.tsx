import {
	Attachment,
	AttachmentHoverCard,
	AttachmentHoverCardContent,
	AttachmentHoverCardTrigger,
	AttachmentInfo,
	AttachmentPreview,
	AttachmentRemove,
	Attachments,
	getAttachmentLabel,
} from '@/components/ai-elements/attachments'
import { PromptInputHeader, usePromptInputAttachments } from '@/components/ai-elements/prompt-input'

export const ComposerAttachmentStrip = () => {
	const attachments = usePromptInputAttachments()

	if (attachments.files.length === 0) {
		return null
	}

	return (
		<PromptInputHeader>
			<Attachments className="w-full" variant="inline">
				{attachments.files.map(file => (
					<Attachment data={file} key={file.id} onRemove={() => attachments.remove(file.id)} variant="inline">
						<AttachmentHoverCard>
							<AttachmentHoverCardTrigger>
								<div className="flex items-center gap-2">
									<AttachmentPreview data={file} variant="inline" />
									<AttachmentInfo data={file} />
								</div>
							</AttachmentHoverCardTrigger>
							<AttachmentHoverCardContent>
								<div className="flex flex-col gap-3">
									<AttachmentPreview className="rounded-xl" data={file} variant="grid" />
									<div>
										<p className="text-sm font-medium">{getAttachmentLabel(file)}</p>
										<p className="text-xs text-muted-foreground">{file.mediaType}</p>
									</div>
								</div>
							</AttachmentHoverCardContent>
						</AttachmentHoverCard>
						<AttachmentRemove onRemove={() => attachments.remove(file.id)} />
					</Attachment>
				))}
			</Attachments>
		</PromptInputHeader>
	)
}
