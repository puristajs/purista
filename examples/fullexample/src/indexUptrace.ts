import { configureOpentelemetry } from '@uptrace/node'

import { getOTLPTraceExporter } from './getProcessor'
import { main } from './main'

const start = async () => {
  await configureOpentelemetry({
    // copy your project DSN here or use UPTRACE_DSN env var
    // dsn: 'https://<token>@uptrace.dev/<project_id>',
    dsn: 'http://purista_secret_token@localhost:14318/3',
    serviceName: 'myservice',
    serviceVersion: '1.0.0',
    deploymentEnvironment: 'production',
  })
    // Start OpenTelemetry SDK.
    .start()

  main(getOTLPTraceExporter)
}

start()
