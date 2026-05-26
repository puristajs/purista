import { useEffect, useState } from 'react'

export default function ThemeToggle() {
	const [isDark, setIsDark] = useState(true)
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
		const stored = localStorage.getItem('purista-theme')
		const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
		const theme = stored ?? (prefersDark ? 'dark' : 'light')
		setIsDark(theme === 'dark')
		document.documentElement.dataset.theme = theme
	}, [])

	const toggleTheme = () => {
		const newTheme = isDark ? 'light' : 'dark'
		setIsDark(!isDark)
		document.documentElement.dataset.theme = newTheme
		localStorage.setItem('purista-theme', newTheme)
		window.dispatchEvent(new CustomEvent('purista-theme-change', { detail: { theme: newTheme } }))
	}

	if (!mounted) {
		return (
			<button className="icon-btn" aria-label="Toggle theme" style={{ width: 36, height: 36 }}>
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
					width={17}
					height={17}
				>
					<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
				</svg>
			</button>
		)
	}

	return (
		<button className="icon-btn" onClick={toggleTheme} aria-label="Toggle theme" title="Toggle theme">
			{isDark ? (
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
					width={17}
					height={17}
				>
					<circle cx="12" cy="12" r="4" />
					<path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
				</svg>
			) : (
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
					width={17}
					height={17}
				>
					<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
				</svg>
			)}
		</button>
	)
}
