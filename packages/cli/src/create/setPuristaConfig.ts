import fs from 'node:fs'
import path from 'node:path'
import type { CreateProjectInput } from './types.js'

export const setPuristaConfig = async (settings: CreateProjectInput, targetDirectoryPath: string) => {
	const puristaJsonPath = path.join(targetDirectoryPath, 'purista.json')
	if (!fs.existsSync(puristaJsonPath)) {
		return
	}

	const puristaJson = fs.readFileSync(puristaJsonPath, 'utf-8')
	const newPuristaJson = {
		$schema: 'https://purista.dev/schemas/1.12.0/schema.json',
		servicePath: 'src/service',
		...JSON.parse(puristaJson),
		runtime: settings.runtime,
		eventBridge: settings.eventBridge,
		fileConvention: settings.fileConvention,
		eventConvention: settings.eventConvention,
		linter: settings.linter,
		formatter: settings.formatter,
	}

	fs.writeFileSync(puristaJsonPath, JSON.stringify(newPuristaJson, null, 2))
}
