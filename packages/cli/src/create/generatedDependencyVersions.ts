/** Canonical published ranges emitted into generated PURISTA projects. */
export const generatedDependencyVersions = Object.freeze({
	'@biomejs/biome': '^2.5.8',
	'@eslint/js': '^9.20.0',
	'@hono/node-server': '^2.1.0',
	'@purista/amqpbridge': '^4.0.0',
	'@purista/cli': '^4.0.0',
	'@purista/core': '^4.0.0',
	'@purista/dapr-sdk': '^4.0.0',
	'@purista/harness': '^4.0.0',
	'@purista/harness-ai-sdk-ui': '^4.0.0',
	'@purista/harness-openai': '^4.0.0',
	'@purista/hono-http-server': '^4.0.0',
	'@purista/mqttbridge': '^4.0.0',
	'@purista/natsbridge': '^4.0.0',
	'@scalar/hono-api-reference': '^0.11.13',
	'@types/bun': '^1.4.0',
	'@types/node': '^26.2.0',
	'@types/sinon': '^22.0.0',
	ai: '^7.0.0',
	eslint: '^9.20.1',
	globals: '^15.15.0',
	hono: '^4.13.1',
	sinon: '^22.1.0',
	tsx: '^4.23.12',
	typescript: 'npm:@typescript/typescript6@^6.0.2',
	'typescript-eslint': '^8.24.0',
	vitest: '^4.1.10',
	zod: '^4.4.3',
} as const)

/** Resolve one generated range without allowing an unversioned fallback. */
export const generatedDependencyVersion = (name: keyof typeof generatedDependencyVersions) =>
	generatedDependencyVersions[name]
