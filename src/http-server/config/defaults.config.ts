import type { InfoObject } from 'openapi3-ts'

export const OPENAPI_DEFAULT_MOUNT_PATH = '/api'

export const OPENAPI_DEFAULT_INFO: InfoObject = {
  title: 'Server api',
  description: 'OpenApi definition for server endpoints',
  version: '1.0.0',
}
