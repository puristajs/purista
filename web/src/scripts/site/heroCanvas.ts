/**
 * PURISTA site — hero WebGL scene
 *
 * A constellation field that responds to scroll + pointer.
 *
 * - Layered point clouds in three colors (found/con/pilot accent system)
 *   drifting through space with depth-fog.
 * - Pointer parallax tilts the whole scene; scroll progress shifts it
 *   downward so the constellation feels "left behind" as you scroll.
 *
 * The canvas is registered against an element marked [data-hero-canvas].
 * Idempotent across Astro page transitions.
 */

import * as THREE from 'three'

interface HeroSceneState {
	destroy: () => void
}

declare global {
	interface Window {
		__siteHeroScene?: HeroSceneState
	}
}

const ACCENTS = [
	{ hexDark: 0x60a5fa, hexLight: 0x2563eb, count: 1400 }, // found
	{ hexDark: 0xc084fc, hexLight: 0x7c3aed, count: 900 }, // con
	{ hexDark: 0x34d399, hexLight: 0x059669, count: 700 }, // pilot
]

function isDarkTheme() {
	return document.documentElement.dataset.theme !== 'light'
}

function getBgColor() {
	return isDarkTheme() ? 0x08080b : 0xfafafa
}

function getGridColor() {
	return isDarkTheme() ? 0x202028 : 0xe8e8ec
}

function getGridMainColor() {
	return isDarkTheme() ? 0x60a5fa : 0x2563eb
}

