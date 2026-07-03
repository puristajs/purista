export const harnessCanonicalRoutes = {
	adapters: {
		from: '/harness/adapters/',
		to: '/harness/architecture/',
		label: 'Architecture',
		description: 'Adapter content is now part of the architecture guide.',
	},
	'before-you-ship': {
		from: '/harness/before-you-ship/',
		to: '/harness/security/',
		label: 'Security & Production Readiness',
		description: 'The production readiness checklist is now part of the security guide.',
	},
	usage: {
		from: '/harness/usage/',
		to: '/harness/get-started/',
		label: 'Get Started',
		description: 'Usage guidance is now part of the get-started guide.',
	},
} as const

export type HarnessLegacyRoute = keyof typeof harnessCanonicalRoutes

export function getHarnessCanonicalPath(pathname: string) {
	const normalized = pathname.endsWith('/') ? pathname : `${pathname}/`
	const route = Object.values(harnessCanonicalRoutes).find(({ from }) => from === normalized)

	return route?.to ?? normalized
}
