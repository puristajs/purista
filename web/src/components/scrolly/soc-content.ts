export interface SocStep {
	id: string
	tag: string
	num: string
	color: 'pilot' | 'con' | 'found'
	title: string
	highlight: string
	lede: string
	bullets: string[]
}

export const socSteps: SocStep[] = [
	{
		id: 'problem',
		tag: 'The Problem',
		num: '01 / 06',
		color: 'con',
		title: 'Everything mixed together creates',
		highlight: 'hidden cost',
		lede: 'When business logic, infrastructure, data access, and compliance rules live in the same file, changing one thing ripples everywhere. Your email provider upgrade becomes a refactor. Your compliance audit becomes an archaeology project.',
		bullets: [
			'One change touches HTTP handlers, database queries, and business rules',
			'PII leaks across boundaries because there are no boundaries',
			'Teams block each other on the same files',
			'Approval requires understanding the entire stack',
			'AI-generated code is impossible to review safely',
		],
	},
	{
		id: 'onestep',
		tag: 'The Mapping',
		num: '02 / 06',
		color: 'pilot',
		title: 'One business step maps to',
		highlight: 'one isolated piece',
		lede: 'In PURISTA, every real-world business step becomes exactly one isolated implementation. A user signs up? That is a command. A welcome email needs sending? That is a subscription listening for the signup event. Each has one reason to exist.',
		bullets: [
			'Commands handle synchronous actions with clear input and output',
			'Subscriptions react to events without the producer knowing they exist',
			'Streams handle multi-frame real-time workloads',
			'Queue workers process background jobs with retry logic',
			'Each maps 1:1 to a business concept your team already understands',
		],
	},
	{
		id: 'data',
		tag: 'Data Control',
		num: '03 / 06',
		color: 'found',
		title: 'Data stays where it',
		highlight: 'belongs',
		lede: 'PII never leaks across service boundaries. Privacy requirements, legal holds, GDPR requests, and data retention policies map directly to service ownership. Audit a single service and you know exactly who touched what data — no tracing through layers of mixed code.',
		bullets: [
			'User data lives in the User service and nowhere else',
			'Only events and contracts cross service boundaries',
			'Compliance boundaries are explicit in code, not in documentation',
			'Legal changes affect one service, not the whole codebase',
			'Data residency and classification are enforceable by design',
		],
	},
	{
		id: 'scale',
		tag: 'Scaling',
		num: '04 / 06',
		color: 'pilot',
		title: 'Scale teams, developers, and',
		highlight: 'AI agents',
		lede: 'Different teams own different services without merge conflicts. AI agents generate code for isolated commands without understanding the whole system. You add capacity to the signup command independently from the email subscription. Separation is scaling.',
		bullets: [
			'Teams work in parallel on independent services',
			'AI generates focused, reviewable code blocks',
			'Add instances to one service without touching others',
			'Onboard developers to a single service, not the monolith',
			'Replace a service entirely without system-wide rewrites',
		],
	},
	{
		id: 'audit',
		tag: 'Approval',
		num: '05 / 06',
		color: 'found',
		title: 'Audit and approve in',
		highlight: 'minutes',
		lede: 'Approvers review one small, specific thing — not a 500-line file that touches HTTP, database, and business rules. Audit trails show exactly which service touched which data. Compliance becomes verification, not investigation.',
		bullets: [
			'Small, focused changes are fast to review and approve',
			'Security reviews data flow at service boundaries',
			'Compliance verifies audit trails per service',
			'Architecture reviews ownership, not implementation details',
			'Platform reviews integration contracts, not internals',
		],
	},
	{
		id: 'swap',
		tag: 'Maintenance',
		num: '06 / 06',
		color: 'pilot',
		title: 'Swap any part, keep',
		highlight: 'everything else',
		lede: 'Change the email provider and only the email subscription changes. Upgrade the database and only the resource adapter changes. Your business logic stays identical. Maintenance becomes surgical, not structural.',
		bullets: [
			'Replace infrastructure without touching business logic',
			'Swap cloud providers by changing adapters, not services',
			'Upgrade frameworks in isolation per service',
			'Test one service without spinning up the whole stack',
			'Migrate gradually, service by service',
		],
	},
]
