import {
	addEdge,
	Background,
	BaseEdge,
	type Connection,
	Controls,
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

type Tone = 'found' | 'con' | 'pilot' | 'fg'

function toneVar(t: Tone, hi = false) {
	return `var(--color-${t}${hi ? '-hi' : ''})`
}

function toneGlow(t: Tone) {
	return `var(--color-${t}-glow)`
}

/* ================================================================
   Custom Nodes
   ================================================================ */

function TriggerNode({ data }: NodeProps<{ label: string; sub: string; tone?: Tone }>) {
	const t = data.tone ?? 'found'
	return (
		<div
			style={{
				padding: '14px 18px',
				borderRadius: '16px',
				border: `1.5px solid ${toneVar(t)}`,
				background: `linear-gradient(135deg, color-mix(in srgb, ${toneVar(t)} 12%, var(--color-bg-elev)), var(--color-bg-elev))`,
				color: 'var(--color-fg)',
				minWidth: 180,
				boxShadow: `0 8px 32px -12px ${toneGlow(t)}`,
				position: 'relative',
			}}
		>
			<Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
			<div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
				<div
					style={{
						width: 40,
						height: 40,
						borderRadius: 10,
						background: `color-mix(in srgb, ${toneVar(t)} 18%, transparent)`,
						border: `1px solid color-mix(in srgb, ${toneVar(t)} 35%, transparent)`,
						display: 'grid',
						placeItems: 'center',
						flexShrink: 0,
					}}
				>
					<svg
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke={toneVar(t, true)}
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
					</svg>
				</div>
				<div>
					<div style={{ fontWeight: 600, fontSize: 14, letterSpacing: '-0.01em', color: 'var(--color-fg-strong)' }}>
						{data.label}
					</div>
					<div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--color-fg-muted)', marginTop: 2 }}>
						{data.sub}
					</div>
				</div>
			</div>
		</div>
	)
}

function AgentNode({ data }: NodeProps<{ label: string; sub: string; tone?: Tone }>) {
	const t = data.tone ?? 'con'
	return (
		<div
			style={{
				padding: '18px 22px',
				borderRadius: '18px',
				border: `1.5px solid ${toneVar(t)}`,
				background: `linear-gradient(135deg, color-mix(in srgb, ${toneVar(t)} 15%, var(--color-bg-elev)), var(--color-bg-elev))`,
				color: 'var(--color-fg)',
				minWidth: 220,
				boxShadow: `0 12px 40px -14px ${toneGlow(t)}`,
				position: 'relative',
			}}
		>
			<Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
			<Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
			<div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
				<div
					style={{
						width: 48,
						height: 48,
						borderRadius: 12,
						background: `color-mix(in srgb, ${toneVar(t)} 18%, transparent)`,
						border: `1px solid color-mix(in srgb, ${toneVar(t)} 35%, transparent)`,
						display: 'grid',
						placeItems: 'center',
						flexShrink: 0,
					}}
				>
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke={toneVar(t, true)}
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<rect x="3" y="3" width="18" height="18" rx="6" />
						<circle cx="9" cy="10" r="1.5" fill={toneVar(t, true)} />
						<circle cx="15" cy="10" r="1.5" fill={toneVar(t, true)} />
						<path d="M9 15c1.2 1.2 2.8 1.2 4 0" />
					</svg>
				</div>
				<div>
					<div style={{ fontWeight: 700, fontSize: 16, letterSpacing: '-0.01em', color: 'var(--color-fg-strong)' }}>
						{data.label}
					</div>
					<div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--color-fg-muted)', marginTop: 3 }}>
						{data.sub}
					</div>
				</div>
			</div>
		</div>
	)
}

function ConditionNode({ data }: NodeProps<{ label: string; tone?: Tone }>) {
	const t = data.tone ?? 'found'
	return (
		<div
			style={{
				padding: '14px 20px',
				borderRadius: '14px',
				border: `1.5px solid ${toneVar(t)}`,
				background: `linear-gradient(135deg, color-mix(in srgb, ${toneVar(t)} 12%, var(--color-bg-elev)), var(--color-bg-elev))`,
				color: 'var(--color-fg)',
				minWidth: 140,
				textAlign: 'center',
				boxShadow: `0 8px 28px -10px ${toneGlow(t)}`,
				position: 'relative',
			}}
		>
			<Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
			<Handle type="source" position={Position.Right} id="true" style={{ opacity: 0 }} />
			<Handle type="source" position={Position.Bottom} id="false" style={{ opacity: 0 }} />
			<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
				<svg
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
					stroke={toneVar(t, true)}
					strokeWidth="1.5"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path d="M12 3l9 5v10l-9 5-9-5V8z" />
					<path d="M12 12l9-5M12 12v10M12 12L3 7" />
				</svg>
				<span style={{ fontWeight: 600, fontSize: 14, color: 'var(--color-fg-strong)' }}>{data.label}</span>
			</div>
		</div>
	)
}

