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

type Tone = 'found' | 'con' | 'pilot'

function tv(t: Tone, hi = false) {
	return `var(--color-${t}${hi ? '-hi' : ''})`
}
function tg(t: Tone) {
	return `var(--color-${t}-glow)`
}

/* ================================================================
   Nodes
   ================================================================ */

function HubNode({ data }: NodeProps<{ label: string; sub?: string }>) {
	return (
		<div style={{ position: 'relative' }}>
			<Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
			<Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
			<Handle type="target" position={Position.Right} style={{ opacity: 0 }} />
			<Handle type="target" position={Position.Bottom} style={{ opacity: 0 }} />
			<Handle type="source" position={Position.Top} style={{ opacity: 0 }} />
			<Handle type="source" position={Position.Left} style={{ opacity: 0 }} />
			<Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
			<Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
			<div
				style={{
					width: 200,
					height: 110,
					borderRadius: 16,
					border: '2px solid var(--color-found)',
					background:
						'linear-gradient(135deg, color-mix(in srgb, var(--color-found) 15%, var(--color-bg-elev)), var(--color-bg-elev))',
					display: 'grid',
					placeItems: 'center',
					textAlign: 'center',
					boxShadow: '0 12px 40px -14px var(--color-found-glow)',
					position: 'relative',
					overflow: 'hidden',
				}}
			>
				<div
					style={{
						position: 'absolute',
						inset: 0,
						background: 'radial-gradient(circle at 50% 0%, var(--color-found-glow), transparent 60%)',
						opacity: 0.5,
					}}
				/>
				<div style={{ position: 'relative', zIndex: 1 }}>
					<div
						style={{
							fontSize: 10,
							fontFamily: 'var(--font-mono)',
							letterSpacing: '0.16em',
							textTransform: 'uppercase',
							color: 'var(--color-found)',
						}}
					>
						PURISTA Definitions
					</div>
					<div style={{ fontWeight: 700, fontSize: 18, color: 'var(--color-fg-strong)', marginTop: 4 }}>
						{data.label}
					</div>
					{data.sub && <div style={{ fontSize: 11, color: 'var(--color-fg-muted)', marginTop: 3 }}>{data.sub}</div>}
				</div>
				<span
					style={{
						position: 'absolute',
						inset: -3,
						borderRadius: 19,
						border: '1.5px solid var(--color-found)',
						opacity: 0,
						animation: 'nodePulse 3s ease-out infinite',
					}}
				/>
			</div>
		</div>
	)
}

function ReviewerNode({ data }: NodeProps<{ label: string; sub: string; tone?: Tone }>) {
	const t = data.tone ?? 'pilot'
	return (
		<div style={{ position: 'relative' }}>
			<Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
			<Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
			<div
				style={{
					padding: '12px 16px',
					borderRadius: 12,
					border: `1.5px solid ${tv(t)}`,
					background: `linear-gradient(135deg, color-mix(in srgb, ${tv(t)} 12%, var(--color-bg-elev)), var(--color-bg-elev))`,
					minWidth: 140,
					textAlign: 'center',
					boxShadow: `0 8px 28px -10px ${tg(t)}`,
					position: 'relative',
				}}
			>
				<div style={{ fontWeight: 600, fontSize: 12, color: 'var(--color-fg-strong)' }}>{data.label}</div>
				<div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--color-fg-muted)', marginTop: 2 }}>
					{data.sub}
				</div>
				<span
					style={{
						position: 'absolute',
						top: 6,
						right: 6,
						width: 6,
						height: 6,
						borderRadius: '50%',
						background: tv(t, true),
						boxShadow: `0 0 6px ${tv(t)}`,
						animation: 'statusBlink 2.5s ease-in-out infinite',
					}}
				/>
			</div>
		</div>
	)
}

/* ================================================================
   Animated Edge
   ================================================================ */

function VerifyEdge({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data }: EdgeProps) {
	const [edgePath] = getBezierPath({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition })
	const tone = (data?.tone as Tone) ?? 'found'
	const count = data?.particles ?? 2
	const dur = data?.duration ?? 3

	return (
		<>
			<BaseEdge id={id} path={edgePath} style={{ stroke: 'var(--color-line-strong)', strokeWidth: 1.2 }} />
			<path
				d={edgePath}
				fill="none"
				stroke={tv(tone)}
				strokeWidth={1.5}
				strokeLinecap="round"
				strokeDasharray="4 8"
				opacity={0.3}
			/>
			{Array.from({ length: count }).map((_, i) => (
				<g key={i}>
					<circle r="7" fill={tv(tone, true)} opacity={0.06}>
						<animateMotion
							begin={`${i * (dur / count)}s`}
							dur={`${dur}s`}
							repeatCount="indefinite"
							path={edgePath}
							calcMode="spline"
							keySplines="0.42, 0, 0.58, 1.0"
						/>
					</circle>
					<circle r="4" fill={tv(tone, true)} opacity={0.15}>
						<animateMotion
							begin={`${i * (dur / count)}s`}
							dur={`${dur}s`}
							repeatCount="indefinite"
							path={edgePath}
							calcMode="spline"
							keySplines="0.42, 0, 0.58, 1.0"
						/>
					</circle>
					<circle r="2" fill={tv(tone, true)} opacity={0.95}>
						<animateMotion
							begin={`${i * (dur / count)}s`}
							dur={`${dur}s`}
							repeatCount="indefinite"
							path={edgePath}
							calcMode="spline"
							keySplines="0.42, 0, 0.58, 1.0"
						/>
					</circle>
				</g>
			))}
		</>
	)
}

