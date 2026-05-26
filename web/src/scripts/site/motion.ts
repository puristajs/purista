/**
 * PURISTA site — motion bootstrap
 *
 * Wires Lenis smooth scroll, GSAP ScrollTrigger sync, the scroll progress bar,
 * headline word reveals, magnetic CTAs, and per-card pointer tracking. Imported
 * once from SiteLayout.astro and idempotent so Astro page transitions don't
 * double-bind.
 */

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

declare global {
	interface Window {
		__siteMotion?: SiteMotionInstance
	}
}

interface SiteMotionInstance {
	lenis: Lenis
	destroy: () => void
}

const prefersReducedMotion =
	typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

function setupLenis(): Lenis {
	const lenis = new Lenis({
		duration: 1.15,
		easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
		smoothWheel: true,
		wheelMultiplier: 1,
		touchMultiplier: 1.4,
	})

	function raf(time: number) {
		lenis.raf(time)
		requestAnimationFrame(raf)
	}
	requestAnimationFrame(raf)

	lenis.on('scroll', () => ScrollTrigger.update())
	gsap.ticker.add(time => lenis.raf(time * 1000))
	gsap.ticker.lagSmoothing(0)

	return lenis
}

function setupProgress() {
	const bar = document.createElement('div')
	bar.className = 'site-progress'
	document.body.appendChild(bar)

	function update() {
		const max = document.documentElement.scrollHeight - window.innerHeight
		const ratio = max <= 0 ? 0 : Math.min(1, Math.max(0, window.scrollY / max))
		bar.style.setProperty('--site-progress', ratio.toString())
	}
	window.addEventListener('scroll', update, { passive: true })
	window.addEventListener('resize', update)
	update()

	return () => {
		bar.remove()
		window.removeEventListener('scroll', update)
		window.removeEventListener('resize', update)
	}
}

function setupNavScroll() {
	const nav = document.querySelector<HTMLElement>('.site-nav')
	if (!nav) return () => {}
	function update() {
		if (window.scrollY > 12) nav.classList.add('is-scrolled')
		else nav.classList.remove('is-scrolled')
	}
	window.addEventListener('scroll', update, { passive: true })
	update()
	return () => window.removeEventListener('scroll', update)
}

function setupWordReveal() {
	const targets = document.querySelectorAll<HTMLElement>('[data-site-split]')
	targets.forEach(el => {
		if (el.dataset.siteSplitDone === '1') return
		// Skip elements that depend on a parent text-clipped background (shimmer).
		// Splitting them into nested spans would break -webkit-background-clip: text.
		if (el.classList.contains('site-shimmer')) {
			el.dataset.siteSplitDone = '1'
			return
		}
		el.dataset.siteSplitDone = '1'
		const text = el.textContent ?? ''
		el.textContent = ''
		const words = text.split(/(\s+)/)
		let i = 0
		for (const w of words) {
			if (/^\s+$/.test(w)) {
				el.appendChild(document.createTextNode(w))
				continue
			}
			const word = document.createElement('span')
			word.className = 'site-word'
			const inner = document.createElement('span')
			inner.className = 'site-word-inner'
			inner.style.setProperty('--site-word-delay', `${i * 50}ms`)
			// Initial hidden state set inline to ensure deterministic baseline
			// regardless of stylesheet load timing.
			inner.style.transform = 'translateY(110%)'
			inner.textContent = w
			word.appendChild(inner)
			el.appendChild(word)
			i++
		}
		el.classList.add('site-words')
	})

	const reveal = (el: Element) => {
		const inners = el.querySelectorAll<HTMLElement>('.site-word-inner')
		inners.forEach(inner => {
			const delayStr = inner.style.getPropertyValue('--site-word-delay').trim()
			const delayMs = delayStr ? Number.parseInt(delayStr, 10) : 0
			window.setTimeout(() => {
				// Inline transition keeps the value reliable in headless / paused tabs;
				// we drive the visual reveal with a Web Animation so the resting state
				// is also pinned in the inline style.
				inner.style.transform = 'translateY(0)'
				inner.classList.add('is-in')
				const anim = inner.animate([{ transform: 'translateY(110%)' }, { transform: 'translateY(0)' }], {
					duration: 900,
					easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
					fill: 'both',
				})
				// Force-finish the animation if it doesn't settle on its own within 2s.
				window.setTimeout(() => {
					if (anim.playState !== 'finished') anim.finish()
				}, 1200)
			}, delayMs)
		})
		el.classList.add('is-ready')
	}

	if (prefersReducedMotion) {
		document.querySelectorAll('.site-words').forEach(reveal)
		return () => {}
	}

	const io = new IntersectionObserver(
		entries => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					reveal(entry.target)
					io.unobserve(entry.target)
				}
			})
		},
		{ threshold: 0.15 },
	)
	document.querySelectorAll('.site-words').forEach(el => {
		io.observe(el)
	})
	return () => io.disconnect()
}