function ActionNode({ data }: NodeProps<{ label: string; sub: string; tone?: Tone }>) {
	const t = data.tone ?? 'pilot'
	return (
		<div
			style={{
				padding: '14px 18px',
				borderRadius: '16px',
				border: `1.5px solid ${toneVar(t)}`,
				background: `linear-gradient(135deg, color-mix(in srgb, ${toneVar(t)} 12%, var(--color-bg-elev)), var(--color-bg-elev))`,
				color: 'var(--color-fg)',
				minWidth: 170,
				boxShadow: `0 8px 32px -12px ${toneGlow(t)}`,
				position: 'relative',
			}}
		>
			<Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
			<Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
			<div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
				<div
					style={{
						width: 36,
						height: 36,
						borderRadius: 10,
						background: `color-mix(in srgb, ${toneVar(t)} 18%, transparent)`,
						border: `1px solid color-mix(in srgb, ${toneVar(t)} 35%, transparent)`,
						display: 'grid',
						placeItems: 'center',
						flexShrink: 0,
					}}
				>
					<svg
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke={toneVar(t, true)}
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
					</svg>
				</div>
				<div>
					<div style={{ fontWeight: 600, fontSize: 13, color: 'var(--color-fg-strong)' }}>{data.label}</div>
					<div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--color-fg-muted)', marginTop: 1 }}>
						{data.sub}
					</div>
				</div>
			</div>
		</div>
	)
}

function ResourceNode({ data }: NodeProps<{ label: string; sub: string; tone?: Tone }>) {
	const t = data.tone ?? 'found'
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				gap: 8,
				position: 'relative',
			}}
		>
			<Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
			<div
				style={{
					width: 64,
					height: 64,
					borderRadius: '50%',
					border: `1.5px solid ${toneVar(t)}`,
					background: `linear-gradient(135deg, color-mix(in srgb, ${toneVar(t)} 15%, var(--color-bg-elev)), var(--color-bg-elev))`,
					display: 'grid',
					placeItems: 'center',
					boxShadow: `0 8px 28px -10px ${toneGlow(t)}`,
				}}
			>
				<svg
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke={toneVar(t, true)}
					strokeWidth="1.5"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<circle cx="12" cy="12" r="3" />
					<path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
				</svg>
			</div>
			<div style={{ textAlign: 'center' }}>
				<div style={{ fontWeight: 600, fontSize: 12, color: 'var(--color-fg-strong)' }}>{data.label}</div>
				<div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--color-fg-muted)' }}>{data.sub}</div>
			</div>
		</div>
	)
}

/* ================================================================
   Custom Edge with flowing particles
   ================================================================ */

