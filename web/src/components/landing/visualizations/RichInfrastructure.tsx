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

function LayerNode({ data }: NodeProps<{ label: string; sub?: string; tone?: Tone; items?: string[] }>) {
	const t = data.tone ?? 'found'
	return (
		<div style={{ position: 'relative' }}>
			<Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
			<Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
			<div
				style={{
					padding: '16px 18px',
					borderRadius: 14,
					border: `1.5px solid ${tv(t)}`,
					background: `linear-gradient(135deg, color-mix(in srgb, ${tv(t)} 14%, var(--color-bg-elev)), var(--color-bg-elev))`,
					minWidth: 200,
					boxShadow: `0 10px 32px -12px ${tg(t)}`,
					position: 'relative',
				}}
			>
				<div style={{ fontWeight: 700, fontSize: 13, color: 'var(--color-fg-strong)', textAlign: 'center' }}>
					{data.label}
				</div>
				{data.sub && (
					<div
						style={{
							fontSize: 10,
							fontFamily: 'var(--font-mono)',
							color: 'var(--color-fg-muted)',
							marginTop: 3,
							textAlign: 'center',
						}}
					>
						{data.sub}
					</div>
				)}
				{data.items && (
					<div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 5 }}>
						{data.items.map((item, i) => (
							<div
								key={i}
								style={{
									fontSize: 11,
									padding: '4px 8px',
									borderRadius: 6,
									background: `color-mix(in srgb, ${tv(t)} 8%, transparent)`,
									border: `1px solid color-mix(in srgb, ${tv(t)} 20%, transparent)`,
									color: 'var(--color-fg-muted)',
									textAlign: 'center',
								}}
							>
								{item}
							</div>
						))}
					</div>
				)}
				{/* Status dot */}
				<span
					style={{
						position: 'absolute',
						top: 8,
						right: 8,
						width: 7,
						height: 7,
						borderRadius: '50%',
						background: tv(t, true),
						boxShadow: `0 0 8px ${tv(t)}`,
						animation: 'statusBlink 2.5s ease-in-out infinite',
					}}
				/>
			</div>
		</div>
	)
}

