import type { HonoServiceV1ConfigPartial } from '@purista/hono-http-server'

const httpServerConfig: HonoServiceV1ConfigPartial & { port: number } = {
	enableDynamicRoutes: true,
	logLevel: 'debug',
	port: 8080,
	apiMountPath: '/api',
	openApi: {
		enabled: true,
		info: {
			title: 'backend api',
			description: 'OpenApi definition for server endpoints',
			version: '1.0.0',
		},
	},
}

export default httpServerConfig
