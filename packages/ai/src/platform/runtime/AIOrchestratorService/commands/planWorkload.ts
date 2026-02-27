import { extendApi } from '@purista/core'
import { z } from 'zod/v4'

import { aiOrchestratorServiceBuilder } from '../info/info.js'

const modelResourceSchema = extendApi(
	z.object({
		resourceName: extendApi(z.string().min(1), { title: 'Model resource name' }),
		variant: extendApi(z.string().min(1).optional(), { title: 'Model resource variant' }),
	}),
	{ title: 'Model resource reference' },
)

const allowedToolSchema = extendApi(
	z.object({
		serviceName: extendApi(z.string().min(1), { title: 'Service name owning the tool' }),
		version: extendApi(z.string().min(1), { title: 'Service version' }),
		commandName: extendApi(z.string().min(1), { title: 'Command exposed as tool' }),
		description: extendApi(z.string().optional(), { title: 'Tool description' }),
	}),
	{ title: 'Allowed tool definition' },
)

const concurrencySchema = extendApi(
	z.object({
		poolId: extendApi(z.string().min(1).optional(), { title: 'Concurrency pool id' }),
		maxWorkers: extendApi(z.number().int().positive(), { title: 'Pool size' }),
	}),
	{ title: 'Concurrency pool config' },
)

const planWorkloadPayloadSchema = extendApi(
	z.object({
		manifest: extendApi(
			z.object({
				agentName: extendApi(z.string().min(1), { title: 'Agent name' }),
				description: extendApi(z.string().optional(), { title: 'Agent description' }),
				modelResource: modelResourceSchema,
				allowedTools: extendApi(z.array(allowedToolSchema).default([]), { title: 'Allowed tools' }),
				concurrency: concurrencySchema.optional(),
				agentVersion: extendApi(z.string().optional(), { title: 'Agent version' }),
				eventBridge: extendApi(z.string().min(1).default('default'), { title: 'Event bridge name' }),
			}),
			{ title: 'Agent manifest', description: 'Subset of the manifest fields accepted via API' },
		),
	}),
	{ title: 'Plan workload input payload' },
)

export const planWorkloadCommandBuilder = aiOrchestratorServiceBuilder
	.getCommandBuilder('planWorkload', 'Stores or updates an AI workload manifest in the config store')
	.addPayloadSchema(planWorkloadPayloadSchema)
	.setCommandFunction(async function (context, payload) {
		const manifestVersion = payload.manifest.agentVersion ?? new Date().toISOString()
		const manifest = {
			...payload.manifest,
			agentVersion: manifestVersion,
		}
		const configKey = `ai.manifest.${manifest.agentName}.${manifestVersion}`
		await context.configs.setConfig(configKey, manifest)

		return {
			configKey,
			version: manifestVersion,
		}
	})
