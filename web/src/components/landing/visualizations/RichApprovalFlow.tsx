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

type Tone = 'con' | 'pilot' | 'found'

function tv(t: Tone, hi = false) {
	return `var(--color-${t}${hi ? '-hi' : ''})`
}
function tg(t: Tone) {
	return `var(--color-${t}-glow)`
}

/* ================================================================
   Nodes
   ================================================================ */

function GateNode({ data }: NodeProps<{ label: string; sub?: string; tone?: Tone; status?: 'blocked' | 'pass' }>) {
	const t = data.tone ?? 'con'
	const isBlocked = data.status === 'blocked'
	return (
		<div style={{ position: 'relative' }}>
			<Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
			<Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
			<div
				style={{
					padding: '14px 20px',
					borderRadius: 14,
					border: `1.5px solid ${isBlocked ? tv('con') : tv(t)}`,
					background: `linear-gradient(135deg, color-mix(in srgb, ${isBlocked ? tv('con') : tv(t)} 12%, var(--color-bg-elev)), var(--color-bg-elev))`,
					minWidth: 170,
					textAlign: 'center',
					boxShadow: isBlocked ? `0 8px 28px -10px ${tg('con')}` : `0 8px 28px -10px ${tg(t)}`,
					position: 'relative',
					overflow: 'hidden',
				}}
			>
				{isBlocked && (
					<span
						style={{
							position: 'absolute',
							top: 6,
							right: 6,
							width: 7,
							height: 7,
							borderRadius: '50%',
							background: 'var(--color-con)',
							boxShadow: '0 0 8px var(--color-con)',
							animation: 'statusBlink 1.2s ease-in-out infinite',
						}}
					/>
				)}
				<div style={{ fontWeight: 700, fontSize: 13, color: 'var(--color-fg-strong)' }}>{data.label}</div>
				{data.sub && (
					<div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--color-fg-muted)', marginTop: 3 }}>
						{data.sub}
					</div>
				)}
			</div>
		</div>
	)
}

