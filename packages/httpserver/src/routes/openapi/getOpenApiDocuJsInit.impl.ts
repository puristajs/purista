import { RouteHandlerMethod, RouteOptions } from 'fastify'
import { posix } from 'path'

import { HttpServerService } from '../../HttpServerService.impl'

export const getOpenApiDocuJsInit = function (this: HttpServerService): RouteOptions {
  const path = (this.config.openApi?.path ? this.config.openApi.path : this.config.apiMountPath) as string
  const url = posix.join(path, '/initializer.js')

  const handler: RouteHandlerMethod = (_request, reply) => {
    reply.header('content-type', 'text/javascript; charset=utf-8')

    return `
      window.onload = function() {
        //<editor-fold desc="Changeable Configuration Block">

        // the following lines will be replaced by docker/configurator, when it runs in a docker-container
        window.ui = SwaggerUIBundle({
          url: "${path}/openapi.json",
          dom_id: '#swagger-ui',
          deepLinking: true,
          presets: [
            SwaggerUIBundle.presets.apis,
          ],
        });

        //</editor-fold>
      };
    `
  }

  return {
    method: 'GET',
    url,
    handler,
  }
}