function ParticleEdge({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data }: EdgeProps) {
	const [edgePath] = getBezierPath({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition })
	const tone = (data?.tone as Tone) ?? 'found'
	const particles = data?.particles ?? 5
	const duration = data?.duration ?? 3

	return (
		<>
			<BaseEdge id={id} path={edgePath} style={{ stroke: 'var(--color-line-strong)', strokeWidth: 1.5 }} />
			<path
				d={edgePath}
				fill="none"
				stroke={toneVar(tone)}
				strokeWidth={2}
				strokeLinecap="round"
				strokeDasharray="6 10"
				opacity={0.4}
			/>
			{Array.from({ length: particles }).map((_, i) => (
				<g key={i}>
					{/* Glow orb */}
					<circle r="8" fill={toneVar(tone, true)} opacity={0.08}>
						<animateMotion
							begin={`${i * (duration / particles)}s`}
							dur={`${duration}s`}
							repeatCount="indefinite"
							rotate="auto"
							path={edgePath}
							calcMode="spline"
							keySplines="0.42, 0, 0.58, 1.0"
						/>
					</circle>
					{/* Main particle */}
					<ellipse rx="4" ry="2" fill={toneVar(tone, true)} opacity={0.95}>
						<animateMotion
							begin={`${i * (duration / particles)}s`}
							dur={`${duration}s`}
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

const nodeTypes = {
	trigger: TriggerNode,
	agent: AgentNode,
	condition: ConditionNode,
	action: ActionNode,
	resource: ResourceNode,
}

const edgeTypes = {
	particle: ParticleEdge,
}

/* ================================================================
   Component
   ================================================================ */

export default function WorkflowViz() {
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
				id: 'trigger',
				type: 'trigger',
				position: { x: 20, y: 180 },
				data: { label: "On 'Create User' form", sub: 'form submission', tone: 'con' },
			},
			{
				id: 'agent',
				type: 'agent',
				position: { x: 320, y: 160 },
				data: { label: 'AI Agent', sub: 'Tools Agent', tone: 'con' },
			},
			{
				id: 'condition',
				type: 'condition',
				position: { x: 640, y: 180 },
				data: { label: 'Is a manager?', tone: 'found' },
			},
			{
				id: 'action1',
				type: 'action',
				position: { x: 900, y: 80 },
				data: { label: 'Add to channel', sub: 'invite: channel', tone: 'pilot' },
			},
			{
				id: 'action2',
				type: 'action',
				position: { x: 900, y: 280 },
				data: { label: 'Update profile', sub: 'updateProfile: user', tone: 'pilot' },
			},
			{
				id: 'model',
				type: 'resource',
				position: { x: 260, y: 400 },
				data: { label: 'Anthropic Chat', sub: 'Chat Model', tone: 'found' },
			},
			{
				id: 'memory',
				type: 'resource',
				position: { x: 400, y: 400 },
				data: { label: 'Postgres', sub: 'Chat Memory', tone: 'found' },
			},
			{
				id: 'tool1',
				type: 'resource',
				position: { x: 540, y: 400 },
				data: { label: 'Microsoft', sub: 'Entra ID', tone: 'found' },
			},
			{
				id: 'tool2',
				type: 'resource',
				position: { x: 680, y: 400 },
				data: { label: 'Jira', sub: 'Software', tone: 'found' },
			},
		],
		[],
	)

	const initialEdges: Edge[] = useMemo(
		() => [
			{
				id: 't-a',
				source: 'trigger',
				target: 'agent',
				type: 'particle',
				data: { tone: 'con', particles: 4, duration: 2.5 },
			},
			{
				id: 'a-c',
				source: 'agent',
				target: 'condition',
				type: 'particle',
				data: { tone: 'found', particles: 4, duration: 2 },
			},
			{
				id: 'c-a1',
				source: 'condition',
				target: 'action1',
				type: 'particle',
				sourceHandle: 'true',
				data: { tone: 'pilot', particles: 3, duration: 2 },
				label: 'true',
				labelStyle: { fill: 'var(--color-pilot-hi)', fontSize: 11, fontFamily: 'var(--font-mono)' },
			},
			{
				id: 'c-a2',
				source: 'condition',
				target: 'action2',
				type: 'particle',
				sourceHandle: 'false',
				data: { tone: 'pilot', particles: 3, duration: 2 },
				label: 'false',
				labelStyle: { fill: 'var(--color-pilot-hi)', fontSize: 11, fontFamily: 'var(--font-mono)' },
			},
			{
				id: 'a-m',
				source: 'agent',
				target: 'model',
				type: 'particle',
				data: { tone: 'found', particles: 3, duration: 3 },
			},
			{
				id: 'a-me',
				source: 'agent',
				target: 'memory',
				type: 'particle',
				data: { tone: 'found', particles: 3, duration: 3 },
			},
			{
				id: 'a-t1',
				source: 'agent',
				target: 'tool1',
				type: 'particle',
				data: { tone: 'found', particles: 3, duration: 3 },
			},
			{
				id: 'a-t2',
				source: 'agent',
				target: 'tool2',
				type: 'particle',
				data: { tone: 'found', particles: 3, duration: 3 },
			},
			// Feedback loops
			{
				id: 'a1-fb',
				source: 'action1',
				target: 'agent',
				type: 'particle',
				data: { tone: 'con', particles: 2, duration: 4 },
			},
			{
				id: 'a2-fb',
				source: 'action2',
				target: 'agent',
				type: 'particle',
				data: { tone: 'con', particles: 2, duration: 4 },
			},
			{
				id: 'm-fb',
				source: 'model',
				target: 'agent',
				type: 'particle',
				data: { tone: 'found', particles: 2, duration: 3.5 },
			},
		],
		[],
	)

	const [nodes, , onNodesChange] = useNodesState(initialNodes)
	const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

	const onConnect = useCallback((params: Connection) => setEdges(eds => addEdge(params, eds)), [setEdges])

	return (
		<div style={{ width: '100%', height: 560 }}>
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
				<Background gap={40} size={1} color="var(--color-line)" />
				<Controls showZoom={false} showFitView={false} showInteractive={false} style={{ display: 'none' }} />
			</ReactFlow>
		</div>
	)
}
