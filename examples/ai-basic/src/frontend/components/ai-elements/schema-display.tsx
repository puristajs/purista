import type { HTMLAttributes } from 'react'
import { Badge } from '@/components/ui/badge'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { cn } from '@/lib/utils'

export type SchemaParameter = {
	name: string
	type: string
	required?: boolean
	description?: string
	location?: 'path' | 'query' | 'header'
}

export type SchemaProperty = {
	name: string
	type: string
	required?: boolean
	description?: string
	properties?: SchemaProperty[]
	items?: SchemaProperty
}

const methodVariant = (method: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
	switch (method) {
		case 'GET':
			return 'default'
		case 'POST':
			return 'secondary'
		case 'DELETE':
			return 'destructive'
		default:
			return 'outline'
	}
}

const PropertyTree = ({ property }: { property: SchemaProperty }) => (
	<div className="rounded-md border bg-muted/20 px-3 py-2">
		<div className="flex flex-wrap items-center gap-2">
			<span className="text-sm font-medium">{property.name}</span>
			<Badge variant="outline">{property.type}</Badge>
			{property.required ? <Badge variant="secondary">required</Badge> : null}
		</div>
		{property.description ? <p className="text-muted-foreground mt-1 text-xs">{property.description}</p> : null}
		{property.properties?.length ? (
			<div className="mt-2 flex flex-col gap-2">
				{property.properties.map(child => (
					<PropertyTree key={`${property.name}-${child.name}`} property={child} />
				))}
			</div>
		) : null}
		{property.items ? (
			<div className="mt-2">
				<PropertyTree property={{ ...property.items, name: `${property.name}[]` }} />
			</div>
		) : null}
	</div>
)

export type SchemaDisplayProps = HTMLAttributes<HTMLDivElement> & {
	method: string
	path: string
	description?: string
	parameters?: SchemaParameter[]
	requestBody?: SchemaProperty[]
	responseBody?: SchemaProperty[]
}

export const SchemaDisplay = ({
	className,
	description,
	method,
	parameters = [],
	path,
	requestBody = [],
	responseBody = [],
	...props
}: SchemaDisplayProps) => (
	<div className={cn('rounded-xl border bg-background', className)} {...props}>
		<div className="border-b px-4 py-3">
			<div className="flex flex-wrap items-center gap-2">
				<Badge variant={methodVariant(method)}>{method}</Badge>
				<code className="text-sm">{path}</code>
			</div>
			{description ? <p className="text-muted-foreground mt-2 text-sm">{description}</p> : null}
		</div>
		<div className="flex flex-col gap-3 px-4 py-3">
			{parameters.length > 0 ? (
				<Collapsible defaultOpen>
					<CollapsibleTrigger className="text-left text-sm font-medium">Parameters</CollapsibleTrigger>
					<CollapsibleContent className="mt-2 flex flex-col gap-2">
						{parameters.map(parameter => (
							<div
								className="rounded-md border bg-muted/20 px-3 py-2"
								key={`${parameter.location ?? 'query'}-${parameter.name}`}
							>
								<div className="flex flex-wrap items-center gap-2">
									<span className="text-sm font-medium">{parameter.name}</span>
									<Badge variant="outline">{parameter.type}</Badge>
									<Badge variant="outline">{parameter.location ?? 'query'}</Badge>
									{parameter.required ? <Badge variant="secondary">required</Badge> : null}
								</div>
								{parameter.description ? (
									<p className="text-muted-foreground mt-1 text-xs">{parameter.description}</p>
								) : null}
							</div>
						))}
					</CollapsibleContent>
				</Collapsible>
			) : null}
			{requestBody.length > 0 ? (
				<Collapsible defaultOpen>
					<CollapsibleTrigger className="text-left text-sm font-medium">Request body</CollapsibleTrigger>
					<CollapsibleContent className="mt-2 flex flex-col gap-2">
						{requestBody.map(property => (
							<PropertyTree key={`request-${property.name}`} property={property} />
						))}
					</CollapsibleContent>
				</Collapsible>
			) : null}
			{responseBody.length > 0 ? (
				<Collapsible defaultOpen>
					<CollapsibleTrigger className="text-left text-sm font-medium">Response body</CollapsibleTrigger>
					<CollapsibleContent className="mt-2 flex flex-col gap-2">
						{responseBody.map(property => (
							<PropertyTree key={`response-${property.name}`} property={property} />
						))}
					</CollapsibleContent>
				</Collapsible>
			) : null}
		</div>
	</div>
)
