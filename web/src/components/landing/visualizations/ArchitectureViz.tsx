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

function toneVar(t: Tone, hi = false) {
	return `var(--color-${t}${hi ? '-hi' : ''})`
}
function toneGlow(t: Tone) {
	return `var(--color-${t}-glow)`
}

/* ================================================================
   Nodes
   ================================================================ */

function ServiceNode({ data }: NodeProps<{ label: string; tone?: Tone }>) {
	const t = data.tone ?? 'con'
	return (
		<div
			style={{
				padding: '10px 16px',
				borderRadius: 12,
				border: `1.5px solid ${toneVar(t)}`,
				background: `linear-gradient(135deg, color-mix(in srgb, ${toneVar(t)} 14%, var(--color-bg-elev)), var(--color-bg-elev))`,
				color: 'var(--color-fg-strong)',
				fontWeight: 600,
				fontSize: 13,
				minWidth: 130,
				textAlign: 'center',
				boxShadow: `0 6px 24px -10px ${toneGlow(t)}`,
				position: 'relative',
			}}
		>
			<Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
			<Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
			{data.label}
		</div>
	)
}

function BridgeNode({ data }: NodeProps<{ label: string; sub?: string; tone?: Tone }>) {
	const t = data.tone ?? 'found'
	return (
		<div
			style={{
				padding: '14px 20px',
				borderRadius: 14,
				border: `1.5px solid ${toneVar(t)}`,
				background: `linear-gradient(135deg, color-mix(in srgb, ${toneVar(t)} 18%, var(--color-bg-elev)), var(--color-bg-elev))`,
				color: 'var(--color-fg)',
				minWidth: 160,
				textAlign: 'center',
				boxShadow: `0 10px 32px -12px ${toneGlow(t)}`,
				position: 'relative',
			}}
		>
			<Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
			<Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
			<div style={{ fontWeight: 700, fontSize: 14, color: 'var(--color-fg-strong)' }}>{data.label}</div>
			{data.sub && (
				<div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--color-fg-muted)', marginTop: 3 }}>
					{data.sub}
				</div>
			)}
		</div>
	)
}

function AdapterNode({ data }: NodeProps<{ label: string; tone?: Tone }>) {
	const t = data.tone ?? 'pilot'
	return (
		<div
			style={{
				padding: '10px 14px',
				borderRadius: 999,
				border: `1.5px solid ${toneVar(t)}`,
				background: `linear-gradient(135deg, color-mix(in srgb, ${toneVar(t)} 14%, var(--color-bg-elev)), var(--color-bg-elev))`,
				color: 'var(--color-fg-strong)',
				fontWeight: 600,
				fontSize: 12,
				minWidth: 100,
				textAlign: 'center',
				boxShadow: `0 6px 24px -10px ${toneGlow(t)}`,
				position: 'relative',
			}}
		>
			<Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
			<Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
			{data.label}
		</div>
	)
}

/* ================================================================
   Animated Edge
   ================================================================ */

function FlowEdge({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data }: EdgeProps) {
	const [edgePath] = getBezierPath({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition })
	const tone = (data?.tone as Tone) ?? 'found'
	const speed = data?.speed ?? 2
	const particles = data?.particles ?? 3

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
				opacity={0.35}
			/>
			{Array.from({ length: particles }).map((_, i) => (
				<g key={i}>
					<circle r="7" fill={toneVar(tone, true)} opacity={0.06}>
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
					<ellipse rx="4.5" ry="2" fill={toneVar(tone, true)} opacity={0.9}>
						<animateMotion
							begin={`${i * (speed / particles)}s`}
							dur={`${speed}s`}
							repeatCount="indefinite"
							rotate="auto"
							path={edgePath}
							calcMode="spline"
							keySplines="0.42, 0, 0.58, 1.0"
						/>
					</ellipse>
				</g>
			))}
		</>
	)
}

const nodeTypes = { service: ServiceNode, bridge: BridgeNode, adapter: AdapterNode }
const edgeTypes = { flow: FlowEdge }

