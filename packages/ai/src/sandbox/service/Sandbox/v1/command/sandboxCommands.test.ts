import { getCommandMessageMock, HandledError, StatusCode } from '@purista/core'
import { createSandbox as createSinonSandbox, type SinonSandbox } from 'sinon'
import { afterAll, beforeEach, describe, expect, it } from 'vitest'
import { createSandboxCommandBuilder } from './createSandbox/createSandboxCommandBuilder.js'
import { destroySandboxCommandBuilder } from './destroySandbox/destroySandboxCommandBuilder.js'
import { ensureSandboxCommandBuilder } from './ensureSandbox/ensureSandboxCommandBuilder.js'
import { executeBashCommandBuilder } from './executeBash/executeBashCommandBuilder.js'
import { readFileCommandBuilder } from './readFile/readFileCommandBuilder.js'
import { writeFilesCommandBuilder } from './writeFiles/writeFilesCommandBuilder.js'

const createContext = <TPayload>(
	builder: {
		getCommandContextMock: (input: {
			payload: TPayload
			parameter: Record<string, never>
			sandbox: SinonSandbox
			resources: any
		}) => any
	},
	payload: TPayload,
	resources: Record<string, unknown>,
	identity: { tenantId?: string; principalId?: string } = {
		tenantId: 'tenant-1',
		principalId: 'user-1',
	},
) => {
	const context = builder.getCommandContextMock({
		payload,
		parameter: {},
		sandbox,
		resources,
	})
	context.mock.message = getCommandMessageMock({
		tenantId: identity.tenantId,
		principalId: identity.principalId,
		payload: {
			payload,
			parameter: {},
		},
	}) as any
	return context
}

const sandbox = createSinonSandbox()

