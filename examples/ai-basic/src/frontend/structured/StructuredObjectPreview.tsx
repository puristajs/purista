import { defineCatalog } from '@json-render/core'
import { ActionProvider, defineRegistry, Renderer, StateProvider, schema, VisibilityProvider } from '@json-render/react'
import { shadcnComponentDefinitions, shadcnComponents } from '@json-render/shadcn'
import { AlertTriangleIcon } from 'lucide-react'
import { Component, type ReactNode } from 'react'
import { Bar, BarChart, CartesianGrid, Cell, LabelList, XAxis, YAxis } from 'recharts'
import { Badge } from '@/components/ui/badge'
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

const catalog = defineCatalog(schema, {
	components: {
		Heading: shadcnComponentDefinitions.Heading,
		Stack: shadcnComponentDefinitions.Stack,
		Text: shadcnComponentDefinitions.Text,
	},
	actions: {},
})

const { registry } = defineRegistry(catalog, {
	components: {
		Heading: shadcnComponents.Heading,
		Stack: shadcnComponents.Stack,
		Text: shadcnComponents.Text,
	},
})

type JsonValue = boolean | number | string | null | JsonValue[] | { [key: string]: JsonValue }

type StructuredPreviewValue = Partial<{
	overallVerdict: string
	scorecard: {
		readinessScore: number
		riskScore: number
		confidenceScore: number
	}
	dimensionScores: {
		scalability: number
		reliability: number
		operability: number
		security: number
	}
	executiveSummary: string
	strengths: string[]
	risks: string[]
	nextActions: string[]
}>

class StructuredPreviewErrorBoundary extends Component<
	{ children: ReactNode },
	{ hasError: boolean; message: string }
> {
	state = { hasError: false, message: '' }

	static getDerivedStateFromError(error: unknown) {
		return {
			hasError: true,
			message: error instanceof Error ? error.message : 'Structured preview failed to render.',
		}
	}

	override render() {
		if (this.state.hasError) {
			return (
				<div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
					<div className="flex items-start gap-3">
						<AlertTriangleIcon className="mt-0.5 size-4 shrink-0" />
						<div className="space-y-1">
							<p className="font-medium">Structured preview unavailable</p>
							<p>{this.state.message}</p>
						</div>
					</div>
				</div>
			)
		}

		return this.props.children
	}
}

const toLabel = (value: string) =>
	value
		.replace(/([a-z0-9])([A-Z])/g, '$1 $2')
		.replace(/[-_]/g, ' ')
		.replace(/\b\w/g, char => char.toUpperCase())

const verdictVariant = (value?: string): 'default' | 'secondary' | 'destructive' => {
	if (value === 'ready') {
		return 'default'
	}
	if (value === 'risky') {
		return 'destructive'
	}
	return 'secondary'
}

const buildNarrativeSpec = (value: StructuredPreviewValue) => {
	const sections = [
		['executiveSummary', value.executiveSummary] as const,
		['strengths', value.strengths] as const,
		['risks', value.risks] as const,
		['nextActions', value.nextActions] as const,
	].filter(([, entry]) => entry !== undefined && entry !== null)

	const elements: Record<string, { type: string; props: Record<string, unknown>; children?: string[] }> = {
		root: {
			type: 'Stack',
			props: {
				className: 'divide-y divide-border/60',
				direction: 'vertical',
				gap: 'none',
			},
			children: sections.map(([key]) => `section-${key}`),
		},
	}

	for (const [key, entry] of sections) {
		elements[`section-${key}`] = {
			type: 'Stack',
			props: {
				className: 'px-4 py-4',
				direction: 'vertical',
				gap: 'sm',
			},
			children: [`title-${key}`, Array.isArray(entry) ? `list-${key}` : `text-${key}`],
		}
		elements[`title-${key}`] = {
			type: 'Text',
			props: {
				className:
					key === 'executiveSummary'
						? 'text-sm font-semibold tracking-[0.04em] text-foreground'
						: 'text-[11px] font-semibold tracking-[0.18em] uppercase text-muted-foreground',
				text: toLabel(key),
				variant: 'body',
			},
		}
		if (Array.isArray(entry)) {
			elements[`list-${key}`] = {
				type: 'Stack',
				props: {
					direction: 'vertical',
					gap: 'sm',
				},
				children: entry.map((_, index) => `list-item-${key}-${index}`),
			}
			for (const [index, item] of entry.entries()) {
				elements[`list-item-${key}-${index}`] = {
					type: 'Text',
					props: {
						className: 'text-sm leading-7 text-foreground/88',
						text: `• ${item}`,
						variant: 'body',
					},
				}
			}
		} else {
			elements[`text-${key}`] = {
				type: 'Text',
				props: {
					className:
						key === 'executiveSummary'
							? 'max-w-3xl text-[15px] font-medium leading-7 text-foreground'
							: 'text-sm leading-7 text-foreground/88',
					text: entry,
					variant: 'body',
				},
			}
		}
	}

	return {
		root: 'root',
		elements,
	}
}

