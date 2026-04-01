export type PackageManager = 'npm' | 'bun' | 'pnpm' | 'yarn'

export type CreateProjectInput = {
	target: string
	projectName: string
	runtime: 'node' | 'bun'
	eventBridge: 'default' | 'mqtt' | 'amqp' | 'nats' | 'dapr'
	useWebserver: boolean
	fileConvention: 'camel' | 'snake' | 'kebab' | 'pascal' | 'pascalSnake'
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
	linter: 'biome' | 'eslint' | 'none'
	formatter: 'biome' | 'prettier' | 'none'
	type: 'module' | 'commonjs'
	packageManager: PackageManager
	installDependencies: boolean
}
