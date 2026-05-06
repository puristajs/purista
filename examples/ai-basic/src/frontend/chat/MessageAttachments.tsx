import type { FileUIPart } from 'ai'
import {
	Attachment,
	AttachmentHoverCard,
	AttachmentHoverCardContent,
	AttachmentHoverCardTrigger,
	AttachmentInfo,
	AttachmentPreview,
	Attachments,
	getAttachmentLabel,
} from '@/components/ai-elements/attachments'

export const MessageAttachments = ({
	files,
	variant = 'grid',
}: {
	files: (FileUIPart & { id: string })[]
	variant?: 'grid' | 'inline' | 'list'
}) => {
	if (files.length === 0) {
		return null
	}

	return (
		<Attachments variant={variant}>
			{files.map(file => (
				<Attachment data={file} key={file.id} variant={variant}>
					<AttachmentHoverCard>
						<AttachmentHoverCardTrigger>
							<div className={variant === 'inline' ? 'flex items-center gap-2' : 'flex flex-col gap-2'}>
								<AttachmentPreview data={file} variant={variant} />
								<AttachmentInfo data={file} showMediaType={variant !== 'inline'} />
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
				</Attachment>
			))}
		</Attachments>
	)
}
