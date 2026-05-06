import { ChevronDownIcon, RouteIcon } from 'lucide-react'
import type { ComponentProps, HTMLAttributes } from 'react'
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { cn } from '@/lib/utils'
import { Shimmer } from './shimmer'

const getPlanText = (value: string | undefined, isStreaming: boolean) => {
	if (!value) {
		return null
	}
	return isStreaming ? <Shimmer>{value}</Shimmer> : value
}

export type PlanProps = ComponentProps<typeof Collapsible> & {
	isStreaming?: boolean
}

export const Plan = ({ children, className, isStreaming = false, ...props }: PlanProps) => (
	<Collapsible
		className={cn('rounded-xl border bg-background', className)}
		data-streaming={isStreaming ? 'true' : 'false'}
		{...props}
	>
		<div data-slot="plan">{children}</div>
	</Collapsible>
)

export type PlanHeaderProps = ComponentProps<typeof CardHeader>

export const PlanHeader = ({ className, ...props }: PlanHeaderProps) => (
	<CardHeader className={cn('gap-2 px-4 py-3', className)} {...props} />
)

export type PlanTitleProps = Omit<ComponentProps<typeof CardTitle>, 'children'> & {
	children: string
	isStreaming?: boolean
}

export const PlanTitle = ({ children, className, isStreaming = false, ...props }: PlanTitleProps) => (
	<CardTitle className={cn('text-sm font-medium', className)} {...props}>
		{getPlanText(children, isStreaming)}
	</CardTitle>
)

export type PlanDescriptionProps = Omit<HTMLAttributes<HTMLParagraphElement>, 'children'> & {
	children: string
	isStreaming?: boolean
}

export const PlanDescription = ({ children, className, isStreaming = false, ...props }: PlanDescriptionProps) => (
	<p className={cn('text-muted-foreground text-xs', className)} {...props}>
		{getPlanText(children, isStreaming)}
	</p>
)

export type PlanTriggerProps = ComponentProps<typeof CollapsibleTrigger>

export const PlanTrigger = ({ children, className, ...props }: PlanTriggerProps) => (
	<CollapsibleTrigger
		className={cn(
			'flex w-full items-center justify-between gap-3 border-b px-4 py-3 text-left text-sm font-medium [&[data-state=open]>svg]:rotate-180',
			className,
		)}
		{...props}
	>
		<div className="flex min-w-0 items-center gap-2">
			<RouteIcon className="size-4 text-muted-foreground" />
			<span className="truncate">{children}</span>
		</div>
		<ChevronDownIcon className="size-4 text-muted-foreground transition-transform" />
	</CollapsibleTrigger>
)

export type PlanContentProps = ComponentProps<typeof CardContent>

export const PlanContent = ({ className, ...props }: PlanContentProps) => (
	<CollapsibleContent asChild>
		<CardContent className={cn('px-4 py-3', className)} {...props} />
	</CollapsibleContent>
)

export type PlanFooterProps = HTMLAttributes<HTMLDivElement>

export const PlanFooter = ({ className, ...props }: PlanFooterProps) => (
	<div className={cn('flex items-center justify-between gap-3 border-t px-4 py-3', className)} {...props} />
)

export type PlanActionProps = HTMLAttributes<HTMLDivElement>

export const PlanAction = ({ className, ...props }: PlanActionProps) => (
	<div className={cn('flex items-center gap-2', className)} {...props} />
)
