/** Package managers supported by the project generator. */
export type PackageManager = 'npm' | 'bun' | 'pnpm' | 'yarn'

/** Normalized input used to plan and materialize a new PURISTA project. */
export type CreateProjectInput = {
	/** Target directory, relative to the current working directory unless already absolute. */
	target: string
	/** Package and README project name. */
	projectName: string
	/** JavaScript runtime used by generated scripts and test imports. */
	runtime: 'node' | 'bun'
	/** Event bridge blueprint to wire into the generated app. */
	eventBridge: 'default' | 'mqtt' | 'amqp' | 'nats' | 'dapr'
	/** Whether to generate Hono HTTP server wiring. */
	useWebserver: boolean
	/** File naming convention used for generated services and artifacts. */
	fileConvention: 'camel' | 'snake' | 'kebab' | 'pascal' | 'pascalSnake'
	/** Event naming convention used for generated event values. */
	eventConvention:
		| 'camel'
		| 'snake'
		| 'kebab'
		| 'pascal'
		| 'pascalSnake'
		| 'constantCase'
		| 'dotCase'
		| 'pathCase'
		| 'trainCase'
	/** Linter setup to generate. */
	linter: 'biome' | 'eslint' | 'none'
	/** Formatter setup recorded in `purista.json`. */
	formatter: 'biome' | 'prettier' | 'none'
	/** Node package module type. */
	type: 'module' | 'commonjs'
	/** Package manager used in generated documentation and install commands. */
	packageManager: PackageManager
	/** Whether init commands should install dependencies after writing files. */
	installDependencies: boolean
}
