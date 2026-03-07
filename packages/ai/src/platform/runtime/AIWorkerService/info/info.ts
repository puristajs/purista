import type { ServiceInfoType } from '@purista/core'
import { ServiceBuilder } from '@purista/core'

export const aiWorkerServiceInfo: ServiceInfoType = {
	serviceName: 'AIWorkerService',
	serviceDescription: 'Executes AI workloads via queue workers',
	serviceVersion: 'v1',
}

export const aiWorkerServiceBuilder = new ServiceBuilder(aiWorkerServiceInfo)
