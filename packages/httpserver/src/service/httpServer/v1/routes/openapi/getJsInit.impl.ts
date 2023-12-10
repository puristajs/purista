export const getJsInit = (path: string) => `
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
