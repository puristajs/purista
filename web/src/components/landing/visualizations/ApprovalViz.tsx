import {
	addEdge,
	Background,
	BaseEdge,
	type Connection,
	type Edge,
	type EdgeProps,
	getBezierPath,
	Handle,
	type Node,
	type NodeProps,
	Position,
	ReactFlow,
	useEdgesState,
	useNodesState,
} from '@xyflow/react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import '@xyflow/react/dist/style.css'

type Tone = 'con' | 'pilot'

function toneVar(t: Tone, hi = false) {
	return `var(--color-${t}${hi ? '-hi' : ''})`
}
function toneGlow(t: Tone) {
	return `var(--color-${t}-glow)`
}

/* ================================================================
   Nodes
   ================================================================ */

function StageNode({ data }: NodeProps<{ label: string; tone?: Tone; variant?: 'bad' | 'good' }>) {
	const t = data.tone ?? 'con'
	const isGood = data.variant === 'good'
	return (
		<div
			style={{
				padding: '12px 18px',
				borderRadius: 14,
				border: `1.5px solid ${toneVar(t)}`,
				background: `linear-gradient(135deg, color-mix(in srgb, ${toneVar(t)} ${isGood ? 14 : 10}%, var(--color-bg-elev)), var(--color-bg-elev))`,
				color: 'var(--color-fg-strong)',
				fontWeight: 600,
				fontSize: 13,
				minWidth: 150,
				textAlign: 'center',
				boxShadow: `0 6px 24px -10px ${toneGlow(t)}`,
				position: 'relative',
			}}
		>
			<Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
			<Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
			<Handle type="source" position={Position.Left} id="reject" style={{ opacity: 0 }} />
			{/* Status indicator */}
			<div
				style={{
					position: 'absolute',
					top: -3,
					right: -3,
					width: 10,
					height: 10,
					borderRadius: '50%',
					background: toneVar(t, true),
					boxShadow: `0 0 8px 2px ${toneGlow(t)}`,
				}}
			/>
			{data.label}
		</div>
	)
}

function PacketEdge({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data }: EdgeProps) {
	const [edgePath] = getBezierPath({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition })
	const tone = (data?.tone as Tone) ?? 'con'
	const speed = data?.speed ?? 2
	const particles = data?.particles ?? 2
	const label = data?.label as string | undefined

	return (
		<>
			<BaseEdge id={id} path={edgePath} style={{ stroke: 'var(--color-line-strong)', strokeWidth: 1.5 }} />
			<path
				d={edgePath}
				fill="none"
				stroke={toneVar(tone)}
				strokeWidth={2}
				strokeLinecap="round"
				strokeDasharray="4 8"
				opacity={0.3}
			/>
			{Array.from({ length: particles }).map((_, i) => (
				<g key={i}>
					{/* Glow orb */}
					<circle r="10" fill={toneVar(tone)} opacity={0.06}>
						<animateMotion
							begin={`${i * (speed / particles)}s`}
							dur={`${speed}s`}
							repeatCount="indefinite"
							rotate="auto"
							path={edgePath}
							calcMode="spline"
							keySplines="0.42, 0, 0.58, 1.0"
						/>
					</circle>
					{/* Packet */}
					<rect width="34" height="16" rx="5" fill={toneVar(tone)} opacity={0.9}>
						<animateMotion
							begin={`${i * (speed / particles)}s`}
							dur={`${speed}s`}
							repeatCount="indefinite"
							rotate="auto"
							path={edgePath}
							calcMode="spline"
							keySplines="0.42, 0, 0.58, 1.0"
						/>
					</rect>
					<text
						fontSize="8"
						fontFamily="var(--font-mono)"
						fontWeight="600"
						fill="var(--color-bg)"
						textAnchor="middle"
						dy="3"
					>
						<animateMotion
							begin={`${i * (speed / particles)}s`}
							dur={`${speed}s`}
							repeatCount="indefinite"
							rotate="auto"
							path={edgePath}
							calcMode="spline"
							keySplines="0.42, 0, 0.58, 1.0"
						/>
						{label ?? 'PR'}
					</text>
				</g>
			))}
		</>
	)
}

const nodeTypes = { stage: StageNode }
const edgeTypes = { packet: PacketEdge }

/* ================================================================
   Single Flow
   ================================================================ */

