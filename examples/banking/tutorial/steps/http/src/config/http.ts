import type { HonoServiceV1ConfigPartial } from '@purista/hono-http-server'

/** HTTP settings for the local-only teaching application. */
export const httpConfig = {
	hostname: '127.0.0.1',
	port: 3000,
	serviceConfig: {
		enableHealth: true,
		healthPath: '/health',
		apiMountPath: '/api',
		openApi: {
			enabled: true,
			info: { title: 'Example Bank API', version: '1.0.0' },
		},
	} satisfies HonoServiceV1ConfigPartial,
}
