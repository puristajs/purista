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
   Custom Nodes
   ================================================================ */

function CoreNode({ data }: NodeProps<{ label: string; sub: string }>) {
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
					width: 170,
					height: 100,
					borderRadius: 18,
					border: '2px solid var(--color-found)',
					background:
						'linear-gradient(135deg, color-mix(in srgb, var(--color-found) 18%, var(--color-bg-elev)), var(--color-bg-elev))',
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
						background: 'radial-gradient(circle at 50% 100%, var(--color-found-glow), transparent 70%)',
						opacity: 0.5,
					}}
				/>
				<div style={{ position: 'relative', zIndex: 1 }}>
					<div
						style={{
							fontSize: 10,
							fontFamily: 'var(--font-mono)',
							letterSpacing: '0.18em',
							textTransform: 'uppercase',
							color: 'var(--color-found)',
						}}
					>
						Structural Core
					</div>
					<div style={{ fontWeight: 700, fontSize: 20, color: 'var(--color-fg-strong)', marginTop: 4 }}>
						{data.label}
					</div>
					<div style={{ fontSize: 11, color: 'var(--color-fg-muted)', marginTop: 2 }}>{data.sub}</div>
				</div>
				{/* Pulse ring */}
				<span
					style={{
						position: 'absolute',
						inset: -4,
						borderRadius: 22,
						border: '1.5px solid var(--color-found)',
						opacity: 0,
						animation: 'nodePulse 3s ease-out infinite',
					}}
				/>
			</div>
		</div>
	)
}

function OrbitNode({ data }: NodeProps<{ label: string; sub: string; tone?: Tone }>) {
	const t = data.tone ?? 'found'
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
					minWidth: 130,
					textAlign: 'center',
					boxShadow: `0 8px 28px -10px ${tg(t)}`,
					position: 'relative',
					overflow: 'hidden',
				}}
			>
				<div style={{ fontWeight: 600, fontSize: 12, color: 'var(--color-fg-strong)' }}>{data.label}</div>
				<div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--color-fg-muted)', marginTop: 2 }}>
					{data.sub}
				</div>
				{/* Status dot */}
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
   Animated Edge with multiple glowing particles
   ================================================================ */

