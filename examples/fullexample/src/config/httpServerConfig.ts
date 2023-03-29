import { HttpServerServiceV1Config } from '@purista/httpserver'

const httpServerConfig: HttpServerServiceV1Config = {
  fastify: {},
  port: 8080,
  logLevel: 'debug',
  domain: 'localhost',
  apiMountPath: '/api',
  enableCors: false,
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
