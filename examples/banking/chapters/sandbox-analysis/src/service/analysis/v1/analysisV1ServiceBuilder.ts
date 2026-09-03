import { ServiceBuilder } from '@purista/core'
import type { AnalysisPolicy } from './AnalysisResources.js'

export const analysisV1ServiceBuilder = new ServiceBuilder({
	serviceName: 'Analysis',
	serviceVersion: '1',
	serviceDescription: 'Owns isolated transaction analysis requests',
}).defineResource<'analysisPolicy', AnalysisPolicy>()
