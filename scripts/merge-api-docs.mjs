import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const generatedDirectory = resolve(process.cwd(), 'web', 'src', 'generated')
const frameworkPath = resolve(generatedDirectory, 'purista-framework-api.json')
const harnessPath = resolve(generatedDirectory, 'purista-harness-api.json')
const targetPath = resolve(generatedDirectory, 'purista-api.json')

const framework = JSON.parse(readFileSync(frameworkPath, 'utf8'))
const harness = JSON.parse(readFileSync(harnessPath, 'utf8'))
const frameworkModules = framework.children ?? []
const harnessModules = (harness.children ?? []).flatMap(module => {
	const nestedModules = (module.children ?? []).filter(child => child.kind === 2)
	if (nestedModules.length === 0) return [module]

	return nestedModules.map(child => ({
		...child,
		name: child.name ? `${module.name}/${child.name}` : module.name,
	}))
})
const duplicates = harnessModules
	.map(module => module.name)
	.filter(name => frameworkModules.some(module => module.name === name))

if (duplicates.length > 0) {
	throw new Error(`Cannot merge generated API documentation with duplicate package modules: ${duplicates.join(', ')}`)
}

writeFileSync(
	targetPath,
	JSON.stringify(
		{
			...framework,
			name: 'PURISTA API',
			children: [...frameworkModules, ...harnessModules],
		},
		null,
		2,
	),
)
