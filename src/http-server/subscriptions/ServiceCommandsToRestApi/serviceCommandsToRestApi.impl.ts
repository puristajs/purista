import { posix } from 'path'

import { InfoServiceFunctionAdded, isInfoServiceFunctionAdded } from '../../../core'
import { createExtractPayloadMiddleware, createRequestBodyToJsonMiddleware } from '../../onBeforeMiddleware'
import { Handler, HttpServiceSubscriptionCallBack, isHttpExposedServiceMeta } from '../../types'

const beforeMiddleware = [createExtractPayloadMiddleware(), createRequestBodyToJsonMiddleware()]

/* A function that is called when a message is received. */
export const serviceCommandsToRestApi: HttpServiceSubscriptionCallBack<InfoServiceFunctionAdded> = async function (
  _id,
  message,
) {
  if (!isInfoServiceFunctionAdded(message)) {
    this.log.warn('Invalid message received', message)
    return
  }

  if (!isHttpExposedServiceMeta(message.data)) {
    this.log.debug('...skip exposing function')
    return
  }

  const data = message.data.expose
  const version = message.sender.serviceVersion.split('.')[0]
  const method = data.http.method
  const apiMountPath = this.config.apiMountPath
  const path = posix.join(apiMountPath || '/api', `v${version}`, data.http.path)

  data.http.path = path

  const contentType = data.http.contentType || 'application/json'

  const getHandler = (): Handler => {
    const serviceHandler: Handler = async (_request, _response, context) => {
      context.payload = await this.invoke({
        receiver: {
          serviceName: message.sender.serviceName,
          serviceVersion: message.sender.serviceVersion,
          serviceTarget: message.sender.serviceTarget,
        },
        command: {
          parameter: context.parameter,
          payload: context.payload,
        },
      })

      context.headers['content-type'] = contentType

      return context
    }

    return serviceHandler
  }

  this.addRoute(method, path, ...beforeMiddleware, getHandler())

  this.routeDefinitions.push(message.data)
}
