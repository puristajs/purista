'use client'

import type { FileUIPart, SourceDocumentUIPart } from 'ai'
import { FileIcon, FileTextIcon, ImageIcon, Music4Icon, VideoIcon, XIcon } from 'lucide-react'
import type { ComponentProps, HTMLAttributes, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { cn } from '@/lib/utils'

type AttachmentData = (FileUIPart | SourceDocumentUIPart) & { id: string }
type AttachmentVariant = 'grid' | 'inline' | 'list'

const isSourceDocument = (data: AttachmentData): data is SourceDocumentUIPart & { id: string } =>
	data.type === 'source-document'

export const getMediaCategory = (data: AttachmentData) => {
	if (isSourceDocument(data)) {
		return 'source'
	}
	if (data.mediaType.startsWith('image/')) {
		return 'image'
	}
	if (data.mediaType.startsWith('video/')) {
		return 'video'
	}
	if (data.mediaType.startsWith('audio/')) {
		return 'audio'
	}
	if (data.mediaType.includes('pdf') || data.mediaType.includes('text') || data.mediaType.includes('json')) {
		return 'document'
	}
	return 'unknown'
}

export const getAttachmentLabel = (data: AttachmentData) =>
	('filename' in data && typeof data.filename === 'string' && data.filename.length > 0 ? data.filename : undefined) ??
	('title' in data && typeof data.title === 'string' && data.title.length > 0 ? data.title : undefined) ??
	(getMediaCategory(data) === 'image' ? 'Image' : undefined) ??
	(getMediaCategory(data) === 'video' ? 'Video' : undefined) ??
	(getMediaCategory(data) === 'audio' ? 'Audio' : undefined) ??
	(getMediaCategory(data) === 'source' ? 'Source document' : undefined) ??
	'Attachment'

const MediaFallbackIcon = ({ data }: { data: AttachmentData }) => {
	switch (getMediaCategory(data)) {
		case 'image':
			return <ImageIcon className="size-4" />
		case 'video':
			return <VideoIcon className="size-4" />
		case 'audio':
			return <Music4Icon className="size-4" />
		case 'document':
		case 'source':
			return <FileTextIcon className="size-4" />
		default:
			return <FileIcon className="size-4" />
	}
}

type AttachmentsProps = HTMLAttributes<HTMLDivElement> & {
	variant?: AttachmentVariant
}

export const Attachments = ({ className, variant = 'grid', ...props }: AttachmentsProps) => (
	<div
		className={cn(
			variant === 'grid' && 'grid grid-cols-2 gap-2 sm:grid-cols-3',
			variant === 'inline' && 'flex flex-wrap gap-2',
			variant === 'list' && 'flex flex-col gap-2',
			className,
		)}
		data-variant={variant}
		{...props}
	/>
)

type AttachmentContextValue = {
	data: AttachmentData
	onRemove?: () => void
	variant: AttachmentVariant
}

const AttachmentContext = ({ children, value }: { children: ReactNode; value: AttachmentContextValue }) => (
	<div data-attachment-context={JSON.stringify({ id: value.data.id })}>{children}</div>
)

const attachmentRootStyles: Record<AttachmentVariant, string> = {
	grid: 'group relative overflow-hidden rounded-xl border bg-background',
	inline: 'group inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1.5',
	list: 'group relative flex items-center gap-3 rounded-xl border bg-background px-3 py-2',
}

type AttachmentProps = HTMLAttributes<HTMLDivElement> & {
	data: AttachmentData
	onRemove?: () => void
	variant?: AttachmentVariant
}

export const Attachment = ({ children, className, data, onRemove, variant = 'grid', ...props }: AttachmentProps) => (
	<AttachmentContext value={{ data, onRemove, variant }}>
		<div className={cn(attachmentRootStyles[variant], className)} {...props}>
			{children}
		</div>
	</AttachmentContext>
)

type AttachmentPreviewProps = HTMLAttributes<HTMLDivElement> & {
	data?: AttachmentData
	fallbackIcon?: ReactNode
	variant?: AttachmentVariant
}

export const AttachmentPreview = ({
	className,
	data,
	fallbackIcon,
	variant = 'grid',
	...props
}: AttachmentPreviewProps) => {
	if (!data) {
		return null
	}
	const category = getMediaCategory(data)
	const label = getAttachmentLabel(data)

	if (category === 'image') {
		return (
			<div
				className={cn(
					variant === 'grid' ? 'aspect-video w-full bg-muted' : 'size-10 shrink-0 overflow-hidden rounded-lg bg-muted',
					className,
				)}
				{...props}
			>
				<img alt={label} className="h-full w-full object-cover" src={isSourceDocument(data) ? undefined : data.url} />
			</div>
		)
	}

	if (category === 'video') {
		return (
			<div
				className={cn(
					variant === 'grid'
						? 'aspect-video w-full overflow-hidden bg-muted'
						: 'size-10 shrink-0 overflow-hidden rounded-lg bg-muted',
					className,
				)}
				{...props}
			>
				<video
					className="h-full w-full object-cover"
					muted
					preload="metadata"
					src={isSourceDocument(data) ? undefined : data.url}
				/>
			</div>
		)
	}

	return (
		<div
			className={cn(
				variant === 'grid'
					? 'flex aspect-video w-full items-center justify-center bg-muted text-muted-foreground'
					: 'flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground',
				className,
			)}
			{...props}
		>
			{fallbackIcon ?? <MediaFallbackIcon data={data} />}
		</div>
	)
}

type AttachmentInfoProps = HTMLAttributes<HTMLDivElement> & {
	data?: AttachmentData
	showMediaType?: boolean
}

export const AttachmentInfo = ({ className, data, showMediaType = false, ...props }: AttachmentInfoProps) => {
	if (!data) {
		return null
	}
	return (
		<div className={cn('min-w-0', className)} {...props}>
			<p className="truncate text-sm font-medium">{getAttachmentLabel(data)}</p>
			{showMediaType ? <p className="truncate text-xs text-muted-foreground">{data.mediaType}</p> : null}
		</div>
	)
}

type AttachmentRemoveProps = ComponentProps<typeof Button> & {
	onRemove?: () => void
	label?: string
}

export const AttachmentRemove = ({
	className,
	label = 'Remove attachment',
	onRemove,
	...props
}: AttachmentRemoveProps) =>
	onRemove ? (
		<Button
			aria-label={label}
			className={cn(
				'size-7 shrink-0 rounded-full',
				'opacity-100 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100',
				className,
			)}
			onClick={onRemove}
			size="icon-sm"
			type="button"
			variant="ghost"
			{...props}
		>
			<XIcon className="size-4" />
		</Button>
	) : null

type AttachmentHoverCardProps = ComponentProps<typeof HoverCard>

export const AttachmentHoverCard = (props: AttachmentHoverCardProps) => <HoverCard openDelay={0} {...props} />

type AttachmentHoverCardTriggerProps = ComponentProps<typeof HoverCardTrigger>

export const AttachmentHoverCardTrigger = (props: AttachmentHoverCardTriggerProps) => (
	<HoverCardTrigger asChild {...props} />
)

type AttachmentHoverCardContentProps = ComponentProps<typeof HoverCardContent>

export const AttachmentHoverCardContent = ({ className, ...props }: AttachmentHoverCardContentProps) => (
	<HoverCardContent align="start" className={cn('w-80', className)} {...props} />
)

export const AttachmentEmpty = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
	<div
		className={cn('rounded-xl border border-dashed px-3 py-4 text-sm text-muted-foreground', className)}
		{...props}
	/>
)
