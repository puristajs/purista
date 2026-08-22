import type { ServiceInfoType } from '@purista/core/adapter'

/**
 * Shared service metadata for the built-in Hono HTTP service.
 */
export const generalHonoServiceInfo: Omit<ServiceInfoType, 'serviceVersion'> = {
	serviceName: 'Hono',
	serviceDescription: 'Provides a hono based web server for purista services',
}