function build(container: HTMLElement) {
	const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

	const renderer = new THREE.WebGLRenderer({
		antialias: false,
		alpha: true,
		powerPreference: 'high-performance',
	})
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

	function size() {
		return {
			w: container.clientWidth || window.innerWidth,
			h: container.clientHeight || window.innerHeight,
		}
	}

	const { w, h } = size()
	renderer.setSize(w, h, false)
	renderer.domElement.style.width = '100%'
	renderer.domElement.style.height = '100%'
	renderer.domElement.style.display = 'block'
	container.appendChild(renderer.domElement)

	const scene = new THREE.Scene()
	scene.fog = new THREE.FogExp2(getBgColor(), 0.018)

	const camera = new THREE.PerspectiveCamera(55, w / h, 1, 4000)
	camera.position.set(0, 0, 130)

	// Particle clouds
	const groups: Array<{ points: THREE.Points; baseY: Float32Array; accentIndex: number }> = []

	function rebuildParticles() {
		groups.forEach(g => {
			g.points.geometry.dispose()
			;(g.points.material as THREE.Material).dispose()
			scene.remove(g.points)
		})
		groups.length = 0

		for (let ai = 0; ai < ACCENTS.length; ai++) {
			const accent = ACCENTS[ai]
			const positions = new Float32Array(accent.count * 3)
			const baseY = new Float32Array(accent.count)
			for (let i = 0; i < accent.count; i++) {
				const x = (Math.random() - 0.5) * 360
				const y = (Math.random() - 0.5) * 220
				const z = (Math.random() - 0.5) * 320 - 60
				positions[i * 3] = x
				positions[i * 3 + 1] = y
				positions[i * 3 + 2] = z
				baseY[i] = y
			}
			const geom = new THREE.BufferGeometry()
			geom.setAttribute('position', new THREE.BufferAttribute(positions, 3))

			const mat = new THREE.PointsMaterial({
				color: isDarkTheme() ? accent.hexDark : accent.hexLight,
				size: isDarkTheme() ? 1.4 : 1.8,
				sizeAttenuation: true,
				transparent: true,
				opacity: isDarkTheme() ? 0.85 : 0.55,
				depthWrite: false,
				blending: isDarkTheme() ? THREE.AdditiveBlending : THREE.NormalBlending,
			})

			const points = new THREE.Points(geom, mat)
			scene.add(points)
			groups.push({ points, baseY, accentIndex: ai })
		}
	}

	rebuildParticles()

	// Structural grid plane far behind
	const gridSize = 1000
	let grid = new THREE.GridHelper(gridSize, 60, getGridMainColor(), getGridColor())
	;(grid.material as THREE.Material).transparent = true
	;(grid.material as THREE.Material).opacity = isDarkTheme() ? 0.07 : 0.12
	grid.position.y = -120
	grid.rotation.x = 0
	scene.add(grid)

	// Pointer / scroll state
	let targetTiltX = 0
	let targetTiltY = 0
	let tiltX = 0
	let tiltY = 0
	let scrollOffset = 0

	function onPointer(e: PointerEvent) {
		const rect = container.getBoundingClientRect()
		targetTiltX = ((e.clientX - rect.left) / rect.width - 0.5) * 0.4
		targetTiltY = ((e.clientY - rect.top) / rect.height - 0.5) * 0.25
	}
	function onScroll() {
		scrollOffset = window.scrollY
	}
	function onResize() {
		const { w, h } = size()
		renderer.setSize(w, h, false)
		camera.aspect = w / h
		camera.updateProjectionMatrix()
	}

	function onThemeChange() {
		scene.fog = new THREE.FogExp2(getBgColor(), 0.018)
		rebuildParticles()
		scene.remove(grid)
		grid.geometry.dispose()
		;(grid.material as THREE.Material).dispose()
		grid = new THREE.GridHelper(gridSize, 60, getGridMainColor(), getGridColor())
		;(grid.material as THREE.Material).transparent = true
		;(grid.material as THREE.Material).opacity = isDarkTheme() ? 0.07 : 0.12
		grid.position.y = -120
		grid.rotation.x = 0
		scene.add(grid)
	}

	window.addEventListener('pointermove', onPointer, { passive: true })
	window.addEventListener('scroll', onScroll, { passive: true })
	window.addEventListener('resize', onResize)
	window.addEventListener('purista-theme-change', onThemeChange)

	let frame = 0
	let rafId = 0
	const start = performance.now()

	function animate() {
		const now = performance.now()
		const t = (now - start) * 0.0006
		frame++

		tiltX += (targetTiltX - tiltX) * 0.06
		tiltY += (targetTiltY - tiltY) * 0.06

		const scrollY = Math.min(scrollOffset / window.innerHeight, 1.4)

		camera.position.x = tiltX * 30
		camera.position.y = -tiltY * 20 - scrollY * 60
		camera.lookAt(0, 0, 0)

		groups.forEach((g, idx) => {
			g.points.rotation.y = t * (0.04 + idx * 0.015)
			g.points.rotation.x = Math.sin(t * 0.4) * 0.05
			const positions = g.points.geometry.attributes.position.array as Float32Array
			// Subtle wave on Y over time so the field feels alive.
			// Only update a slice per frame for perf.
			const step = 6
			const offset = frame % step
			for (let i = offset; i < g.baseY.length; i += step) {
				positions[i * 3 + 1] = g.baseY[i] + Math.sin(t * 1.4 + g.baseY[i] * 0.04 + idx) * 4
			}
			g.points.geometry.attributes.position.needsUpdate = true
		})

		grid.position.z = ((t * 30) % 60) - 60

		renderer.render(scene, camera)
		rafId = requestAnimationFrame(animate)
	}
	if (prefersReducedMotion) {
		renderer.render(scene, camera)
	} else {
		rafId = requestAnimationFrame(animate)
	}

	function destroy() {
		cancelAnimationFrame(rafId)
		window.removeEventListener('pointermove', onPointer)
		window.removeEventListener('scroll', onScroll)
		window.removeEventListener('resize', onResize)
		window.removeEventListener('purista-theme-change', onThemeChange)
		groups.forEach(g => {
			g.points.geometry.dispose()
			;(g.points.material as THREE.Material).dispose()
		})
		grid.geometry.dispose()
		;(grid.material as THREE.Material).dispose()
		renderer.dispose()
		renderer.domElement.remove()
	}
	return { destroy }
}

function init() {
	const container = document.querySelector<HTMLElement>('[data-hero-canvas]')
	if (!container) return

	if (window.__siteHeroScene) {
		window.__siteHeroScene.destroy()
	}
	window.__siteHeroScene = build(container)
}

init()
document.addEventListener('astro:page-load', () => init())
