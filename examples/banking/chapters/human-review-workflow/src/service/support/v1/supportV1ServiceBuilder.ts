import { ServiceBuilder } from '@purista/core'
import type { SupportReviewPolicy, SupportReviewStore } from './SupportReviewResources.js'

export const supportV1ServiceBuilder = new ServiceBuilder({
	serviceName: 'Support',
	serviceVersion: '1',
	serviceDescription: 'Owns support review requests and support automation',
})
	.defineResource<'supportReviewStore', SupportReviewStore>()
	.defineResource<'supportReviewPolicy', SupportReviewPolicy>()
