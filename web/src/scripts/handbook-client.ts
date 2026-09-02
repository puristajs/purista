// Client-side transformations for handbook pages
// Runs after page load to enhance markdown-rendered content

function parseMeta(meta: string): { title?: string; tag?: string } {
	const result: { title?: string; tag?: string } = {}
	// Extract title from [Title] syntax: ```typescript [filename.ts]
	const bracketMatch = meta.match(/\[(.*?)\]/)
	if (bracketMatch) result.title = bracketMatch[1]
	// Fallback to explicit title="..." syntax
	const titleMatch = meta.match(/title=["']([^"']+)["']/)
	if (titleMatch && !result.title) result.title = titleMatch[1]
	const tagMatch = meta.match(/tag=["']([^"']+)["']/)
	if (tagMatch) result.tag = tagMatch[1]
	return result
}

function wrapCodeWindows() {
	const pres = document.querySelectorAll<HTMLPreElement>('.prose pre:not([data-wrapped])')

	pres.forEach(pre => {
		// Skip mermaid blocks (handled separately)
		if (pre.dataset.language === 'mermaid') return

		const lang = pre.dataset.language || 'text'
		const meta = pre.dataset.meta || ''
		const { title } = parseMeta(meta)
		const displayTitle = title || `snippet.${lang}`

		// Count lines for the --code-lines CSS variable (prefer Shiki .line spans)
		const codeEl = pre.querySelector('code')
		const lineSpans = pre.querySelectorAll('.line')
		const rawLines = lineSpans.length > 0
			? lineSpans.length
			: (codeEl?.textContent?.split('\n').length ?? 1)
		const lineCount = Math.min(Math.max(rawLines, 6), 28)

		// Build the figure — same structure as CodeBlock.astro
		const figure = document.createElement('figure')
		figure.className = 'codeblock'
		figure.style.setProperty('--code-lines', String(lineCount))

		const header = document.createElement('header')
		header.className = 'codeblock-header'
		header.innerHTML = `
      <div class="codeblock-dots" aria-hidden="true">
        <span></span><span></span><span></span>
      </div>
      <span class="codeblock-title">${displayTitle}</span>
      <span class="codeblock-lang">${lang}</span>
      <button class="codeblock-copy" aria-label="Copy code" title="Copy to clipboard">
        <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="codeblock-copy-icon">
          <rect x="5.5" y="5.5" width="8" height="8" rx="1.25" stroke="currentColor" stroke-width="1.25"/>
          <path d="M10.5 5.5V3.75A1.75 1.75 0 0 0 8.75 2H3.75A1.75 1.75 0 0 0 2 3.75v5A1.75 1.75 0 0 0 3.75 10.5H5.5" stroke="currentColor" stroke-width="1.25" stroke-linecap="round"/>
        </svg>
      </button>
    `

		const body = document.createElement('div')
		body.className = 'codeblock-body'

		// Mark the pre so .prose pre styles don't double-apply
		pre.classList.add('codeblock-pre')
		pre.dataset.wrapped = 'true'

		// Insert figure at pre's current position, then move pre inside
		pre.parentNode!.insertBefore(figure, pre)
		figure.appendChild(header)
		figure.appendChild(body)
		body.appendChild(pre)

		// Wire copy button — same behaviour as CodeBlock.astro
		const copyBtn = header.querySelector<HTMLButtonElement>('.codeblock-copy')!
		copyBtn.addEventListener('click', async () => {
			try {
				await navigator.clipboard.writeText(codeEl?.textContent ?? '')
				const icon = copyBtn.querySelector<SVGElement>('.codeblock-copy-icon')
				if (icon) {
					const prev = icon.innerHTML
					icon.innerHTML =
						'<path d="M2.5 8.5l3.5 3.5 7-8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>'
					copyBtn.style.color = 'var(--color-pilot)'
					setTimeout(() => {
						icon.innerHTML = prev
						copyBtn.style.color = ''
					}, 2000)
				}
			} catch {
				// clipboard not available — silently ignore
			}
		})
	})
}

