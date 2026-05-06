import { CheckCircle2Icon, ChevronDownIcon, CircleDashedIcon, TriangleAlertIcon } from 'lucide-react'
import type { ComponentProps, HTMLAttributes, ReactNode } from 'react'
import { Badge } from '@/components/ui/badge'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/lib/utils'

const getTaskIcon = (status: string) => {
	if (status === 'completed') {
		return <CheckCircle2Icon className="size-4 text-primary" />
	}
	if (status === 'failed' || status === 'cancelled') {
		return <TriangleAlertIcon className="size-4 text-destructive" />
	}
	if (status === 'running') {
		return <Spinner className="size-4 text-primary" />
	}
	return <CircleDashedIcon className="size-4 text-muted-foreground" />
}

export type TaskProps = ComponentProps<typeof Collapsible>

export const Task = ({ className, ...props }: TaskProps) => (
	<Collapsible className={cn('rounded-lg border border-border/60 bg-muted/20', className)} {...props} />
)

export type TaskTriggerProps = ComponentProps<typeof CollapsibleTrigger> & {
	title: string
	status: string
	badge?: ReactNode
}

export const TaskTrigger = ({ badge, className, status, title, ...props }: TaskTriggerProps) => (
	<CollapsibleTrigger
		className={cn(
			'flex w-full items-center justify-between gap-3 px-4 py-3 text-left [&[data-state=open]>svg]:rotate-180',
			className,
		)}
		data-status={status}
		{...props}
	>
		<div className="flex min-w-0 items-center gap-3">
			{getTaskIcon(status)}
			<div className="min-w-0">
				<p className="truncate text-sm font-medium">{title}</p>
				<p className="text-muted-foreground text-xs">{status}</p>
			</div>
		</div>
		<div className="flex items-center gap-2">
			{badge}
			<ChevronDownIcon className="size-4 text-muted-foreground transition-transform" />
		</div>
	</CollapsibleTrigger>
)

export type TaskContentProps = ComponentProps<typeof CollapsibleContent>

export const TaskContent = ({ className, ...props }: TaskContentProps) => (
	<CollapsibleContent className={cn('border-t border-border/50 px-4 py-3', className)} {...props} />
)

export type TaskItemProps = HTMLAttributes<HTMLDivElement> & {
	status?: string
}

export const TaskItem = ({ children, className, status = 'outline', ...props }: TaskItemProps) => (
	<div className={cn('flex items-start gap-3 rounded-md bg-background px-3 py-2', className)} {...props}>
		<Badge className="shrink-0" variant="outline">
			{status}
		</Badge>
		<div className="min-w-0 text-sm">{children}</div>
	</div>
)

export type TaskItemFileProps = HTMLAttributes<HTMLDivElement>

export const TaskItemFile = ({ className, ...props }: TaskItemFileProps) => (
	<span
		className={cn('inline-flex items-center gap-1 rounded-md border bg-background px-2 py-0.5 text-xs', className)}
		{...props}
	/>
)
