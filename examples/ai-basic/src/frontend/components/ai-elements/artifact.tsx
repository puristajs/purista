import { XIcon } from 'lucide-react'
import type { ComponentProps, HTMLAttributes } from 'react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

export type ArtifactProps = HTMLAttributes<HTMLDivElement>

export const Artifact = ({ className, ...props }: ArtifactProps) => (
	<div className={cn('rounded-xl border bg-background', className)} {...props} />
)

export type ArtifactHeaderProps = HTMLAttributes<HTMLDivElement>

export const ArtifactHeader = ({ className, ...props }: ArtifactHeaderProps) => (
	<div className={cn('flex items-start justify-between gap-3 border-b px-4 py-3', className)} {...props} />
)

export type ArtifactTitleProps = HTMLAttributes<HTMLParagraphElement>

export const ArtifactTitle = ({ className, ...props }: ArtifactTitleProps) => (
	<p className={cn('text-sm font-medium', className)} {...props} />
)

export type ArtifactDescriptionProps = HTMLAttributes<HTMLParagraphElement>

export const ArtifactDescription = ({ className, ...props }: ArtifactDescriptionProps) => (
	<p className={cn('text-muted-foreground mt-1 text-xs', className)} {...props} />
)

export type ArtifactActionsProps = HTMLAttributes<HTMLDivElement>

export const ArtifactActions = ({ className, ...props }: ArtifactActionsProps) => (
	<div className={cn('flex items-center gap-2', className)} {...props} />
)

export type ArtifactActionProps = ComponentProps<typeof Button> & {
	tooltip?: string
	label?: string
}

export const ArtifactAction = ({ tooltip, label, className, children, ...props }: ArtifactActionProps) => {
	const button = (
		<Button
			aria-label={label}
			className={cn('size-8', className)}
			size="icon-sm"
			type="button"
			variant="ghost"
			{...props}
		>
			{children}
		</Button>
	)

	if (!tooltip) {
		return button
	}

	return (
		<Tooltip>
			<TooltipTrigger asChild>{button}</TooltipTrigger>
			<TooltipContent>{tooltip}</TooltipContent>
		</Tooltip>
	)
}

export type ArtifactCloseProps = ComponentProps<typeof Button>

export const ArtifactClose = ({ className, ...props }: ArtifactCloseProps) => (
	<Button
		aria-label="Close artifact"
		className={cn('size-8', className)}
		size="icon-sm"
		type="button"
		variant="ghost"
		{...props}
	>
		<XIcon />
	</Button>
)

export type ArtifactContentProps = HTMLAttributes<HTMLDivElement>

export const ArtifactContent = ({ className, ...props }: ArtifactContentProps) => (
	<div className={cn('px-4 py-3', className)} {...props} />
)