describe('sandbox command ownership', () => {
	beforeEach(() => {
		sandbox.reset()
	})

	afterAll(() => {
		sandbox.restore()
	})

	it('creates a sandbox with tenant/principal-derived ownership and rejects duplicate owner create', async () => {
		const driver = {
			createSandbox: sandbox.stub().resolves({ sandboxId: 'new-id', containerName: 'container-1' }),
		}
		const registry = {
			findByOwner: sandbox.stub().onFirstCall().resolves(undefined).onSecondCall().resolves({ sandboxId: 'sb-1' }),
			register: sandbox.stub().resolves(),
		}

		const context = createContext(
			createSandboxCommandBuilder,
			{ projectId: 'project-1' },
			{ driver, registry },
			{ tenantId: 'tenant-a', principalId: 'user-a' },
		)
		const fn = createSandboxCommandBuilder.getCommandFunction()

		const result = await fn(context.mock, { projectId: 'project-1' }, {})
		expect(result.status).toBe('starting')
		expect(result.sandboxId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
		expect(
			driver.createSandbox.calledWithMatch({
				sandboxId: result.sandboxId,
				organizationId: 'tenant-a',
				projectId: 'project-1',
				userId: 'user-a',
			}),
		).toBe(true)
		expect(registry.register.calledOnce).toBe(true)

		await expect(fn(context.mock, { projectId: 'project-1' }, {})).rejects.toMatchObject({
			errorCode: StatusCode.Conflict,
		})
	})

	it('recreates an unhealthy sandbox in ensureSandbox', async () => {
		const driver = {
			executeBash: sandbox.stub().resolves({ stdout: '', stderr: 'boom', exitCode: 1 }),
			destroySandbox: sandbox.stub().resolves(),
			createSandbox: sandbox.stub().resolves({ sandboxId: 'new-sb', containerName: 'container-2' }),
		}
		const registry = {
			findByOwner: sandbox.stub().resolves({
				sandboxId: 'old-sb',
				organizationId: 'tenant-1',
				projectId: 'project-1',
				userId: 'user-1',
				containerName: 'old-container',
				createdAt: Date.now(),
			}),
			unregister: sandbox.stub().resolves(),
			register: sandbox.stub().resolves(),
		}

		const context = createContext(ensureSandboxCommandBuilder, { projectId: 'project-1' }, { driver, registry })
		const fn = ensureSandboxCommandBuilder.getCommandFunction()

		const result = await fn(context.mock, { projectId: 'project-1' }, {})

		expect(driver.destroySandbox.calledWith({ sandboxId: 'old-sb' })).toBe(true)
		expect(registry.unregister.calledWith('old-sb')).toBe(true)
		expect(driver.createSandbox.calledOnce).toBe(true)
		expect(result.created).toBe(true)
		expect(result.status).toBe('starting')
		expect(result.sandboxId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
		expect(
			driver.createSandbox.calledWithMatch({
				sandboxId: result.sandboxId,
				organizationId: 'tenant-1',
				projectId: 'project-1',
				userId: 'user-1',
			}),
		).toBe(true)
	})

	it('uses scope to isolate parallel ensureSandbox requests for the same owner tuple', async () => {
		const driver = {
			executeBash: sandbox.stub(),
			destroySandbox: sandbox.stub(),
			createSandbox: sandbox.stub().resolves({ sandboxId: 'new-sb', containerName: 'container-2' }),
		}
		const registry = {
			findByOwner: sandbox.stub().onFirstCall().resolves(undefined).onSecondCall().resolves(undefined),
			unregister: sandbox.stub().resolves(),
			register: sandbox.stub().resolves(),
		}

		const context = createContext(ensureSandboxCommandBuilder, { projectId: 'project-1' }, { driver, registry })
		const fn = ensureSandboxCommandBuilder.getCommandFunction()

		await fn(context.mock, { projectId: 'project-1', scope: { kind: 'agent-run', key: 'run-1' } }, {})
		await fn(context.mock, { projectId: 'project-1', scope: { kind: 'agent-run', key: 'run-2' } }, {})

		expect(registry.findByOwner.firstCall.args[0]).toMatchObject({
			organizationId: 'tenant-1',
			projectId: 'project-1',
			userId: 'user-1',
			scope: { kind: 'agent-run', key: 'run-1' },
		})
		expect(registry.findByOwner.secondCall.args[0]).toMatchObject({
			organizationId: 'tenant-1',
			projectId: 'project-1',
			userId: 'user-1',
			scope: { kind: 'agent-run', key: 'run-2' },
		})
		expect(driver.createSandbox.calledTwice).toBe(true)
	})

	it.each([
		['execute', executeBashCommandBuilder, { sandboxId: 'sb-1', command: 'pwd' }, 'executeBash'],
		['read', readFileCommandBuilder, { sandboxId: 'sb-1', path: '/tmp/file.txt' }, 'readFile'],
		['write', writeFilesCommandBuilder, { sandboxId: 'sb-1', files: { '/tmp/file.txt': 'x' } }, 'writeFiles'],
		['destroy', destroySandboxCommandBuilder, { sandboxId: 'sb-1' }, 'destroySandbox'],
	] as const)('rejects %s access for the wrong owner', async (_name, builder, payload, driverMethod) => {
		const driver = {
			executeBash: sandbox.stub().resolves({ stdout: '', stderr: '', exitCode: 0 }),
			readFile: sandbox.stub().resolves('content'),
			writeFiles: sandbox.stub().resolves(),
			destroySandbox: sandbox.stub().resolves(),
		}
		const registry = {
			getMetadata: sandbox.stub().resolves({
				sandboxId: 'sb-1',
				organizationId: 'tenant-1',
				projectId: 'project-1',
				userId: 'user-1',
				containerName: 'container',
				createdAt: Date.now(),
			}),
			unregister: sandbox.stub().resolves(),
		}

		const context = createContext(
			builder,
			payload,
			{ driver, registry },
			{ tenantId: 'tenant-2', principalId: 'user-2' },
		)
		const fn = builder.getCommandFunction()

		await expect(fn(context.mock, payload, {})).rejects.toBeInstanceOf(HandledError)
		expect(driver[driverMethod].called).toBe(false)
	})

	it('requires tenant/principal metadata for sandbox access commands', async () => {
		const driver = {
			executeBash: sandbox.stub().resolves({ stdout: '', stderr: '', exitCode: 0 }),
		}
		const registry = {
			getMetadata: sandbox.stub().resolves({
				sandboxId: 'sb-1',
				organizationId: 'tenant-1',
				projectId: 'project-1',
				userId: 'user-1',
				containerName: 'container',
				createdAt: Date.now(),
			}),
		}

		const context = createContext(
			executeBashCommandBuilder,
			{ sandboxId: 'sb-1', command: 'pwd' },
			{ driver, registry },
			{ tenantId: undefined, principalId: undefined },
		)

		await expect(
			executeBashCommandBuilder.getCommandFunction()(context.mock, { sandboxId: 'sb-1', command: 'pwd' }, {}),
		).rejects.toMatchObject({ errorCode: StatusCode.Unauthorized })
	})
})
