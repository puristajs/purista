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
	{ href: '/harness/get-started/', label: 'Get Started' },
	{ href: '/harness/architecture/', label: 'Architecture' },
	{ href: '/harness/use-cases/', label: 'Use Cases' },
	{ href: '/harness/memory/', label: 'Memory' },
	{ href: '/harness/evaluations/', label: 'Evaluations' },
	{ href: '/harness/testing/', label: 'Testing' },
	{ href: '/harness/observability/', label: 'Observability' },
	{ href: '/harness/security/', label: 'Security' },
] as const