const nodeTypes = { hub: HubNode, reviewer: ReviewerNode }
const edgeTypes = { verify: VerifyEdge }

export default function RichExplain() {
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

	const initialNodes: Node[] = useMemo(
		() => [
			{
				id: 'hub',
				type: 'hub',
				position: { x: 300, y: 200 },
				data: { label: 'Contracts', sub: 'policies · hooks · runtime' },
			},
			{
				id: 'arch',
				type: 'reviewer',
				position: { x: 60, y: 60 },
				data: { label: 'Architecture', sub: 'ownership · boundaries', tone: 'pilot' },
			},
			{
				id: 'sec',
				type: 'reviewer',
				position: { x: 500, y: 60 },
				data: { label: 'Security', sub: 'data flow · access', tone: 'pilot' },
			},
			{
				id: 'compliance',
				type: 'reviewer',
				position: { x: 20, y: 220 },
				data: { label: 'Compliance', sub: 'audit trails', tone: 'pilot' },
			},
			{
				id: 'ops',
				type: 'reviewer',
				position: { x: 540, y: 220 },
				data: { label: 'Operations', sub: 'runtime behavior', tone: 'pilot' },
			},
			{
				id: 'audit',
				type: 'reviewer',
				position: { x: 80, y: 360 },
				data: { label: 'Audit', sub: 'traceability · evidence', tone: 'pilot' },
			},
			{
				id: 'platform',
				type: 'reviewer',
				position: { x: 480, y: 360 },
				data: { label: 'Platform', sub: 'integration · IAM', tone: 'pilot' },
			},
		],
		[],
	)

	const initialEdges: Edge[] = useMemo(
		() => [
			{ id: 'e1', source: 'hub', target: 'arch', type: 'verify', data: { tone: 'found', particles: 3, duration: 2.5 } },
			{ id: 'e2', source: 'hub', target: 'sec', type: 'verify', data: { tone: 'found', particles: 3, duration: 2.8 } },
			{
				id: 'e3',
				source: 'hub',
				target: 'compliance',
				type: 'verify',
				data: { tone: 'found', particles: 3, duration: 3 },
			},
			{ id: 'e4', source: 'hub', target: 'ops', type: 'verify', data: { tone: 'found', particles: 3, duration: 2.2 } },
			{
				id: 'e5',
				source: 'hub',
				target: 'audit',
				type: 'verify',
				data: { tone: 'found', particles: 3, duration: 2.6 },
			},
			{
				id: 'e6',
				source: 'hub',
				target: 'platform',
				type: 'verify',
				data: { tone: 'found', particles: 3, duration: 2.4 },
			},
			// Cross connections (reviewer-to-reviewer lateral relations)
			{ id: 'e7', source: 'arch', target: 'sec', type: 'verify', data: { tone: 'pilot', particles: 2, duration: 4 } },
			{
				id: 'e8',
				source: 'compliance',
				target: 'audit',
				type: 'verify',
				data: { tone: 'pilot', particles: 2, duration: 3.5 },
			},
			{
				id: 'e9',
				source: 'ops',
				target: 'platform',
				type: 'verify',
				data: { tone: 'pilot', particles: 2, duration: 3.8 },
			},
			{
				id: 'e10',
				source: 'sec',
				target: 'compliance',
				type: 'verify',
				data: { tone: 'pilot', particles: 2, duration: 4.2 },
			},
			{
				id: 'e11',
				source: 'audit',
				target: 'platform',
				type: 'verify',
				data: { tone: 'pilot', particles: 2, duration: 3.6 },
			},
			{
				id: 'e12',
				source: 'arch',
				target: 'ops',
				type: 'verify',
				data: { tone: 'pilot', particles: 2, duration: 4.5 },
			},
			// Feedback to hub
			{ id: 'e13', source: 'sec', target: 'hub', type: 'verify', data: { tone: 'found', particles: 2, duration: 3.5 } },
			{
				id: 'e14',
				source: 'audit',
				target: 'hub',
				type: 'verify',
				data: { tone: 'found', particles: 2, duration: 3.8 },
			},
		],
		[],
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
				fitViewOptions={{ padding: 0.15 }}
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
			<style>{`
        @keyframes nodePulse {
          0% { transform: scale(1); opacity: 0.6; }
          70% { transform: scale(1.08); opacity: 0; }
          100% { transform: scale(1); opacity: 0; }
        }
        @keyframes statusBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
		</div>
	)
}
