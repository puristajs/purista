import type { InfoObject } from 'openapi3-ts'

import { getDefaultConfig } from './getDefaultConfig'

export const OPENAPI_DEFAULT_MOUNT_PATH = getDefaultConfig().apiMountPath as string

export const OPENAPI_DEFAULT_INFO: InfoObject = {
  title: 'Server api',
  description: 'OpenApi definition for server endpoints',
  version: '1.0.0',
}