function ApprovalFlow({ variant, colorMode }: { variant: 'bad' | 'good'; colorMode: 'dark' | 'light' }) {
	const isGood = variant === 'good'
	const tone = isGood ? 'pilot' : 'con'
	const speed = isGood ? 2 : 5

	const initialNodes: Node[] = useMemo(
		() => [
			{ id: 'start', type: 'stage', position: { x: 80, y: 0 }, data: { label: 'PR opened', tone, variant } },
			{
				id: 's1',
				type: 'stage',
				position: { x: 80, y: 110 },
				data: { label: isGood ? 'Contract review' : 'Code review', tone, variant },
			},
			{
				id: 's2',
				type: 'stage',
				position: { x: 80, y: 220 },
				data: { label: isGood ? 'Verification' : 'Security ask', tone, variant },
			},
			{
				id: 's3',
				type: 'stage',
				position: { x: 80, y: 330 },
				data: { label: isGood ? 'Auditable trail' : 'Compliance ask', tone, variant },
			},
			{
				id: 'end',
				type: 'stage',
				position: { x: 80, y: 440 },
				data: { label: isGood ? 'Ship' : 'Stuck', tone, variant },
			},
		],
		[isGood, tone, variant],
	)

	const initialEdges: Edge[] = useMemo(
		() => [
			{ id: 'e1', source: 'start', target: 's1', type: 'packet', data: { tone, speed, particles: isGood ? 3 : 1 } },
			{ id: 'e2', source: 's1', target: 's2', type: 'packet', data: { tone, speed, particles: isGood ? 3 : 1 } },
			{ id: 'e3', source: 's2', target: 's3', type: 'packet', data: { tone, speed, particles: isGood ? 3 : 1 } },
			{ id: 'e4', source: 's3', target: 'end', type: 'packet', data: { tone, speed, particles: isGood ? 3 : 1 } },
			// Reject/feedback loops
			...(isGood
				? [
						{
							id: 'fb1',
							source: 's1',
							target: 'start',
							type: 'packet',
							data: { tone, speed: speed * 1.5, particles: 1, label: 'OK' },
						},
						{
							id: 'fb2',
							source: 's3',
							target: 's1',
							type: 'packet',
							data: { tone, speed: speed * 1.5, particles: 1, label: 'PASS' },
						},
					]
				: [
						{
							id: 'rej1',
							source: 's1',
							target: 'start',
							sourceHandle: 'reject',
							type: 'packet',
							data: { tone, speed: speed * 0.8, particles: 1, label: 'REJ' },
						},
						{
							id: 'rej2',
							source: 's2',
							target: 's1',
							sourceHandle: 'reject',
							type: 'packet',
							data: { tone, speed: speed * 0.8, particles: 1, label: 'ASK' },
						},
						{
							id: 'rej3',
							source: 's3',
							target: 's2',
							sourceHandle: 'reject',
							type: 'packet',
							data: { tone, speed: speed * 0.8, particles: 1, label: 'ASK' },
						},
					]),
		],
		[tone, speed, isGood],
	)

	const [nodes, , onNodesChange] = useNodesState(initialNodes)
	const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
	const onConnect = useCallback((params: Connection) => setEdges(eds => addEdge(params, eds)), [setEdges])

	return (
		<div style={{ width: '100%', height: 520 }}>
			<ReactFlow
				nodes={nodes}
				edges={edges}
				onNodesChange={onNodesChange}
				onEdgesChange={onEdgesChange}
				onConnect={onConnect}
				nodeTypes={nodeTypes}
				edgeTypes={edgeTypes}
				colorMode={colorMode}
				fitView
				fitViewOptions={{ padding: 0.2 }}
				nodesDraggable={false}
				nodesConnectable={false}
				elementsSelectable={false}
				panOnDrag={false}
				zoomOnScroll={false}
				zoomOnPinch={false}
				zoomOnDoubleClick={false}
				proOptions={{ hideAttribution: true }}
			>
				<Background gap={40} size={1} color="var(--color-line)" />
			</ReactFlow>
		</div>
	)
}

/* ================================================================
   Dual comparison wrapper
   ================================================================ */

export default function ApprovalViz() {
	const [colorMode, setColorMode] = useState<'dark' | 'light'>(() =>
		typeof document !== 'undefined' && document.documentElement.dataset.theme === 'light' ? 'light' : 'dark',
	)

	useEffect(() => {
		const onChange = (e: Event) => {
			const theme = (e as CustomEvent).detail?.theme
			if (theme === 'light' || theme === 'dark') setColorMode(theme)
		}
		window.addEventListener('purista-theme-change', onChange)
		return () => window.removeEventListener('purista-theme-change', onChange)
	}, [])

	return (
		<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
			<div className="site-viz-container" style={{ position: 'relative' }}>
				<div
					style={{
						position: 'absolute',
						top: 14,
						left: 14,
						zIndex: 5,
						fontFamily: 'var(--font-mono)',
						fontSize: '0.72rem',
						letterSpacing: '0.18em',
						textTransform: 'uppercase',
						color: 'var(--color-con-hi)',
						padding: '0.3rem 0.7rem',
						borderRadius: 999,
						border: '1px solid var(--color-line)',
						background: 'color-mix(in srgb, var(--color-bg-elev) 70%, transparent)',
					}}
				>
					Without PURISTA
				</div>
				<ApprovalFlow variant="bad" colorMode={colorMode} />
			</div>
			<div className="site-viz-container" style={{ position: 'relative' }}>
				<div
					style={{
						position: 'absolute',
						top: 14,
						left: 14,
						zIndex: 5,
						fontFamily: 'var(--font-mono)',
						fontSize: '0.72rem',
						letterSpacing: '0.18em',
						textTransform: 'uppercase',
						color: 'var(--color-pilot-hi)',
						padding: '0.3rem 0.7rem',
						borderRadius: 999,
						border: '1px solid var(--color-line)',
						background: 'color-mix(in srgb, var(--color-bg-elev) 70%, transparent)',
					}}
				>
					With PURISTA
				</div>
				<ApprovalFlow variant="good" colorMode={colorMode} />
			</div>
		</div>
	)
}
