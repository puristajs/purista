import { Handler } from '../../types'

export const openApiDocuJsInit: Handler = async function (_request, response, context) {
  response.setHeader('content-type', 'application/javascript; charset=utf-8')

  const path = this.config.openApi?.path ? this.config.openApi.path : this.config.apiMountPath

  response.statusCode = 200
  response.end(
    `
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
  `,
  )

  context.isResponseSend = true
  return context
}
