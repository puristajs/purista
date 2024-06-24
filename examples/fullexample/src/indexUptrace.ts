import { uptraceTraceExporter } from './getProcessor.js'
import { main } from './main.js'

const start = async () => {
	main(uptraceTraceExporter)
}

start()
