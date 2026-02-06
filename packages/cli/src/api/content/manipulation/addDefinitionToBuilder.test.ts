import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { addDefinitionToBuilder } from './addDefinitionToBuilder.js'

let TEST_DIR = ''

afterEach(() => {
	if (TEST_DIR) {
		rmSync(TEST_DIR, { recursive: true, force: true })
	}
})

describe('addDefinitionToBuilder', () => {
	it('adds import and definition entry without requiring a tsconfig', async () => {
		TEST_DIR = mkdtempSync('purista-cli-builder-')
		const serviceFile = join(TEST_DIR, 'userV1Service.ts')
		writeFileSync(
			serviceFile,
			`
import { userV1ServiceBuilder } from './userV1ServiceBuilder.js'

const commandDefinitions: Parameters<typeof userV1ServiceBuilder['addCommandDefinition']>[0][] = []
const subscriptionDefinitions: Parameters<typeof userV1ServiceBuilder['addSubscriptionDefinition']>[0][] = []

export const userV1Service = userV1ServiceBuilder
  .addCommandDefinition(...commandDefinitions)
  .addSubscriptionDefinition(...subscriptionDefinitions)
`,
		)

		await addDefinitionToBuilder({
			arrayName: 'commandDefinitions',
			serviceFile,
			importFile: './command/ping/pingCommandBuilder.ts',
			importDefinition: 'pingCommandBuilder',
		})

		const updated = readFileSync(serviceFile, 'utf-8')
		expect(updated).toMatch(
			/import\s+\{\s*pingCommandBuilder\s*\}\s+from\s+['"]\.\/command\/ping\/pingCommandBuilder\.js['"]/,
		)
		expect(updated).toContain('commandDefinitions')
		expect(updated).toContain('pingCommandBuilder.getDefinition()')
	})

	it('does not add duplicate imports or definitions', async () => {
		TEST_DIR = mkdtempSync('purista-cli-builder-')
		const serviceFile = join(TEST_DIR, 'userV1Service.ts')
		writeFileSync(
			serviceFile,
			`
import { userV1ServiceBuilder } from './userV1ServiceBuilder.js'

const commandDefinitions: Parameters<typeof userV1ServiceBuilder['addCommandDefinition']>[0][] = []
const subscriptionDefinitions: Parameters<typeof userV1ServiceBuilder['addSubscriptionDefinition']>[0][] = []

export const userV1Service = userV1ServiceBuilder
  .addCommandDefinition(...commandDefinitions)
  .addSubscriptionDefinition(...subscriptionDefinitions)
`,
		)

		await addDefinitionToBuilder({
			arrayName: 'commandDefinitions',
			serviceFile,
			importFile: './command/ping/pingCommandBuilder.ts',
			importDefinition: 'pingCommandBuilder',
		})

		await addDefinitionToBuilder({
			arrayName: 'commandDefinitions',
			serviceFile,
			importFile: './command/ping/pingCommandBuilder.ts',
			importDefinition: 'pingCommandBuilder',
		})

		const updated = readFileSync(serviceFile, 'utf-8')
		expect(
			updated.match(/import\s+\{\s*pingCommandBuilder\s*\}\s+from\s+['"]\.\/command\/ping\/pingCommandBuilder\.js['"]/g)
				?.length,
		).toBe(1)
		expect(updated.match(/pingCommandBuilder\.getDefinition\(\)/g)?.length).toBe(1)
	})

	it('does not treat similarly named definitions as duplicates', async () => {
		TEST_DIR = mkdtempSync('purista-cli-builder-')
		const serviceFile = join(TEST_DIR, 'userV1Service.ts')
		writeFileSync(
			serviceFile,
			`
import { userV1ServiceBuilder } from './userV1ServiceBuilder.js'
import { pingCommandBuilderExtended } from './command/ping/pingCommandBuilderExtended.js'

const commandDefinitions: Parameters<typeof userV1ServiceBuilder['addCommandDefinition']>[0][] = [
  pingCommandBuilderExtended.getDefinition()
]
const subscriptionDefinitions: Parameters<typeof userV1ServiceBuilder['addSubscriptionDefinition']>[0][] = []

export const userV1Service = userV1ServiceBuilder
  .addCommandDefinition(...commandDefinitions)
  .addSubscriptionDefinition(...subscriptionDefinitions)
`,
		)

		await addDefinitionToBuilder({
			arrayName: 'commandDefinitions',
			serviceFile,
			importFile: './command/ping/pingCommandBuilder.ts',
			importDefinition: 'pingCommandBuilder',
		})

		const updated = readFileSync(serviceFile, 'utf-8')
		expect(updated.match(/pingCommandBuilderExtended\.getDefinition\(\)/g)?.length).toBe(1)
		expect(updated.match(/pingCommandBuilder\.getDefinition\(\)/g)?.length).toBe(1)
	})
})
