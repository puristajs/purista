import { CheckCircle2Icon, CircleDashedIcon, HammerIcon, TriangleAlertIcon } from 'lucide-react'
import type { ComponentProps, ReactNode } from 'react'
import { Badge } from '@/components/ui/badge'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Separator } from '@/components/ui/separator'
import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/lib/utils'

export type ToolProps = ComponentProps<typeof Collapsible>

export const Tool = ({ className, ...props }: ToolProps) => (
	<Collapsible className={cn('rounded-lg border border-border/60 bg-muted/20', className)} {...props} />
)

const getToolStateIcon = (state: string) => {
	if (state === 'output-available' || state === 'completed') {
		return <CheckCircle2Icon className="size-4 text-primary" />
	}
	if (state === 'output-error' || state === 'failed' || state === 'error') {
		return <TriangleAlertIcon className="size-4 text-destructive" />
	}
	if (state === 'invoked' || state === 'input-streaming' || state === 'running') {
		return <Spinner className="size-4" />
	}
	return <CircleDashedIcon className="size-4 text-muted-foreground" />
}

const getToolLabel = (type: string) => type.replace(/^tool-/, '').replaceAll('-', ' ')

export type ToolHeaderProps = ComponentProps<typeof CollapsibleTrigger> & {
	toolType: string
	state: string
}

export const ToolHeader = ({ className, state, toolType, ...props }: ToolHeaderProps) => (
	<CollapsibleTrigger
		className={cn('flex w-full items-center justify-between gap-3 px-4 py-3 text-left', className)}
		{...props}
	>
		<div className="flex min-w-0 items-center gap-3">
			{getToolStateIcon(state)}
			<div className="min-w-0">
				<p className="truncate text-sm font-medium">{getToolLabel(toolType)}</p>
				<p className="text-muted-foreground text-xs">Tool invocation</p>
			</div>
		</div>
		<Badge variant="outline">{state}</Badge>
	</CollapsibleTrigger>
)

export type ToolContentProps = ComponentProps<typeof CollapsibleContent>

export const ToolContent = ({ className, ...props }: ToolContentProps) => (
	<CollapsibleContent className={cn('border-t border-border/50', className)} {...props} />
)

export const ToolInput = ({ input }: { input?: unknown }) => (
	<div className="px-4 py-3">
		<p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Input</p>
		<pre className="overflow-x-auto rounded-lg bg-muted/50 p-3 text-xs">{JSON.stringify(input ?? null, null, 2)}</pre>
	</div>
)

export const ToolOutput = ({ errorText, output }: { output?: ReactNode; errorText?: string }) => (
	<div className="px-4 py-3">
		<Separator className="mb-3" />
		<p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
			{errorText ? 'Error' : 'Output'}
		</p>
		{errorText ? (
			<div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
				{errorText}
			</div>
		) : (
			<div className="rounded-md bg-background p-3 text-sm">
				{output ?? <span className="text-muted-foreground">No output available.</span>}
			</div>
		)}
	</div>
)

export const ToolPlaceholder = ({ text }: { text: string }) => (
	<div className="flex items-center gap-2 rounded-xl border border-dashed px-4 py-3 text-sm text-muted-foreground">
		<HammerIcon className="size-4" />
		<span>{text}</span>
	</div>
)
