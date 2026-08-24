export const primaryNavLinks = [
	{ href: '/', label: 'Explore', key: 'home' },
	{ href: '/enterprise/', label: 'Enterprise', key: 'enterprise' },
	{ href: '/framework/', label: 'Framework', key: 'framework' },
	{ href: '/harness/', label: 'AI Harness', key: 'harness' },
	{ href: '/handbook/', label: 'Handbook', key: 'handbook' },
] as const

export type PrimaryNavKey = (typeof primaryNavLinks)[number]['key']

export const harnessNavLinks = [
	{ href: '/harness/', label: 'Overview' },
	{ href: '/harness/architecture/', label: 'Architecture' },
	{ href: '/handbook/harness/ecosystem-packages/', label: 'Packages' },
	{ href: '/harness/guardrails/', label: 'Guardrails' },
	{ href: '/harness/security/', label: 'Production' },
	{ href: '/harness/use-cases/', label: 'Use Cases' },
	{ href: '/handbook/harness/', label: 'Implementation Guide' },
] as const