function getCssVar(name: string): string {
	const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
	// If the value is a hex or rgba, return it directly
	if (value.startsWith('#') || value.startsWith('rgb') || value.startsWith('hsl')) {
		return value
	}
	// If it's a raw hex without # (Shiki sometimes outputs this), add it
	if (/^[0-9a-fA-F]{6}$/.test(value)) {
		return `#${value}`
	}
	// Fallback: create a temporary element to resolve the color
	const el = document.createElement('div')
	el.style.color = `var(${name})`
	el.style.display = 'none'
	document.body.appendChild(el)
	const computed = getComputedStyle(el).color
	document.body.removeChild(el)
	return computed
}

function getMermaidThemeOptions() {
	const isDark = document.documentElement.dataset.theme === 'dark'
	if (isDark) {
		return {
			bg: '#0F0F12',
			fg: '#E8E8EC',
			line: 'rgba(255,255,255,0.14)',
			accent: '#60A5FA',
			muted: '#71717A',
			surface: '#1A1A1E',
			border: 'rgba(255,255,255,0.14)',
			transparent: true,
		}
	}
	return {
		bg: '#F2F2F5',
		fg: '#1A1A1E',
		line: 'rgba(0,0,0,0.14)',
		accent: '#2563EB',
		muted: '#8B8B92',
		surface: '#FFFFFF',
		border: 'rgba(0,0,0,0.14)',
		transparent: true,
	}
}

