import { BotIcon, BracesIcon, WrenchIcon } from 'lucide-react'
import type { ComponentProps, HTMLAttributes, ReactNode } from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export type AgentProps = HTMLAttributes<HTMLDivElement>

export const Agent = ({ className, ...props }: AgentProps) => (
	<div className={cn('rounded-xl border bg-background', className)} {...props} />
)

export type AgentHeaderProps = HTMLAttributes<HTMLDivElement> & {
	name: string
	model?: string
}

export const AgentHeader = ({ className, model, name, ...props }: AgentHeaderProps) => (
	<div className={cn('flex items-start justify-between gap-3 border-b px-4 py-3', className)} {...props}>
		<div className="flex min-w-0 items-start gap-3">
			<div className="rounded-lg border bg-muted/40 p-2 text-muted-foreground">
				<BotIcon className="size-4" />
			</div>
			<div className="min-w-0">
				<p className="truncate text-sm font-medium">{name}</p>
				<p className="text-xs text-muted-foreground">Active attached agent runtime</p>
			</div>
		</div>
		{model ? <Badge variant="outline">{model}</Badge> : null}
	</div>
)

export type AgentContentProps = HTMLAttributes<HTMLDivElement>

export const AgentContent = ({ className, ...props }: AgentContentProps) => (
	<div className={cn('flex flex-col gap-4 px-4 py-3', className)} {...props} />
)

export type AgentInstructionsProps = HTMLAttributes<HTMLDivElement>

export const AgentInstructions = ({ className, ...props }: AgentInstructionsProps) => (
	<div className={cn('rounded-lg border bg-muted/20 px-3 py-3', className)} {...props} />
)

export type AgentToolsProps = {
	children: ReactNode
	className?: string
	defaultValue?: string
	value?: string
	onValueChange?: (value: string) => void
}

export const AgentTools = ({ children, className, defaultValue, onValueChange, value }: AgentToolsProps) => (
	<Accordion
		className={cn('w-full', className)}
		collapsible
		defaultValue={defaultValue}
		onValueChange={onValueChange}
		type="single"
		value={value}
	>
		{children}
	</Accordion>
)

export type AgentToolProps = ComponentProps<typeof AccordionItem> & {
	name: string
	description: string
	inputSchema?: string
	kind?: 'tool' | 'delegate'
}

export const AgentTool = ({
	className,
	description,
	inputSchema,
	kind = 'tool',
	name,
	value,
	...props
}: AgentToolProps) => (
	<AccordionItem className={cn('rounded-lg border px-3', className)} value={value ?? name} {...props}>
		<AccordionTrigger className="gap-3 py-3 hover:no-underline">
			<div className="flex min-w-0 items-start gap-3 text-left">
				<div className="rounded-lg border bg-muted/40 p-2 text-muted-foreground">
					<WrenchIcon className="size-4" />
				</div>
				<div className="min-w-0">
					<div className="flex flex-wrap items-center gap-2">
						<p className="truncate text-sm font-medium">{name}</p>
						<Badge variant="outline">{kind}</Badge>
					</div>
					<p className="mt-1 text-xs text-muted-foreground">{description}</p>
				</div>
			</div>
		</AccordionTrigger>
		<AccordionContent className="pb-3 pt-0">
			{inputSchema ? (
				<pre className="overflow-x-auto rounded-lg bg-muted/50 p-3 text-xs">{inputSchema}</pre>
			) : (
				<p className="text-sm text-muted-foreground">No structured input schema documented for this callable.</p>
			)}
		</AccordionContent>
	</AccordionItem>
)

export type AgentOutputProps = HTMLAttributes<HTMLDivElement> & {
	schema: string
}

export const AgentOutput = ({ className, schema, ...props }: AgentOutputProps) => (
	<div className={cn('rounded-lg border bg-muted/20 px-3 py-3', className)} {...props}>
		<div className="mb-2 flex items-center gap-2">
			<BracesIcon className="size-4 text-muted-foreground" />
			<p className="text-sm font-medium">Output contract</p>
		</div>
		<pre className="overflow-x-auto text-xs">{schema}</pre>
	</div>
)
