import { ServiceBuilder } from '@purista/core'
import type { SupportCasePolicy } from './SupportResources.js'

export const supportV1ServiceBuilder = new ServiceBuilder({
	serviceName: 'Support',
	serviceVersion: '1',
	serviceDescription: 'Owns support cases and resolution workflows',
}).defineResource<'supportCasePolicy', SupportCasePolicy>()
