import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { puristaConfigSchema } from '../../loadPuristaConfig.js'
import type { PuristaProjectInfo } from '../../scanPuristaProject.js'
import { ensureServiceEvent } from './ensureServiceEvent.js'

let TEST_DIR = ''

beforeEach(() => {
	TEST_DIR = mkdtempSync(join(tmpdir(), 'purista-cli-integration-'))
	writeFileSync(
		join(TEST_DIR, 'tsconfig.json'),
		JSON.stringify({
			compilerOptions: {
				target: 'ES2022',
				module: 'ES2022',
			},
			include: ['**/*.ts'],
		}),
	)
})

afterEach(() => {
	if (TEST_DIR) {
		rmSync(TEST_DIR, { recursive: true, force: true })
	}
})

describe('ensureServiceEvent - Integration Test', () => {
	const getPuristaProjectConfig = () =>
		puristaConfigSchema.parse({
			servicePath: TEST_DIR,
			eventConvention: 'dotCase',
		})

	const puristaProject: PuristaProjectInfo = {
		services: {},
		eventNames: [],
		eventEnumFileName: 'events.ts',
	}

	it('should add a new event to an existing enum', async () => {
		// Prepare a test TypeScript file with an enum
		const filePath = join(TEST_DIR, 'events.ts')
		writeFileSync(
			filePath,
			`
            export enum ServiceEvent {
                UserCreated = "user.created"
            }
        `,
		)

		// Call the function to add a new event
		await ensureServiceEvent({
			eventName: 'OrderPlaced',
			projectRootPath: TEST_DIR,
			puristaProjectConfig: getPuristaProjectConfig(),
			puristaProject,
		})

		// Read the modified file
		const updatedContent = readFileSync(filePath, 'utf-8')

		// Check that the new event is added to the enum
		expect(updatedContent).toContain('OrderPlaced = "order.placed"')
	})

	it('should add a new event to an existing object if no enum exists', async () => {
		// Prepare a test TypeScript file with an object
		const filePath = join(TEST_DIR, 'events.ts')
		writeFileSync(
			filePath,
			`
            export const ServiceEvent = {
                UserCreated: "user.created"
            } as const;
        `,
		)

		// Call the function to add a new event
		await ensureServiceEvent({
			eventName: 'OrderPlaced',
			projectRootPath: TEST_DIR,
			puristaProjectConfig: getPuristaProjectConfig(),
			puristaProject,
			description: 'Triggered when an order is placed',
		})

		// Read the modified file
		const updatedContent = readFileSync(filePath, 'utf-8')

		// Check that the new event is added to the object
		expect(updatedContent).toContain('OrderPlaced: "order.placed"')
		expect(updatedContent).toContain('/** Triggered when an order is placed */')
	})

	it('should not add a duplicate event to an existing enum', async () => {
		// Prepare a test TypeScript file with an enum that already has the event
		const filePath = join(TEST_DIR, 'events.ts')
		writeFileSync(
			filePath,
			`
            export enum ServiceEvent {
                UserCreated = "user.created",
                OrderPlaced = "order.placed"
            }
        `,
		)

		// Call the function to add the same event
		await ensureServiceEvent({
			eventName: 'OrderPlaced',
			projectRootPath: TEST_DIR,
			puristaProjectConfig: getPuristaProjectConfig(),
			puristaProject,
		})

		// Read the modified file
		const updatedContent = readFileSync(filePath, 'utf-8')

		// Ensure the file has not changed (no duplicate entries)
		const occurrences = updatedContent.match(/OrderPlaced = "order.placed"/g) || []
		expect(occurrences.length).toBe(1)
	})

	it('should throw an error if neither an enum nor an object exists', async () => {
		// Prepare a test TypeScript file with unrelated content
		const filePath = join(TEST_DIR, 'events.ts')
		writeFileSync(
			filePath,
			`
            export const SomethingElse = {} as const;
        `,
		)

		// Expect an error when trying to add an event
		await expect(
			ensureServiceEvent({
				eventName: 'NewEvent',
				projectRootPath: TEST_DIR,
				puristaProjectConfig: getPuristaProjectConfig(),
				puristaProject,
			}),
		).rejects.toThrow('Neither enum nor object ServiceEvent found')
	})
})
