import { randomUUID } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { DefaultEventBridge, DefaultStateStore } from '@purista/core'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import {
	createInlineSkillResource,
	createPuristaSandboxProvider,
	FileSkillResource,
	type SandboxDescriptor,
	SandboxRegistry,
	sandboxServiceBuilder,
	seedSandboxSkills,
	toSandboxSkillPath,
} from '../index.js'
import { selectDockerCompatibleSandboxRuntime } from './testing/dockerCompatibleRuntime.js'

const runtime = await selectDockerCompatibleSandboxRuntime()
const canonicalSkillsRoot = fileURLToPath(new URL('../../../../skills', import.meta.url))

const describeIntegration = runtime.available ? describe : describe.skip

describeIntegration(`sandbox integration (${runtime.runtimeLabel})`, () => {
	const eventBridge = new DefaultEventBridge({
		defaultCommandTimeout: 60_000,
	})
	const stateStore = new DefaultStateStore()
	const registry = new SandboxRegistry(stateStore)
	const provider = createPuristaSandboxProvider(eventBridge)

	let sandboxService: Awaited<ReturnType<typeof sandboxServiceBuilder.getInstance>>
	let createdSandboxIds: string[] = []

	const createSubject = (projectId: string) => ({
		tenantId: 'tenant-integration',
		principalId: 'user-integration',
		projectId,
	})

	const track = (descriptor: SandboxDescriptor) => {
		createdSandboxIds.push(descriptor.sandboxId)
		return descriptor
	}

	beforeAll(async () => {
		sandboxService = await sandboxServiceBuilder.getInstance(eventBridge, {
			stateStore,
			resources: {
				driver: runtime.driver,
				registry,
			},
		})
		await eventBridge.start()
		await sandboxService.start()
	})

	afterAll(async () => {
		for (const sandboxId of new Set(createdSandboxIds)) {
			await runtime.driver.destroySandbox({ sandboxId }).catch(() => undefined)
			await registry.unregister(sandboxId).catch(() => undefined)
		}
		if (sandboxService) {
			await sandboxService.destroy()
		}
		await eventBridge.destroy()
	})

	it('creates and reuses a shared sandbox for the same owner tuple', async () => {
		const descriptor = track(
			await provider.ensureSandbox({
				subject: createSubject('project-shared'),
			}),
		)

		const reused = await provider.ensureSandbox({
			subject: createSubject('project-shared'),
		})

		expect(descriptor.created).toBe(true)
		expect(reused.created).toBe(false)
		expect(reused.sandboxId).toBe(descriptor.sandboxId)
	})

	it('isolates sandboxes by scope for the same owner tuple', async () => {
		const baseSubject = createSubject('project-scoped')
		const first = track(
			await provider.ensureSandbox({
				subject: baseSubject,
				scope: { kind: 'agent-run', key: 'run-a' },
			}),
		)
		const second = track(
			await provider.ensureSandbox({
				subject: baseSubject,
				scope: { kind: 'agent-run', key: 'run-b' },
			}),
		)

		expect(first.sandboxId).not.toBe(second.sandboxId)
	})

	it('executes commands and reads and writes files through the adapter', async () => {
		const descriptor = track(
			await provider.ensureSandbox({
				subject: createSubject('project-files'),
				scope: { kind: 'conversation', key: randomUUID() },
			}),
		)
		const adapter = provider.createAdapter({ descriptor })

		await adapter.writeFiles([{ path: '/workspace/repo/spec.md', content: '# integration\n' }])
		const content = await adapter.readFile('/workspace/repo/spec.md')
		const result = await adapter.executeCommand('pwd && test -f /workspace/repo/spec.md && echo ok', {
			cwd: '/workspace',
		})

		expect(content).toBe('# integration\n')
		expect(result.exitCode).toBe(0)
		expect(result.stdout).toContain('/workspace')
		expect(result.stdout).toContain('ok')
	})

	it('seeds synthetic skill bundles and executes seeded scripts inside the sandbox', async () => {
		const descriptor = track(
			await provider.ensureSandbox({
				subject: createSubject('project-skills'),
				scope: { kind: 'conversation', key: randomUUID() },
			}),
		)
		const adapter = provider.createAdapter({ descriptor })
		const skillResource = createInlineSkillResource({
			'sandbox-smoke': {
				content: '# sandbox skill\n',
				references: {
					'guide.md': 'sandbox guide\n',
				},
				scripts: {
					'plan.sh': '#!/usr/bin/env sh\necho sandbox-plan\n',
				},
			},
		})

		const seeded = await seedSandboxSkills({
			adapter,
			skillResource,
		})
		await adapter.writeFiles([{ path: '/workspace/repo/notes.txt', content: 'repo note\n' }])
		const skillDocument = await adapter.readFile(toSandboxSkillPath('sandbox-smoke', 'SKILL.md'))
		const reference = await adapter.readFile(toSandboxSkillPath('sandbox-smoke', 'references/guide.md'))
		const script = await adapter.readFile(toSandboxSkillPath('sandbox-smoke', 'scripts/plan.sh'))
		const scriptResult = await adapter.executeCommand('sh /workspace/skills/sandbox-smoke/scripts/plan.sh', {
			cwd: '/workspace',
		})
		const layoutResult = await adapter.executeCommand(
			'test -d /workspace/repo && test -d /workspace/skills/sandbox-smoke && test ! -e /workspace/repo/SKILL.md && echo isolated',
			{
				cwd: '/workspace',
			},
		)

		expect(seeded).toEqual({
			written: 3,
			skills: ['sandbox-smoke'],
		})
		expect(skillDocument).toBe('# sandbox skill\n')
		expect(reference).toBe('sandbox guide\n')
		expect(script).toBe('#!/usr/bin/env sh\necho sandbox-plan\n')
		expect(scriptResult.exitCode).toBe(0)
		expect(scriptResult.stdout).toContain('sandbox-plan')
		expect(layoutResult.exitCode).toBe(0)
		expect(layoutResult.stdout).toContain('isolated')
	})

	it('seeds a real canonical skill bundle shape through the framework helper', async () => {
		const descriptor = track(
			await provider.ensureSandbox({
				subject: createSubject('project-real-skill'),
				scope: { kind: 'agent-run', key: randomUUID() },
			}),
		)
		const adapter = provider.createAdapter({ descriptor })
		const skillResource = new FileSkillResource({ roots: [canonicalSkillsRoot] })
		const bundle = await skillResource.loadBundle('purista')
		const representative = bundle.files.find(file => file.relativePath !== 'SKILL.md') ?? bundle.files[0]

		const seeded = await seedSandboxSkills({
			adapter,
			skillResource,
			skillNames: ['purista'],
		})
		const skillContent = await adapter.readFile(toSandboxSkillPath('purista', 'SKILL.md'))
		const representativeContent = await adapter.readFile(toSandboxSkillPath('purista', representative.relativePath))

		expect(seeded).toEqual({
			written: bundle.files.length,
			skills: ['purista'],
		})
		expect(skillContent).toBe(bundle.files.find(file => file.relativePath === 'SKILL.md')?.content.toString('utf8'))
		expect(representativeContent).toBe(representative.content.toString('utf8'))
	}, 15_000)

	it('rejects access when the project id does not match the sandbox owner tuple', async () => {
		const descriptor = track(
			await provider.ensureSandbox({
				subject: createSubject('project-allowed'),
			}),
		)
		const adapter = provider.createAdapter({
			descriptor: {
				...descriptor,
				subject: {
					...descriptor.subject,
					projectId: 'project-denied',
				},
			},
		})

		await expect(adapter.executeCommand('pwd')).rejects.toMatchObject({
			errorCode: 403,
		})
	})

	it('destroys the sandbox and unregisters it', async () => {
		const descriptor = track(
			await provider.ensureSandbox({
				subject: createSubject('project-destroy'),
				scope: { kind: 'custom', key: randomUUID() },
			}),
		)
		const metadataBefore = await registry.getMetadata(descriptor.sandboxId)
		expect(metadataBefore?.sandboxId).toBe(descriptor.sandboxId)

		await provider.destroySandbox?.({ descriptor })

		const metadataAfter = await registry.getMetadata(descriptor.sandboxId)
		expect(metadataAfter).toBeUndefined()
		createdSandboxIds = createdSandboxIds.filter(id => id !== descriptor.sandboxId)
	})
})

if (!runtime.available) {
	describe('sandbox integration', () => {
		it.skip(runtime.reason, () => undefined)
	})
}