function PacketEdge({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data }: EdgeProps) {
	const [edgePath] = getBezierPath({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition })
	const tone = (data?.tone as Tone) ?? 'con'
	const speed = data?.speed ?? 2
	const isBlocked = data?.blocked
	const particles = data?.particles ?? 2
	const label = data?.label as string | undefined

	return (
		<g>
			<BaseEdge
				id={id}
				path={edgePath}
				style={{
					stroke: isBlocked ? 'var(--color-con)' : 'var(--color-line-strong)',
					strokeWidth: 1.5,
					strokeDasharray: isBlocked ? '4 4' : undefined,
				}}
			/>
			{!isBlocked && (
				<g>
					<path
						d={edgePath}
						fill="none"
						stroke={tv(tone)}
						strokeWidth={2}
						strokeLinecap="round"
						strokeDasharray="4 8"
						opacity={0.3}
					/>
					{Array.from({ length: particles }).map((_, i) => (
						<g key={i}>
							<circle r="12" fill={tv(tone)} opacity={0.05}>
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
							<rect width="36" height="16" rx="5" fill={tv(tone)} opacity={0.9}>
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
				</g>
			)}
			{isBlocked && (
				<g>
					<circle r="10" fill="var(--color-con)" opacity={0.05}>
						<animateMotion
							dur={`${speed * 2}s`}
							repeatCount="indefinite"
							rotate="auto"
							path={edgePath}
							calcMode="spline"
							keySplines="0.42, 0, 0.58, 1.0"
						/>
					</circle>
					<rect width="38" height="18" rx="5" fill="var(--color-con)" opacity={0.7}>
						<animateMotion
							dur={`${speed * 2}s`}
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
							dur={`${speed * 2}s`}
							repeatCount="indefinite"
							rotate="auto"
							path={edgePath}
							calcMode="spline"
							keySplines="0.42, 0, 0.58, 1.0"
						/>
						STUCK
					</text>
				</g>
			)}
		</g>
	)
}

const nodeTypes = { gate: GateNode }
const edgeTypes = { packet: PacketEdge }

function ApprovalColumn({ variant, colorMode }: { variant: 'bad' | 'good'; colorMode: 'dark' | 'light' }) {
	const isBad = variant === 'bad'
	const tone = isBad ? 'con' : 'pilot'
	const speed = isBad ? 5 : 2

	const initialNodes: Node[] = useMemo(
		() => [
			{ id: 'start', type: 'gate', position: { x: 70, y: 0 }, data: { label: 'PR Opened', tone: 'found' } },
			{
				id: 'g1',
				type: 'gate',
				position: { x: 70, y: 100 },
				data: {
					label: isBad ? 'Code Review' : 'Contract Review',
					sub: isBad ? 'manual · slow' : 'structural · fast',
					tone,
				},
			},
			{
				id: 'g2',
				type: 'gate',
				position: { x: 70, y: 200 },
				data: {
					label: isBad ? 'Security Ask' : 'Verification',
					sub: isBad ? 'reconstruct intent' : 'check structure',
					tone,
				},
			},
			{
				id: 'g3',
				type: 'gate',
				position: { x: 70, y: 300 },
				data: {
					label: isBad ? 'Compliance Ask' : 'Auditable Trail',
					sub: isBad ? 'trail by handwork' : 'trail by routing',
					tone,
				},
			},
			{
				id: 'end',
				type: 'gate',
				position: { x: 70, y: 400 },
				data: {
					label: isBad ? 'Blocked' : 'Shipped',
					sub: isBad ? 'backlog grows' : 'production',
					tone: isBad ? 'con' : 'pilot',
					status: isBad ? 'blocked' : 'pass',
				},
			},
		],
		[isBad, tone],
	)

	const initialEdges: Edge[] = useMemo(
		() => [
			{
				id: 'e1',
				source: 'start',
				target: 'g1',
				type: 'packet',
				data: { tone, speed, blocked: isBad, particles: isBad ? 1 : 3 },
			},
			{
				id: 'e2',
				source: 'g1',
				target: 'g2',
				type: 'packet',
				data: { tone, speed, blocked: isBad, particles: isBad ? 1 : 3 },
			},
			{
				id: 'e3',
				source: 'g2',
				target: 'g3',
				type: 'packet',
				data: { tone, speed, blocked: isBad, particles: isBad ? 1 : 3 },
			},
			{
				id: 'e4',
				source: 'g3',
				target: 'end',
				type: 'packet',
				data: { tone, speed: isBad ? speed * 1.5 : speed, blocked: isBad, particles: isBad ? 1 : 3 },
			},
			// Feedback loops for good
			...(!isBad
				? [
						{
							id: 'e5',
							source: 'end',
							target: 'start',
							type: 'packet',
							data: { tone: 'found', speed: 4, particles: 2, label: 'DEPLOY' },
						},
						{
							id: 'e6',
							source: 'g1',
							target: 'start',
							type: 'packet',
							data: { tone: 'found', speed: 3.5, particles: 1, label: 'OK' },
						},
						{
							id: 'e7',
							source: 'g2',
							target: 'g1',
							type: 'packet',
							data: { tone: 'found', speed: 3.5, particles: 1, label: 'PASS' },
						},
					]
				: [
						// Reject/rework loops for bad
						{
							id: 'e5',
							source: 'g1',
							target: 'start',
							type: 'packet',
							data: { tone, speed: speed * 0.7, blocked: false, particles: 1, label: 'REJ' },
						},
						{
							id: 'e6',
							source: 'g2',
							target: 'g1',
							type: 'packet',
							data: { tone, speed: speed * 0.7, blocked: false, particles: 1, label: 'ASK' },
						},
						{
							id: 'e7',
							source: 'g3',
							target: 'g2',
							type: 'packet',
							data: { tone, speed: speed * 0.7, blocked: false, particles: 1, label: 'ASK' },
						},
					]),
		],
		[isBad, tone, speed],
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
				<Background gap={30} size={1} color="var(--color-line)" />
			</ReactFlow>
		</div>
	)
}

export default function RichApprovalFlow() {
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
				<ApprovalColumn variant="bad" colorMode={colorMode} />
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
				<ApprovalColumn variant="good" colorMode={colorMode} />
			</div>
		</div>
	)
}
