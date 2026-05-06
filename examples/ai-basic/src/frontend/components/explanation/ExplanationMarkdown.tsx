'use client'

import { CheckIcon, CopyIcon } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { codeToHtml } from 'shiki'
import { Button } from '@/components/ui/button'
import type { Theme } from '@/lib/app-state'
import { cn } from '@/lib/utils'
import { MessageResponse } from '../ai-elements/message'

type ExplanationMarkdownProps = {
	children: string
	theme: Theme
}

type MarkdownSegment =
	| {
			type: 'markdown'
			content: string
			key: string
	  }
	| {
			type: 'code'
			content: string
			language: string
			key: string
	  }

const splitMarkdownIntoSegments = (markdown: string): MarkdownSegment[] => {
	const segments: MarkdownSegment[] = []
	const fencePattern = /```([a-zA-Z0-9_-]+)?\n([\s\S]*?)```/g
	let lastIndex = 0

	for (const match of markdown.matchAll(fencePattern)) {
		const index = match.index ?? 0
		if (index > lastIndex) {
			segments.push({
				type: 'markdown',
				content: markdown.slice(lastIndex, index),
				key: `markdown-${lastIndex}`,
			})
		}

		segments.push({
			type: 'code',
			content: match[2] ?? '',
			language: (match[1] ?? 'text').toLowerCase(),
			key: `code-${index}-${match[1] ?? 'text'}`,
		})

		lastIndex = index + match[0].length
	}

	if (lastIndex < markdown.length) {
		segments.push({
			type: 'markdown',
			content: markdown.slice(lastIndex),
			key: `markdown-${lastIndex}`,
		})
	}

	return segments.filter(segment => segment.content.trim().length > 0)
}

const ExplanationCodeBlock = ({ code, language, theme }: { code: string; language: string; theme: Theme }) => {
	const [html, setHtml] = useState<string>('')
	const [copied, setCopied] = useState(false)

	useEffect(() => {
		let active = true

		codeToHtml(code.trimEnd(), {
			lang: language || 'text',
			theme: theme === 'dark' ? 'github-dark' : 'github-light',
		})
			.then(result => {
				if (active) {
					setHtml(result)
				}
			})
			.catch(() => {
				if (active) {
					setHtml('')
				}
			})

		return () => {
			active = false
		}
	}, [code, language, theme])

	return (
		<div className="explanation-code not-prose my-6">
			<div className="flex items-center justify-between gap-3 border-b border-border/60 px-4 py-3">
				<span className="text-[11px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
					{language || 'text'}
				</span>
				<Button
					aria-label={copied ? 'Copied code' : 'Copy code'}
					className="h-8 rounded-md border-border/60 px-2.5 text-muted-foreground hover:text-foreground"
					onClick={async () => {
						await navigator.clipboard.writeText(code.trimEnd())
						setCopied(true)
						window.setTimeout(() => setCopied(false), 1200)
					}}
					size="sm"
					type="button"
					variant="ghost"
				>
					{copied ? <CheckIcon className="size-4" /> : <CopyIcon className="size-4" />}
				</Button>
			</div>
			<div className="overflow-x-auto px-5 py-4">
				{html ? (
					/* biome-ignore lint/security/noDangerouslySetInnerHtml: Shiki generates trusted local HTML for static explanation snippets. */
					<div dangerouslySetInnerHTML={{ __html: html }} />
				) : (
					<pre className="m-0 overflow-visible bg-transparent p-0 text-[13px] leading-6">
						<code>{code.trimEnd()}</code>
					</pre>
				)}
			</div>
		</div>
	)
}

export const ExplanationMarkdown = ({ children, theme }: ExplanationMarkdownProps) => {
	const segments = useMemo(() => splitMarkdownIntoSegments(children), [children])

	return (
		<div className="space-y-0">
			{segments.map((segment, index) => {
				if (segment.type === 'markdown') {
					return (
						<MessageResponse
							animated={false}
							className={cn('markdown-body explanation-markdown', index > 0 ? 'mt-0' : '')}
							controls={{ code: false, mermaid: false, table: false }}
							key={segment.key}
							mode="static"
							shikiTheme={['github-light', 'github-dark']}
						>
							{segment.content}
						</MessageResponse>
					)
				}

				if (segment.language === 'mermaid') {
					return (
						<MessageResponse
							animated={false}
							className="markdown-body explanation-markdown"
							controls={{ code: false, mermaid: false, table: false }}
							key={segment.key}
							mode="static"
							shikiTheme={['github-light', 'github-dark']}
						>
							{`\`\`\`${segment.language}\n${segment.content}\n\`\`\``}
						</MessageResponse>
					)
				}

				return (
					<ExplanationCodeBlock code={segment.content} key={segment.key} language={segment.language} theme={theme} />
				)
			})}
		</div>
	)
}
