import { ServiceBuilder, ServiceInfoType } from '@purista/core'
import { z } from 'zod'

import { UserServiceCustomClass } from './UserServiceCustomClass'

export * from './UserFunction.enum'

export const userServiceInfo: ServiceInfoType = {
  serviceName: 'UserService',
  serviceVersion: '1',
  serviceDescription: 'service which handles all user related information',
}

const configSchema = z
  .object({
    example: z.string().default('test config'),
  })
  .default({
    example: '1233',
  })

export type UserServiceConfigType = z.output<typeof configSchema>
export type UserServiceConfigInputType = z.input<typeof configSchema>

export const UserServiceBuilder = new ServiceBuilder(userServiceInfo)
  .setConfigSchema(configSchema)
  .setDefaultConfig({
    example: 'set some default',
  })
  .setCustomClass(UserServiceCustomClass)
