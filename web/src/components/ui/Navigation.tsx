import { useEffect, useState } from 'react'
import ThemeToggle from './ThemeToggle'

const navLinks = [
	{ href: '/', label: 'Explore' },
	{ href: '/enterprise', label: 'Enterprise', activeMatch: '/enterprise' },
	{ href: '/framework', label: 'Framework', activeMatch: '/framework' },
	{ href: '/harness', label: 'AI Harness', activeMatch: '/harness' },
	{ href: '/handbook', label: 'Handbook', activeMatch: '/handbook' },
]

export default function Navigation() {
	const [activeSection, setActiveSection] = useState('')

	useEffect(() => {
		const path = window.location.pathname
		const match = navLinks.find(link => (link.activeMatch ? path.startsWith(link.activeMatch) : path === link.href))
		if (match) setActiveSection(match.href)
	}, [])

	return (
		<nav
			className="sticky top-0 z-50 w-full border-b border-[var(--color-line)] transition-all duration-240"
			style={{
				backdropFilter: 'blur(20px) saturate(140%)',
				WebkitBackdropFilter: 'blur(20px) saturate(140%)',
				background: 'color-mix(in srgb, var(--color-bg) 75%, transparent)',
			}}
		>
			<div
				className="flex items-center justify-between h-[68px] w-full"
				style={{
					paddingInline: 'var(--gutter)',
				}}
			>
				{/* Brand */}
				<a href="/" className="flex items-center gap-[0.7rem]">
					<div className="w-7 h-7 grid place-items-center bg-[var(--color-fg)] text-[var(--color-bg)] rounded-md font-display font-extrabold text-base tracking-tight relative">
						P
						<span
							className="absolute w-[6px] h-[6px] rounded-full bg-[var(--color-found)] shadow-[0_0_0_2px_var(--color-bg)]"
							style={{
								transform: 'translate(8px, -8px)',
								animation: 'markPulse 2.5s ease-in-out infinite',
							}}
						/>
					</div>
					<div className="font-display font-bold text-[1.05rem] tracking-tight">PURISTA</div>
				</a>

				{/* Nav Links */}
				<div className="hidden md:flex gap-[0.1rem] items-center">
					{navLinks.map(link => {
						const isActive = activeSection === link.href
						return (
							<a
								key={link.label}
								href={link.href}
								className={`px-[0.85rem] py-2 text-[0.92rem] font-medium rounded-lg transition-colors duration-180 ${
									isActive
										? 'text-[var(--color-found)] bg-[var(--color-bg-sunk)]'
										: 'text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] hover:bg-[var(--color-bg-sunk)]'
								}`}
							>
								{link.label}
							</a>
						)
					})}
				</div>

				{/* Actions */}
				<div className="flex gap-[0.4rem] items-center">
					<ThemeToggle />
					<a
						className="icon-btn"
						href="https://github.com/puristajs/purista"
						target="_blank"
						rel="noopener"
						aria-label="GitHub"
					>
						<svg viewBox="0 0 24 24" fill="currentColor" width={17} height={17}>
							<path d="M12 .3a12 12 0 0 0-3.79 23.4c.6.1.82-.26.82-.58v-2.17c-3.34.73-4.04-1.42-4.04-1.42-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.73.08-.73 1.21.08 1.85 1.24 1.85 1.24 1.07 1.84 2.81 1.31 3.5 1 .1-.78.42-1.31.76-1.61-2.67-.3-5.47-1.34-5.47-5.95 0-1.32.47-2.4 1.24-3.24-.13-.31-.54-1.55.12-3.23 0 0 1-.32 3.3 1.23a11.4 11.4 0 0 1 6 0c2.3-1.55 3.3-1.23 3.3-1.23.66 1.68.25 2.92.12 3.23.78.84 1.24 1.92 1.24 3.24 0 4.62-2.81 5.65-5.49 5.94.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.83.58A12 12 0 0 0 12 .3z" />
						</svg>
					</a>
				</div>
			</div>
		</nav>
	)
}
