'use client'

import * as React from 'react'
import * as RechartsPrimitive from 'recharts'
import { cn } from '@/lib/utils'

export type ChartConfig = Record<
	string,
	{
		label?: React.ReactNode
		color?: string
	}
>

type ChartContextProps = {
	config: ChartConfig
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

const useChart = () => {
	const context = React.useContext(ChartContext)
	if (!context) {
		throw new Error('useChart must be used within a <ChartContainer />')
	}
	return context
}

export const ChartContainer = ({
	className,
	children,
	config,
	...props
}: React.ComponentProps<'div'> & {
	config: ChartConfig
	children: React.ReactElement
}) => {
	const containerRef = React.useRef<HTMLDivElement | null>(null)
	const [size, setSize] = React.useState({ width: 0, height: 0 })
	const chartChild = children as React.ReactElement<{ width?: number; height?: number }>

	React.useEffect(() => {
		const element = containerRef.current
		if (!element) {
			return
		}

		const update = () => {
			const nextWidth = element.clientWidth
			const nextHeight = element.clientHeight
			setSize(previous =>
				previous.width === nextWidth && previous.height === nextHeight
					? previous
					: { width: nextWidth, height: nextHeight },
			)
		}

		update()

		const observer = new ResizeObserver(() => update())
		observer.observe(element)

		return () => observer.disconnect()
	}, [])

	return (
		<ChartContext.Provider value={{ config }}>
			<div
				className={cn(
					'flex h-[220px] min-h-[220px] min-w-0 w-full justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line]:stroke-border/60 [&_.recharts-layer]:outline-hidden [&_.recharts-surface]:outline-hidden',
					className,
				)}
				data-slot="chart"
				ref={containerRef}
				{...props}
			>
				{size.width > 0 && size.height > 0
					? React.cloneElement(chartChild, {
							height: size.height,
							width: size.width,
						})
					: null}
			</div>
		</ChartContext.Provider>
	)
}

export const ChartTooltip = RechartsPrimitive.Tooltip

export const ChartTooltipContent = ({
	active,
	payload,
	className,
	hideLabel = false,
	labelFormatter,
	formatter,
}: React.ComponentProps<'div'> &
	React.ComponentProps<typeof RechartsPrimitive.Tooltip> & {
		hideLabel?: boolean
		labelFormatter?: (label: string | number | undefined) => React.ReactNode
	}) => {
	const { config } = useChart()

	if (!active || !payload?.length) {
		return null
	}

	const label = payload[0]?.payload?.label as string | undefined

	return (
		<div
			className={cn('grid min-w-40 gap-2 rounded-xl border bg-background/95 px-3 py-2 text-sm shadow-none', className)}
		>
			{!hideLabel ? (
				<div className="font-medium text-foreground">{labelFormatter ? labelFormatter(label) : label}</div>
			) : null}
			<div className="grid gap-1.5">
				{payload.map((item: NonNullable<typeof payload>[number], index: number) => {
					const key = String(item.dataKey ?? item.name ?? index)
					const series = config[key]
					return (
						<div className="flex items-center justify-between gap-3" key={key}>
							<div className="flex items-center gap-2 text-muted-foreground">
								<div className="size-2 rounded-full" style={{ backgroundColor: item.color ?? series?.color }} />
								<span>{series?.label ?? item.name}</span>
							</div>
							<span className="font-medium tabular-nums text-foreground">
								{formatter && item.value !== undefined
									? formatter(item.value, item.name ?? key, item, index, item.payload)
									: `${item.value ?? ''}`}
							</span>
						</div>
					)
				})}
			</div>
		</div>
	)
}
