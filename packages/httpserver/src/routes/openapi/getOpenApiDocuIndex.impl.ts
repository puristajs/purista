import { RouteHandlerMethod, RouteOptions } from 'fastify'

import { HttpServerService } from '../../HttpServerService.impl'

export const getOpenApiDocuIndex = function (this: HttpServerService): RouteOptions {
  const path = this.config.openApi?.path ? this.config.openApi.path : this.config.apiMountPath
  const url = `${path}`

  const handler: RouteHandlerMethod = (_reqest, reply) => {
    reply.header('content-type', 'text/html; charset=utf-8')

    return `
      <!-- HTML for static distribution bundle build -->
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>Swagger UI</title>
          <link rel="stylesheet" type="text/css" href="${path}/assets/swagger-ui.css" />
          <link rel="stylesheet" type="text/css" href="${path}/assets/index.css" />
          <link rel="icon" type="image/png" href="${path}/assets/favicon-32x32.png" sizes="32x32" />
          <link rel="icon" type="image/png" href="${path}/assets/favicon-16x16.png" sizes="16x16" />
        </head>

        <body>
          <div id="swagger-ui"></div>
          <script src="${path}/assets/swagger-ui-bundle.js" charset="UTF-8"> </script>
          <script src="${path}/assets/swagger-ui-standalone-preset.js" charset="UTF-8"> </script>
          <script src="${path}/initializer.js" charset="UTF-8"> </script>
        </body>
      </html>
    `
  }

  return {
    method: 'GET',
    url,
    handler,
  }
}
