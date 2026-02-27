import type { ServiceInfoType } from '@purista/core'
import { ServiceBuilder } from '@purista/core'

export const aiOrchestratorServiceInfo: ServiceInfoType = {
	serviceName: 'AIOrchestratorService',
	serviceDescription: 'Manages AI workload manifests, planning, and scheduling',
	serviceVersion: 'v1',
}

export const aiOrchestratorServiceBuilder = new ServiceBuilder(aiOrchestratorServiceInfo)