function OrbitalEdge({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data }: EdgeProps) {
	const [edgePath] = getBezierPath({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition })
	const tone = (data?.tone as Tone) ?? 'found'
	const count = data?.particles ?? 3
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
				strokeDasharray="5 10"
				opacity={0.25}
			/>
			{Array.from({ length: count }).map((_, i) => (
				<g key={i}>
					{/* Outer glow halo */}
					<circle r="8" fill={tv(tone, true)} opacity={0.06}>
						<animateMotion
							begin={`${i * (dur / count)}s`}
							dur={`${dur}s`}
							repeatCount="indefinite"
							path={edgePath}
							calcMode="spline"
							keySplines="0.42, 0, 0.58, 1.0"
						/>
					</circle>
					<circle r="5" fill={tv(tone, true)} opacity={0.15}>
						<animateMotion
							begin={`${i * (dur / count)}s`}
							dur={`${dur}s`}
							repeatCount="indefinite"
							path={edgePath}
							calcMode="spline"
							keySplines="0.42, 0, 0.58, 1.0"
						/>
					</circle>
					<circle r="2.5" fill={tv(tone, true)} opacity={0.95}>
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

const nodeTypes = { core: CoreNode, orbit: OrbitNode }
const edgeTypes = { orbital: OrbitalEdge }

export default function RichSystemMap() {
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
			{ id: 'core', type: 'core', position: { x: 390, y: 200 }, data: { label: 'PURISTA', sub: 'v3' } },
			{
				id: 'ai-coder',
				type: 'orbit',
				position: { x: 40, y: 60 },
				data: { label: 'AI · Coder', sub: 'code generation', tone: 'con' },
			},
			{
				id: 'ai-agent',
				type: 'orbit',
				position: { x: 20, y: 200 },
				data: { label: 'AI · Agent', sub: 'runtime tasks', tone: 'con' },
			},
			{
				id: 'ai-copilot',
				type: 'orbit',
				position: { x: 40, y: 340 },
				data: { label: 'AI · Copilot', sub: 'implementation', tone: 'con' },
			},
			{
				id: 'enterprise',
				type: 'orbit',
				position: { x: 380, y: 20 },
				data: { label: 'Enterprise', sub: 'review · approval', tone: 'pilot' },
			},
			{
				id: 'cloud',
				type: 'orbit',
				position: { x: 760, y: 60 },
				data: { label: 'Cloud · K8s', sub: 'infrastructure', tone: 'found' },
			},
			{
				id: 'observability',
				type: 'orbit',
				position: { x: 800, y: 200 },
				data: { label: 'Observability', sub: 'otel · traces', tone: 'found' },
			},
			{
				id: 'data',
				type: 'orbit',
				position: { x: 760, y: 340 },
				data: { label: 'Data · Secrets', sub: 'vault · stores', tone: 'found' },
			},
			{
				id: 'audit',
				type: 'orbit',
				position: { x: 380, y: 380 },
				data: { label: 'Audit · Compliance', sub: 'traces · contracts', tone: 'pilot' },
			},
		],
		[],
	)

	const initialEdges: Edge[] = useMemo(
		() => [
			{
				id: 'e1',
				source: 'ai-coder',
				target: 'core',
				type: 'orbital',
				data: { tone: 'con', particles: 3, duration: 2.5 },
			},
			{
				id: 'e2',
				source: 'ai-agent',
				target: 'core',
				type: 'orbital',
				data: { tone: 'con', particles: 3, duration: 2.8 },
			},
			{
				id: 'e3',
				source: 'ai-copilot',
				target: 'core',
				type: 'orbital',
				data: { tone: 'con', particles: 3, duration: 3 },
			},
			{
				id: 'e4',
				source: 'enterprise',
				target: 'core',
				type: 'orbital',
				data: { tone: 'pilot', particles: 3, duration: 2.2 },
			},
			{
				id: 'e5',
				source: 'core',
				target: 'cloud',
				type: 'orbital',
				data: { tone: 'found', particles: 3, duration: 2.5 },
			},
			{
				id: 'e6',
				source: 'core',
				target: 'observability',
				type: 'orbital',
				data: { tone: 'found', particles: 3, duration: 2.8 },
			},
			{ id: 'e7', source: 'core', target: 'data', type: 'orbital', data: { tone: 'found', particles: 3, duration: 3 } },
			{
				id: 'e8',
				source: 'core',
				target: 'audit',
				type: 'orbital',
				data: { tone: 'pilot', particles: 3, duration: 2.2 },
			},
			// Feedback loops
			{
				id: 'e9',
				source: 'cloud',
				target: 'core',
				type: 'orbital',
				data: { tone: 'found', particles: 2, duration: 4 },
			},
			{
				id: 'e10',
				source: 'observability',
				target: 'enterprise',
				type: 'orbital',
				data: { tone: 'pilot', particles: 2, duration: 3.5 },
			},
			// Cross-connections (lateral relations)
			{
				id: 'e11',
				source: 'ai-coder',
				target: 'ai-copilot',
				type: 'orbital',
				data: { tone: 'con', particles: 2, duration: 3.2 },
			},
			{
				id: 'e12',
				source: 'cloud',
				target: 'data',
				type: 'orbital',
				data: { tone: 'found', particles: 2, duration: 3.8 },
			},
			{
				id: 'e13',
				source: 'audit',
				target: 'enterprise',
				type: 'orbital',
				data: { tone: 'pilot', particles: 2, duration: 3 },
			},
			{
				id: 'e14',
				source: 'data',
				target: 'observability',
				type: 'orbital',
				data: { tone: 'found', particles: 2, duration: 3.5 },
			},
			{
				id: 'e15',
				source: 'ai-agent',
				target: 'cloud',
				type: 'orbital',
				data: { tone: 'con', particles: 2, duration: 3.5 },
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
				fitViewOptions={{ padding: 0.1 }}
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