export default function ArchitectureViz() {
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
			// Business layer
			{ id: 'svc-user', type: 'service', position: { x: 40, y: 0 }, data: { label: 'UserService', tone: 'con' } },
			{ id: 'svc-order', type: 'service', position: { x: 220, y: 0 }, data: { label: 'OrderService', tone: 'con' } },
			{ id: 'svc-pay', type: 'service', position: { x: 400, y: 0 }, data: { label: 'PaymentService', tone: 'con' } },
			{ id: 'svc-inv', type: 'service', position: { x: 580, y: 0 }, data: { label: 'InventoryService', tone: 'con' } },
			{
				id: 'svc-notif',
				type: 'service',
				position: { x: 760, y: 0 },
				data: { label: 'NotificationService', tone: 'con' },
			},
			// Bridge layer
			{
				id: 'br-route',
				type: 'bridge',
				position: { x: 140, y: 160 },
				data: { label: 'Router', sub: 'Message routing', tone: 'found' },
			},
			{
				id: 'br-retry',
				type: 'bridge',
				position: { x: 320, y: 160 },
				data: { label: 'Retry', sub: 'Exponential backoff', tone: 'found' },
			},
			{
				id: 'br-trace',
				type: 'bridge',
				position: { x: 500, y: 160 },
				data: { label: 'Tracing', sub: 'OpenTelemetry', tone: 'found' },
			},
			{
				id: 'br-val',
				type: 'bridge',
				position: { x: 680, y: 160 },
				data: { label: 'Validation', sub: 'Schema enforcement', tone: 'found' },
			},
			// Adapter layer
			{ id: 'adp-amqp', type: 'adapter', position: { x: 100, y: 320 }, data: { label: 'AMQP', tone: 'pilot' } },
			{ id: 'adp-nats', type: 'adapter', position: { x: 260, y: 320 }, data: { label: 'NATS', tone: 'pilot' } },
			{ id: 'adp-redis', type: 'adapter', position: { x: 420, y: 320 }, data: { label: 'Redis', tone: 'pilot' } },
			{ id: 'adp-sqs', type: 'adapter', position: { x: 580, y: 320 }, data: { label: 'RedisQueue', tone: 'pilot' } },
			{ id: 'adp-mqtt', type: 'adapter', position: { x: 740, y: 320 }, data: { label: 'MQTT', tone: 'pilot' } },
		],
		[],
	)

	const initialEdges: Edge[] = useMemo(() => {
		const e: Edge[] = []
		const services = ['svc-user', 'svc-order', 'svc-pay', 'svc-inv', 'svc-notif']
		const bridges = ['br-route', 'br-retry', 'br-trace', 'br-val']
		const adapters = ['adp-amqp', 'adp-nats', 'adp-redis', 'adp-sqs', 'adp-mqtt']

		// Services → Bridge (down) - more connections
		services.forEach((s, i) => {
			const b = bridges[i % bridges.length]
			e.push({ id: `${s}-${b}`, source: s, target: b, type: 'flow', data: { tone: 'con', speed: 2.2, particles: 4 } })
			// Cross connection
			const b2 = bridges[(i + 1) % bridges.length]
			e.push({ id: `${s}-${b2}`, source: s, target: b2, type: 'flow', data: { tone: 'con', speed: 3, particles: 2 } })
		})

		// Bridge → Adapters (down)
		bridges.forEach((b, i) => {
			const a = adapters[i % adapters.length]
			e.push({ id: `${b}-${a}`, source: b, target: a, type: 'flow', data: { tone: 'found', speed: 1.8, particles: 3 } })
			// Cross connection
			const a2 = adapters[(i + 2) % adapters.length]
			e.push({
				id: `${b}-${a2}`,
				source: b,
				target: a2,
				type: 'flow',
				data: { tone: 'found', speed: 2.6, particles: 2 },
			})
		})

		// Adapters → Bridge (up) - feedback loop
		adapters.forEach((a, i) => {
			const b = bridges[(i + 2) % bridges.length]
			e.push({ id: `${a}-${b}`, source: a, target: b, type: 'flow', data: { tone: 'pilot', speed: 2.5, particles: 3 } })
		})

		// Service-to-service lateral communication
		e.push({
			id: 's-o',
			source: 'svc-user',
			target: 'svc-order',
			type: 'flow',
			data: { tone: 'pilot', speed: 4, particles: 2 },
			style: { strokeDasharray: '4 6' },
		})
		e.push({
			id: 'o-p',
			source: 'svc-order',
			target: 'svc-pay',
			type: 'flow',
			data: { tone: 'pilot', speed: 3.5, particles: 2 },
			style: { strokeDasharray: '4 6' },
		})
		e.push({
			id: 'p-n',
			source: 'svc-pay',
			target: 'svc-notif',
			type: 'flow',
			data: { tone: 'pilot', speed: 3, particles: 2 },
			style: { strokeDasharray: '4 6' },
		})

		// Bridge lateral
		e.push({
			id: 'br-lat',
			source: 'br-route',
			target: 'br-trace',
			type: 'flow',
			data: { tone: 'found', speed: 3, particles: 2 },
			style: { strokeDasharray: '4 6' },
		})

		return e
	}, [])

	const [nodes, , onNodesChange] = useNodesState(initialNodes)
	const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
	const onConnect = useCallback((params: Connection) => setEdges(eds => addEdge(params, eds)), [setEdges])

	return (
		<div style={{ width: '100%', height: 460 }}>
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
				fitViewOptions={{ padding: 0.12 }}
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
