import { resolve } from 'node:path'
import type { EventBridge, Logger } from '@purista/core'
import { openai } from '@purista/harness-openai'
import { dockerSandbox } from '@purista/harness-sandbox-docker'
import type { AnalysisPolicy } from './service/analysis/v1/AnalysisResources.js'
import { analysisV1Service } from './service/analysis/v1/analysisV1Service.js'

export function createAnalysisService(
	eventBridge: EventBridge,
	logger: Logger,
	analysisPolicy: AnalysisPolicy,
	environment: Readonly<Record<string, string | undefined>> = process.env,
) {
	const apiKey = environment.OPENAI_API_KEY?.trim()
	const image = environment.PURISTA_DOCKER_SANDBOX_IMAGE?.trim()
	if (!apiKey) throw new Error('OPENAI_API_KEY is required to run transaction analysis.')
	if (!image) throw new Error('PURISTA_DOCKER_SANDBOX_IMAGE is required to run transaction analysis.')
	const sandbox = dockerSandbox({
		root: resolve(environment.PURISTA_DOCKER_SANDBOX_ROOT?.trim() || './runtime/sandboxes'),
		image,
		user: '10001:10001',
	})
	return {
		sandbox,
		service: analysisV1Service.getInstance(eventBridge, {
			logger,
			resources: { analysisPolicy },
			ai: {
				models: {
					analysis_model: {
						provider: openai({ apiKey }),
						model: environment.OPENAI_MODEL?.trim() || 'gpt-5-mini',
					},
				},
				sandbox,
				telemetry: { contentCaptureMode: 'NO_CONTENT' },
			},
		}),
	}
}
