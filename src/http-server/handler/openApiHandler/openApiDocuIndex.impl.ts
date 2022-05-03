import { Handler } from '../../types'

export const openApiDocuIndex: Handler = async function (_request, response, context) {
  response.setHeader('content-type', 'text/html; charset=utf-8')

  response.statusCode = 200
  const path = this.config.openApi?.path ? this.config.openApi.path : this.config.apiMountPath

  response.end(
    `
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
  `,
  )

  context.isResponseSend = true
  return context
}
