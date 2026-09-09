import { ServiceBuilder } from '@purista/core'
import type { SupportProcedurePolicy } from './SupportProcedurePolicy.js'

export const supportV1ServiceBuilder = new ServiceBuilder({
	serviceName: 'Support',
	serviceVersion: '1',
	serviceDescription: 'Owns support procedure answers',
}).defineResource<'supportProcedurePolicy', SupportProcedurePolicy>()
