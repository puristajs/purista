import { uptraceTraceExporter } from './getProcessor'
import { main } from './main'

const start = async () => {
  main(uptraceTraceExporter)
}

start()
