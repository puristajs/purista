const corePrimaryNavLinks = [
	{ href: '/', label: 'Explore', key: 'home' },
	{ href: '/enterprise/', label: 'Enterprise', key: 'enterprise' },
	{ href: '/framework/', label: 'Framework', key: 'framework' },
	{ href: '/harness/', label: 'AI Harness', key: 'harness' },
	{ href: '/handbook/', label: 'Handbook', key: 'handbook' },
] as const

const tutorialsPrimaryNavLink = { href: '/tutorials/', label: 'Tutorials', key: 'tutorials' } as const

/**
 * The Tutorials link is content-driven: the shell never advertises an empty
 * section before a published Tutorials index page creates its public route.
 */
export function getPrimaryNavLinks(tutorialsAvailable: boolean) {
	return tutorialsAvailable
		? [...corePrimaryNavLinks, tutorialsPrimaryNavLink]
		: corePrimaryNavLinks
}

export type PrimaryNavKey =
	| (typeof corePrimaryNavLinks)[number]['key']
	| typeof tutorialsPrimaryNavLink.key

export const harnessNavLinks = [
	{ href: '/harness/', label: 'Overview' },
	{ href: '/harness/architecture/', label: 'Architecture' },
	{ href: '/handbook/harness/ecosystem-packages/', label: 'Packages' },
	{ href: '/harness/guardrails/', label: 'Guardrails' },
	{ href: '/harness/security/', label: 'Production' },
	{ href: '/harness/use-cases/', label: 'Use Cases' },
	{ href: '/handbook/harness/', label: 'Implementation Guide' },
] as const
