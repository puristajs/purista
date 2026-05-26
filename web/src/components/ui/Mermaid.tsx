import mermaid from 'mermaid'
import { useEffect, useRef, useState } from 'react'

interface MermaidProps {
	chart: string
	className?: string
}

export default function Mermaid({ chart, className = '' }: MermaidProps) {
	const containerRef = useRef<HTMLDivElement>(null)
	const [svg, setSvg] = useState<string>('')
	const [error, setError] = useState<string>('')

	useEffect(() => {
		const isDark = document.documentElement.dataset.theme === 'dark'

		mermaid.initialize({
			startOnLoad: false,
			theme: isDark ? 'dark' : 'default',
			themeVariables: isDark
				? {
						primaryColor: '#0F0F12',
						primaryTextColor: '#FAFAFA',
						primaryBorderColor: 'rgba(255,255,255,0.14)',
						lineColor: '#71717A',
						secondaryColor: '#050507',
						tertiaryColor: '#020203',
						fontFamily: "'JetBrains Mono', monospace",
						fontSize: '14px',
					}
				: {
						fontFamily: "'JetBrains Mono', monospace",
						fontSize: '14px',
					},
			flowchart: {
				useMaxWidth: true,
				htmlLabels: true,
				curve: 'basis',
			},
			sequence: {
				useMaxWidth: true,
			},
			gantt: {
				useMaxWidth: true,
			},
		})

		const render = async () => {
			if (!containerRef.current) return
			try {
				const id = `mermaid-${Math.random().toString(36).slice(2, 11)}`
				const { svg } = await mermaid.render(id, chart.trim())
				setSvg(svg)
				setError('')
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Failed to render diagram')
				console.error('Mermaid render error:', err)
			}
		}

		render()
	}, [chart])

	if (error) {
		return (
			<div
				className={`mermaid-error p-4 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 font-mono text-sm ${className}`}
			>
				<div className="font-semibold mb-1">Mermaid Error</div>
				<div>{error}</div>
			</div>
		)
	}

	return (
		<div
			ref={containerRef}
			className={`mermaid-diagram flex justify-center overflow-x-auto ${className}`}
			dangerouslySetInnerHTML={{ __html: svg }}
		/>
	)
}