function AdapterNode({ data }: NodeProps<{ label: string; sub?: string; tone?: Tone }>) {
	const t = data.tone ?? 'pilot'
	return (
		<div style={{ position: 'relative' }}>
			<Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
			<Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
			<div
				style={{
					padding: '10px 14px',
					borderRadius: 999,
					border: `1.5px solid ${tv(t)}`,
					background: `linear-gradient(135deg, color-mix(in srgb, ${tv(t)} 14%, var(--color-bg-elev)), var(--color-bg-elev))`,
					color: 'var(--color-fg-strong)',
					fontWeight: 600,
					fontSize: 11,
					minWidth: 90,
					textAlign: 'center',
					boxShadow: `0 6px 24px -10px ${tg(t)}`,
					position: 'relative',
				}}
			>
				{data.label}
				{/* Status dot */}
				<span
					style={{
						position: 'absolute',
						top: -2,
						right: -2,
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

function BindEdge({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data }: EdgeProps) {
	const [edgePath] = getBezierPath({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition })
	const tone = (data?.tone as Tone) ?? 'found'
	const count = data?.particles ?? 2
	const dur = data?.duration ?? 2.5

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
					<circle r="6" fill={tv(tone, true)} opacity={0.06}>
						<animateMotion
							begin={`${i * (dur / count)}s`}
							dur={`${dur}s`}
							repeatCount="indefinite"
							path={edgePath}
							calcMode="spline"
							keySplines="0.42, 0, 0.58, 1.0"
						/>
					</circle>
					<circle r="3.5" fill={tv(tone, true)} opacity={0.12}>
						<animateMotion
							begin={`${i * (dur / count)}s`}
							dur={`${dur}s`}
							repeatCount="indefinite"
							path={edgePath}
							calcMode="spline"
							keySplines="0.42, 0, 0.58, 1.0"
						/>
					</circle>
					<circle r="1.8" fill={tv(tone, true)} opacity={0.95}>
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

const nodeTypes = { layer: LayerNode, adapter: AdapterNode }
const edgeTypes = { bind: BindEdge }

export default function RichInfrastructure() {
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
			// Left: Service Definitions
			{
				id: 'svc',
				type: 'layer',
				position: { x: 20, y: 80 },
				data: {
					label: 'Service Definitions',
					sub: 'static · reviewable · versioned',
					tone: 'pilot',
					items: ['schemas + contracts', 'business logic', 'hooks + policies', 'ai prompts + sandbox'],
				},
			},
			// Right: Running System
			{
				id: 'run',
				type: 'layer',
				position: { x: 720, y: 80 },
				data: {
					label: 'Running System',
					sub: 'runtime · observable · connected',
					tone: 'found',
					items: [
						'http server · routes',
						'event bridge · messages',
						'stores · secrets · otel',
						'ai harness · workflows',
					],
				},
			},
			// Center: Infrastructure Binding Layer
			{
				id: 'http',
				type: 'adapter',
				position: { x: 340, y: 20 },
				data: { label: 'HTTP Server', sub: 'routes · middleware', tone: 'found' },
			},
			{
				id: 'bridge',
				type: 'adapter',
				position: { x: 440, y: 20 },
				data: { label: 'Event Bridge', sub: 'pub/sub · retry', tone: 'found' },
			},
			{
				id: 'ai',
				type: 'adapter',
				position: { x: 540, y: 20 },
				data: { label: 'AI Harness', sub: 'sandbox · LLM', tone: 'con' },
			},
			{
				id: 'secret',
				type: 'adapter',
				position: { x: 340, y: 70 },
				data: { label: 'Secret Store', sub: 'vault · env · rotate', tone: 'found' },
			},
			{
				id: 'state',
				type: 'adapter',
				position: { x: 440, y: 70 },
				data: { label: 'State Store', sub: 'kv · blob · cache', tone: 'found' },
			},
			{
				id: 'config',
				type: 'adapter',
				position: { x: 540, y: 70 },
				data: { label: 'Config Store', sub: 'runtime · validate', tone: 'found' },
			},
			{
				id: 'queue',
				type: 'adapter',
				position: { x: 340, y: 120 },
				data: { label: 'Queue Bridge', sub: 'durable · dlq', tone: 'found' },
			},
			{
				id: 'temporal',
				type: 'adapter',
				position: { x: 440, y: 120 },
				data: { label: 'Temporal', sub: 'workflows · durable', tone: 'found' },
			},
			{
				id: 'dapr',
				type: 'adapter',
				position: { x: 540, y: 120 },
				data: { label: 'Dapr · K8s SDK', sub: 'sidecar · native', tone: 'pilot' },
			},
		],
		[],
	)

	const initialEdges: Edge[] = useMemo(
		() => [
			// Service definitions → adapters
			{ id: 's1', source: 'svc', target: 'http', type: 'bind', data: { tone: 'pilot', particles: 3, duration: 2.5 } },
			{ id: 's2', source: 'svc', target: 'bridge', type: 'bind', data: { tone: 'pilot', particles: 3, duration: 2.8 } },
			{ id: 's3', source: 'svc', target: 'ai', type: 'bind', data: { tone: 'pilot', particles: 3, duration: 3 } },
			{ id: 's4', source: 'svc', target: 'secret', type: 'bind', data: { tone: 'pilot', particles: 3, duration: 2.2 } },
			{ id: 's5', source: 'svc', target: 'state', type: 'bind', data: { tone: 'pilot', particles: 3, duration: 2.6 } },
			{ id: 's6', source: 'svc', target: 'config', type: 'bind', data: { tone: 'pilot', particles: 3, duration: 2.4 } },
			{ id: 's7', source: 'svc', target: 'queue', type: 'bind', data: { tone: 'pilot', particles: 3, duration: 2.7 } },
			{
				id: 's8',
				source: 'svc',
				target: 'temporal',
				type: 'bind',
				data: { tone: 'pilot', particles: 3, duration: 2.3 },
			},
			{ id: 's9', source: 'svc', target: 'dapr', type: 'bind', data: { tone: 'pilot', particles: 3, duration: 2.9 } },
			// Adapters → running system
			{ id: 'r1', source: 'http', target: 'run', type: 'bind', data: { tone: 'found', particles: 3, duration: 2.5 } },
			{ id: 'r2', source: 'bridge', target: 'run', type: 'bind', data: { tone: 'found', particles: 3, duration: 2.8 } },
			{ id: 'r3', source: 'ai', target: 'run', type: 'bind', data: { tone: 'found', particles: 3, duration: 3 } },
			{ id: 'r4', source: 'secret', target: 'run', type: 'bind', data: { tone: 'found', particles: 3, duration: 2.2 } },
			{ id: 'r5', source: 'state', target: 'run', type: 'bind', data: { tone: 'found', particles: 3, duration: 2.6 } },
			{ id: 'r6', source: 'config', target: 'run', type: 'bind', data: { tone: 'found', particles: 3, duration: 2.4 } },
			{ id: 'r7', source: 'queue', target: 'run', type: 'bind', data: { tone: 'found', particles: 3, duration: 2.7 } },
			{
				id: 'r8',
				source: 'temporal',
				target: 'run',
				type: 'bind',
				data: { tone: 'found', particles: 3, duration: 2.3 },
			},
			{ id: 'r9', source: 'dapr', target: 'run', type: 'bind', data: { tone: 'found', particles: 3, duration: 2.9 } },
			// Cross-adapter connections (lateral relations)
			{
				id: 'c1',
				source: 'http',
				target: 'bridge',
				type: 'bind',
				data: { tone: 'found', particles: 2, duration: 3.5 },
			},
			{
				id: 'c2',
				source: 'secret',
				target: 'state',
				type: 'bind',
				data: { tone: 'found', particles: 2, duration: 3.2 },
			},
			{
				id: 'c3',
				source: 'queue',
				target: 'temporal',
				type: 'bind',
				data: { tone: 'found', particles: 2, duration: 3.8 },
			},
			{ id: 'c4', source: 'ai', target: 'config', type: 'bind', data: { tone: 'con', particles: 2, duration: 3.5 } },
			{ id: 'c5', source: 'state', target: 'config', type: 'bind', data: { tone: 'found', particles: 2, duration: 3 } },
			// Feedback: running system → service definitions (versioning, iteration)
			{ id: 'fb', source: 'run', target: 'svc', type: 'bind', data: { tone: 'pilot', particles: 2, duration: 4 } },
		],
		[],
	)

	const [nodes, , onNodesChange] = useNodesState(initialNodes)
	const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
	const onConnect = useCallback((params: Connection) => setEdges(eds => addEdge(params, eds)), [setEdges])

	return (
		<div style={{ width: '100%', height: 480 }}>
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
        @keyframes statusBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
		</div>
	)
}