function initMermaidZoomPan(container: HTMLElement, content: HTMLElement) {
	let scale = 1
	let tx = 0
	let ty = 0
	let isDragging = false
	let lastX = 0,
		lastY = 0

	function applyTransform() {
		content.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`
	}

	const zoomIn = container.querySelector('[data-mermaid-zoom="in"]')
	const zoomOut = container.querySelector('[data-mermaid-zoom="out"]')
	const resetBtn = container.querySelector('[data-mermaid-reset]')
	const fullscreenBtn = container.querySelector('[data-mermaid-fullscreen]')
	const viewport = container.querySelector('[data-mermaid-viewport]') as HTMLElement

	zoomIn?.addEventListener('click', () => {
		scale = Math.min(scale + 0.25, 3)
		applyTransform()
	})
	zoomOut?.addEventListener('click', () => {
		scale = Math.max(scale - 0.25, 0.5)
		applyTransform()
	})
	resetBtn?.addEventListener('click', () => {
		scale = 1
		tx = 0
		ty = 0
		applyTransform()
	})
	fullscreenBtn?.addEventListener('click', () => {
		if (document.fullscreenElement) {
			document.exitFullscreen()
		} else {
			container.requestFullscreen()
		}
	})

	// Reset zoom when entering fullscreen so the diagram fills the screen
	container.addEventListener('fullscreenchange', () => {
		if (document.fullscreenElement === container) {
			scale = 1
			tx = 0
			ty = 0
			applyTransform()
		}
	})

	if (viewport) {
		viewport.addEventListener('mousedown', e => {
			if ((e.target as HTMLElement).closest('.mermaid-controls')) return
			isDragging = true
			lastX = e.clientX
			lastY = e.clientY
			viewport.classList.add('dragging')
			e.preventDefault()
		})
		window.addEventListener('mouseup', () => {
			if (!isDragging) return
			isDragging = false
			viewport.classList.remove('dragging')
		})
		window.addEventListener('mousemove', e => {
			if (!isDragging) return
			e.preventDefault()
			const dx = e.clientX - lastX
			const dy = e.clientY - lastY
			lastX = e.clientX
			lastY = e.clientY
			tx += dx
			ty += dy
			applyTransform()
		})
		viewport.addEventListener(
			'touchstart',
			e => {
				if (e.touches.length === 1) {
					const touch = e.touches[0]
					if ((touch.target as HTMLElement).closest('.mermaid-controls')) return
					isDragging = true
					lastX = touch.clientX
					lastY = touch.clientY
					viewport.classList.add('dragging')
					e.preventDefault()
				}
			},
			{ passive: false },
		)
		window.addEventListener('touchend', () => {
			if (!isDragging) return
			isDragging = false
			viewport.classList.remove('dragging')
		})
		window.addEventListener(
			'touchmove',
			e => {
				if (!isDragging || e.touches.length !== 1) return
				const touch = e.touches[0]
				const dx = touch.clientX - lastX
				const dy = touch.clientY - lastY
				lastX = touch.clientX
				lastY = touch.clientY
				tx += dx
				ty += dy
				applyTransform()
				e.preventDefault()
			},
			{ passive: false },
		)
	}
}

// Store original mermaid source code so we can re-render on theme change
const mermaidSources = new Map<HTMLElement, string>()

async function renderMermaidBlocks() {
	const blocks = document.querySelectorAll<HTMLPreElement>('pre[data-language="mermaid"]')
	if (blocks.length === 0) return

	const { renderMermaidSVG } = await import('beautiful-mermaid')
	const themeOpts = getMermaidThemeOptions()

	blocks.forEach(pre => {
		const codeEl = pre.querySelector('code')
		if (!codeEl) return
		const code = codeEl.textContent || ''

		try {
			const svg = renderMermaidSVG(code.trim(), themeOpts)
			const { title } = parseMeta(pre.dataset.meta || '')

			// Build zoom/pan wrapper
			const wrapper = document.createElement('div')
			wrapper.className = 'mermaid-wrapper'

			if (title) {
				const caption = document.createElement('div')
				caption.className = 'mermaid-caption'
				caption.textContent = title
				wrapper.appendChild(caption)
			}

			const controls = document.createElement('div')
			controls.className = 'mermaid-controls'
			controls.innerHTML = `
        <button class="mermaid-btn" data-mermaid-zoom="out" aria-label="Zoom out" title="Zoom out">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3.5 h-3.5"><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </button>
        <button class="mermaid-btn" data-mermaid-zoom="in" aria-label="Zoom in" title="Zoom in">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3.5 h-3.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </button>
        <button class="mermaid-btn" data-mermaid-reset aria-label="Reset view" title="Reset view">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3.5 h-3.5"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
        </button>
        <button class="mermaid-btn" data-mermaid-fullscreen aria-label="Fullscreen" title="Fullscreen">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3.5 h-3.5"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
        </button>
      `

			const viewport = document.createElement('div')
			viewport.className = 'mermaid-viewport'
			viewport.dataset.mermaidViewport = ''

			const content = document.createElement('div')
			content.className = 'mermaid-content'
			content.dataset.mermaidContent = ''
			content.innerHTML = svg

			viewport.appendChild(content)
			wrapper.appendChild(controls)
			wrapper.appendChild(viewport)
			pre.replaceWith(wrapper)

			mermaidSources.set(wrapper, code.trim())
			initMermaidZoomPan(wrapper, content)
		} catch (err) {
			console.error('Mermaid render error:', err)
			const errorDiv = document.createElement('div')
			errorDiv.className = 'mermaid-error'
			const title = document.createElement('div')
			title.style.fontWeight = '600'
			title.style.marginBottom = '0.5rem'
			title.textContent = 'Mermaid Error'

			const message = document.createElement('div')
			message.style.opacity = '0.8'
			message.textContent = err instanceof Error ? err.message : 'Failed to render diagram'

			errorDiv.append(title, message)
			pre.before(errorDiv)
		}
	})
}

// Re-render mermaid diagrams when theme changes
function observeThemeChanges() {
	const observer = new MutationObserver(mutations => {
		for (const mutation of mutations) {
			if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
				reRenderMermaidBlocks()
				break
			}
		}
	})
	observer.observe(document.documentElement, { attributes: true })
}

async function reRenderMermaidBlocks() {
	const { renderMermaidSVG } = await import('beautiful-mermaid')
	const themeOpts = getMermaidThemeOptions()

	mermaidSources.forEach((code, wrapper) => {
		if (!wrapper.isConnected) {
			mermaidSources.delete(wrapper)
			return
		}
		try {
			const svg = renderMermaidSVG(code, themeOpts)
			const content = wrapper.querySelector('[data-mermaid-content]') as HTMLElement
			if (content) {
				content.innerHTML = svg
			}
		} catch (err) {
			console.error('Mermaid re-render error:', err)
		}
	})
}

// Run transformations
wrapCodeWindows()
renderMermaidBlocks()
observeThemeChanges()