function setupReveal() {
	if (prefersReducedMotion) {
		document.querySelectorAll('.site-reveal').forEach(el => {
			el.classList.add('is-in')
		})
		return () => {}
	}
	const io = new IntersectionObserver(
		entries => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					entry.target.classList.add('is-in')
					io.unobserve(entry.target)
				}
			})
		},
		{ threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
	)
	document.querySelectorAll('.site-reveal').forEach(el => {
		io.observe(el)
	})
	return () => io.disconnect()
}

function setupCardPointer() {
	function onMove(e: PointerEvent) {
		const card = (e.target as HTMLElement).closest<HTMLElement>('.site-card')
		if (!card) return
		const rect = card.getBoundingClientRect()
		const mx = ((e.clientX - rect.left) / rect.width) * 100
		const my = ((e.clientY - rect.top) / rect.height) * 100
		card.style.setProperty('--mx', `${mx}%`)
		card.style.setProperty('--my', `${my}%`)
	}
	document.addEventListener('pointermove', onMove, { passive: true })
	return () => document.removeEventListener('pointermove', onMove)
}

function setupMagnetic() {
	if (prefersReducedMotion) return () => {}
	const els = document.querySelectorAll<HTMLElement>('[data-magnetic]')
	const cleanups: Array<() => void> = []
	els.forEach(el => {
		const strength = Number.parseFloat(el.dataset.magnetic || '0.25')
		function onMove(e: PointerEvent) {
			const rect = el.getBoundingClientRect()
			const dx = e.clientX - (rect.left + rect.width / 2)
			const dy = e.clientY - (rect.top + rect.height / 2)
			el.style.transform = `translate3d(${dx * strength}px, ${dy * strength}px, 0)`
		}
		function reset() {
			el.style.transform = ''
		}
		el.addEventListener('pointermove', onMove)
		el.addEventListener('pointerleave', reset)
		cleanups.push(() => {
			el.removeEventListener('pointermove', onMove)
			el.removeEventListener('pointerleave', reset)
		})
	})
	return () => {
		cleanups.forEach(c => {
			c()
		})
	}
}

function setupHeroParallax(lenis: Lenis) {
	const layers = document.querySelectorAll<HTMLElement>('[data-parallax]')
	if (layers.length === 0) return () => {}
	function update() {
		const y = window.scrollY
		layers.forEach(layer => {
			const speed = Number.parseFloat(layer.dataset.parallax || '0.2')
			layer.style.transform = `translate3d(0, ${y * speed}px, 0)`
		})
	}
	lenis.on('scroll', update)
	update()
	return () => {
		/* lenis removeListener API differs across versions; no-op for now */
	}
}

function setupAnchorSmooth(lenis: Lenis) {
	function onClick(e: MouseEvent) {
		const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]')
		if (!a) return
		const id = a.getAttribute('href')
		if (!id || id === '#') return
		const target = document.querySelector(id)
		if (!target) return
		e.preventDefault()
		lenis.scrollTo(target as HTMLElement, { offset: -80, duration: 1.2 })
	}
	document.addEventListener('click', onClick)
	return () => document.removeEventListener('click', onClick)
}

