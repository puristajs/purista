import { ServiceBuilder } from '@purista/core'
import type { SupportQuestionPolicy } from './SupportResources.js'

export const supportV1ServiceBuilder = new ServiceBuilder({
	serviceName: 'Support',
	serviceVersion: '1',
	serviceDescription: 'Owns support conversations and support automation',
}).defineResource<'supportQuestionPolicy', SupportQuestionPolicy>()
