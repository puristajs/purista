import { mkdtemp } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { dockerSandbox } from '@purista/harness-sandbox-docker'
import { afterEach, describe, expect, it } from 'vitest'

const image = 'sha256:41b693b5051e085a60b9a75c51226df6699d84660ae5b2cefef09bf97fc5ab50'
const adapters: ReturnType<typeof dockerSandbox>[] = []

afterEach(async () => {
	for (const adapter of adapters.splice(0)) await adapter.administration.sweep({ limit: 20 }).catch(() => undefined)
})

describe.runIf(process.env.PURISTA_BANKING_DOCKER_TEST === '1')('Chapter 20 real Docker statement sandbox', () => {
	it('executes a bounded CSV calculation without a host mount or guest network', async () => {
		const adapter = dockerSandbox({
			root: await mkdtemp(join(tmpdir(), 'purista-banking-sandbox-')),
			image,
			network: 'none',
			resources: { cpus: 0.25, memoryMb: 128, pids: 32, tmpfsMb: 16 },
		})
		adapters.push(adapter)
		const owner = {
			namespace: 'example-bank.statement-analysis',
			id: 'test-job-001',
			instanceId: '01JQ7Z9Q69STZ33MGH6V5ASR7J',
			identity: { tenantId: 'tenant-north', principalId: 'alice' },
		} as const
		const scope = { owner, partition: { kind: 'shared' as const }, lifetime: 'run' as const, runId: 'test-job-001' }
		await adapter.registerOwner({ owner, mode: 'create' })
		const opened = await adapter.open({ scope, mode: 'create', identity: owner.identity })
		try {
			await opened.session.write('/workspace/statement.csv', 'amountMinor\n42\n-10\n')
			if (opened.session.executor !== 'available') throw new Error('Docker sandbox has no executor')
			const result = await opened.session.exec(
				"awk 'NR > 1 { total += $1 } END { print total }' /workspace/statement.csv",
				{ timeoutMs: 5_000 },
			)
			expect(result).toMatchObject({ exitCode: 0, stdout: '32\n' })
		} finally {
			await opened.session.close()
			await adapter.terminate({ scope, reason: 'run_disposed' })
		}
	})
})
