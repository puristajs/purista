import { randomUUID } from 'node:crypto'

import type { StatementAnalysisJob } from './contracts.js'

/** Application-owned job state. The Docker adapter never stores banking data. */
export class StatementAnalysisStore {
	private readonly jobs = new Map<string, StatementAnalysisJob>()
	private readonly byRequest = new Map<string, string>()

	create(input: Pick<StatementAnalysisJob, 'accountId' | 'requestedBy' | 'requestKey'>) {
		const existingId = this.byRequest.get(`${input.requestedBy}:${input.requestKey}`)
		if (existingId) {
			const existing = this.jobs.get(existingId)
			if (existing) return existing
		}
		const job: StatementAnalysisJob = {
			jobId: randomUUID(),
			...input,
			status: 'queued',
			createdAt: new Date().toISOString(),
		}
		this.jobs.set(job.jobId, job)
		this.byRequest.set(`${input.requestedBy}:${input.requestKey}`, job.jobId)
		return job
	}

	get(jobId: string) {
		return this.jobs.get(jobId)
	}

	start(jobId: string) {
		const job = this.require(jobId)
		if (job.status === 'queued') job.status = 'running'
		return job
	}

	complete(jobId: string, report: NonNullable<StatementAnalysisJob['report']>) {
		const job = this.require(jobId)
		job.status = 'completed'
		job.report = report
		job.completedAt = new Date().toISOString()
		return job
	}

	fail(jobId: string, failure: NonNullable<StatementAnalysisJob['failure']>) {
		const job = this.require(jobId)
		job.status = 'failed'
		job.failure = failure
		job.completedAt = new Date().toISOString()
		return job
	}

	private require(jobId: string) {
		const job = this.jobs.get(jobId)
		if (!job) throw new Error('Statement analysis job does not exist')
		return job
	}
}
