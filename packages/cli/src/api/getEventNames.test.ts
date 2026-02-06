import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { getEventNames } from './getEventNames.js'

let TEST_DIR = ''

afterEach(() => {
	if (TEST_DIR) {
		rmSync(TEST_DIR, { recursive: true, force: true })
	}
})

describe('getEventNames', () => {
	it('reads ServiceEvent enum from a project root path', () => {
		TEST_DIR = mkdtempSync('purista-cli-events-')
		writeFileSync(
			join(TEST_DIR, 'tsconfig.json'),
			JSON.stringify({ compilerOptions: { target: 'ES2022', module: 'ES2022' } }),
		)
		const servicePath = join(TEST_DIR, 'src', 'service')
		mkdirSync(servicePath, { recursive: true })
		const eventFile = join(servicePath, 'serviceEvent.enum.ts')
		writeFileSync(
			eventFile,
			`
export enum ServiceEvent {
  UserCreated = "user.created",
  OrderPlaced = "order.placed"
}
`,
		)

		const result = getEventNames({ servicePath: 'src/service' } as any, 'serviceEvent.enum.ts', TEST_DIR)

		expect(result).toEqual([
			{ name: 'order.placed', value: 'order.placed' },
			{ name: 'user.created', value: 'user.created' },
		])
	})

	it('reads ServiceEvent const object without a tsconfig', () => {
		TEST_DIR = mkdtempSync('purista-cli-events-')
		const servicePath = join(TEST_DIR, 'src', 'service')
		mkdirSync(servicePath, { recursive: true })
		const eventFile = join(servicePath, 'serviceEvent.enum.ts')
		writeFileSync(
			eventFile,
			`
export const ServiceEvent = {
  UserCreated: "user.created",
  OrderPlaced: "order.placed"
} as const
`,
		)

		const result = getEventNames({ servicePath: 'src/service' } as any, 'serviceEvent.enum.ts', TEST_DIR)

		expect(result).toEqual([
			{ name: 'order.placed', value: 'order.placed' },
			{ name: 'user.created', value: 'user.created' },
		])
	})
})