const chartConfig = {
	score: {
		label: 'Readiness',
		color: 'hsl(var(--chart-2))',
	},
} satisfies ChartConfig

const metricTone = (value: number, inverse = false) => {
	if (inverse) {
		return value >= 70 ? 'text-destructive' : value >= 45 ? 'text-foreground' : 'text-primary'
	}
	return value >= 75 ? 'text-primary' : value >= 50 ? 'text-foreground' : 'text-destructive'
}

const StructuredScoreChart = ({
	scorecard,
	dimensions,
}: {
	scorecard?: StructuredPreviewValue['scorecard']
	dimensions?: StructuredPreviewValue['dimensionScores']
}) => {
	if (!scorecard && !dimensions) {
		return null
	}

	const dimensionData = dimensions
		? Object.entries(dimensions).map(([label, score]) => ({
				label: toLabel(label),
				score,
				fill:
					label === 'security'
						? 'hsl(var(--chart-3))'
						: label === 'operability'
							? 'hsl(var(--chart-4))'
							: label === 'reliability'
								? 'hsl(var(--chart-2))'
								: 'hsl(var(--chart-1))',
			}))
		: []

	return (
		<div className="border-border/60 border-b px-4 py-4">
			{scorecard ? (
				<div className="grid gap-4 sm:grid-cols-3">
					<div className="flex flex-col gap-1">
						<span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-muted-foreground">
							Readiness
						</span>
						<span className={`text-2xl font-semibold tabular-nums ${metricTone(scorecard.readinessScore)}`}>
							{scorecard.readinessScore}
						</span>
					</div>
					<div className="flex flex-col gap-1">
						<span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-muted-foreground">Risk</span>
						<span className={`text-2xl font-semibold tabular-nums ${metricTone(scorecard.riskScore, true)}`}>
							{scorecard.riskScore}
						</span>
					</div>
					<div className="flex flex-col gap-1">
						<span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-muted-foreground">
							Confidence
						</span>
						<span className={`text-2xl font-semibold tabular-nums ${metricTone(scorecard.confidenceScore)}`}>
							{scorecard.confidenceScore}
						</span>
					</div>
				</div>
			) : null}
			{dimensionData.length > 0 ? (
				<div className="mt-5">
					<div className="mb-3 flex items-center justify-between gap-3">
						<p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-muted-foreground">
							Dimension Scores
						</p>
						<p className="text-muted-foreground text-xs">0-100 readiness scale</p>
					</div>
					<ChartContainer className="min-h-[220px] w-full" config={chartConfig}>
						<BarChart accessibilityLayer data={dimensionData} layout="vertical" margin={{ left: 12, right: 16 }}>
							<CartesianGrid horizontal={false} strokeDasharray="3 3" />
							<XAxis domain={[0, 100]} hide type="number" />
							<YAxis axisLine={false} dataKey="label" tickLine={false} type="category" width={88} />
							<ChartTooltip
								content={<ChartTooltipContent formatter={(value: unknown) => `${value}/100`} hideLabel />}
								cursor={false}
							/>
							<Bar dataKey="score" radius={9999}>
								<LabelList className="fill-foreground text-xs font-medium" dataKey="score" position="right" />
								{dimensionData.map(item => (
									<Cell fill={item.fill} key={item.label} />
								))}
							</Bar>
						</BarChart>
					</ChartContainer>
				</div>
			) : null}
		</div>
	)
}

/**
 * Renders canonical structured output with json-render for the narrative sections and
 * a compact chart view for the numeric review dimensions.
 */
export const StructuredObjectPreview = ({ title, value }: { title: string; value: JsonValue }) => {
	const structuredValue = value as StructuredPreviewValue

	return (
		<StructuredPreviewErrorBoundary>
			<div className="overflow-hidden rounded-[1.25rem] border border-border/70 bg-background/70">
				<div className="flex flex-wrap items-start justify-between gap-3 border-border/60 border-b px-4 py-4">
					<div className="space-y-1">
						<h3 className="text-base font-semibold tracking-tight text-foreground">{title}</h3>
						<p className="max-w-2xl text-muted-foreground text-sm leading-6">
							Validated architecture review rendered from structured agent output.
						</p>
					</div>
					{structuredValue.overallVerdict ? (
						<Badge
							className="rounded-full px-3 py-1 text-xs font-medium capitalize"
							variant={verdictVariant(structuredValue.overallVerdict)}
						>
							{structuredValue.overallVerdict}
						</Badge>
					) : null}
				</div>

				<StructuredScoreChart dimensions={structuredValue.dimensionScores} scorecard={structuredValue.scorecard} />

				<StateProvider initialState={{}}>
					<ActionProvider handlers={{}}>
						<VisibilityProvider>
							<Renderer registry={registry} spec={buildNarrativeSpec(structuredValue)} />
						</VisibilityProvider>
					</ActionProvider>
				</StateProvider>
			</div>
		</StructuredPreviewErrorBoundary>
	)
}