function setupScrollyPin() {
	const wraps = document.querySelectorAll<HTMLElement>('[data-scrolly]')
	const cleanups: Array<() => void> = []
	wraps.forEach(wrap => {
		const stages = wrap.querySelectorAll<HTMLElement>('[data-stage]')
		const frames = wrap.querySelectorAll<HTMLElement>('[data-stage-frame-key]')
		if (stages.length === 0) return
		const total = stages.length

		const trigger = ScrollTrigger.create({
			trigger: wrap,
			start: 'top top',
			end: `+=${total * 90}%`,
			pin: wrap.querySelector<HTMLElement>('[data-pin]') ?? undefined,
			pinSpacing: true,
			scrub: 0.4,
			onUpdate: self => {
				const idx = Math.min(total - 1, Math.floor(self.progress * total))
				let activeKey: string | null = null
				stages.forEach((s, i) => {
					const isActive = i === idx
					s.classList.toggle('is-active', isActive)
					if (isActive) activeKey = s.dataset.stageKey ?? null
				})
				frames.forEach(f => {
					f.classList.toggle('is-active', f.dataset.stageFrameKey === activeKey)
				})
				wrap.style.setProperty('--scrolly-progress', self.progress.toString())
			},
		})
		cleanups.push(() => trigger.kill())
	})
	return () => {
		cleanups.forEach(c => {
			c()
		})
	}
}

function setupVizScroll() {
	const containers = document.querySelectorAll<HTMLElement>('.site-viz-container')
	if (containers.length === 0) return () => {}

	const cleanups: Array<() => void> = []

	containers.forEach(container => {
		// Start hidden
		container.style.opacity = '0'
		container.style.transform = 'translateY(30px) scale(0.98)'
		container.style.transition = 'opacity 1s var(--site-ease-out), transform 1s var(--site-ease-out)'

		const trigger = ScrollTrigger.create({
			trigger: container,
			start: 'top 80%',
			once: true,
			onEnter: () => {
				container.style.opacity = '1'
				container.style.transform = 'translateY(0) scale(1)'
			},
		})
		cleanups.push(() => trigger.kill())
	})

	return () => {
		cleanups.forEach(c => {
			c()
		})
	}
}

function setupCounters() {
	const els = document.querySelectorAll<HTMLElement>('[data-count]')
	els.forEach(el => {
		const target = Number.parseFloat(el.dataset.count || '0')
		const suffix = el.dataset.countSuffix || ''
		const decimals = Number.parseInt(el.dataset.countDecimals || '0', 10)
		ScrollTrigger.create({
			trigger: el,
			start: 'top 85%',
			once: true,
			onEnter: () => {
				const obj = { v: 0 }
				gsap.to(obj, {
					v: target,
					duration: 1.6,
					ease: 'power2.out',
					onUpdate: () => {
						el.textContent = obj.v.toFixed(decimals) + suffix
					},
				})
			},
		})
	})
}

function init() {
	if (typeof window === 'undefined') return
	if (window.__siteMotion) {
		window.__siteMotion.destroy()
		delete window.__siteMotion
	}

	gsap.registerPlugin(ScrollTrigger)

	const lenis = setupLenis()

	const teardowns: Array<() => void> = [
		setupProgress(),
		setupNavScroll(),
		setupWordReveal(),
		setupReveal(),
		setupCardPointer(),
		setupMagnetic(),
		setupHeroParallax(lenis),
		setupAnchorSmooth(lenis),
		setupScrollyPin(),
		setupVizScroll(),
	]
	setupCounters()

	window.__siteMotion = {
		lenis,
		destroy() {
			teardowns.forEach(t => {
				t()
			})
			ScrollTrigger.getAll().forEach(t => {
				t.kill()
			})
			lenis.destroy()
		},
	}

	// Refresh after page is fully painted so pinned triggers measure correctly.
	requestAnimationFrame(() => ScrollTrigger.refresh())
	window.addEventListener('load', () => ScrollTrigger.refresh())
}

init()

document.addEventListener('astro:page-load', () => init())
