/**
 * Example on how to generate a client from JSON definition files
 */
/** biome-ignore-all lint/suspicious/noConsole: used as CLI tool example */
import { ClientBuilder } from '@purista/core/client'
import { pingPongV1Service } from './service/pingPong/v1/pingPongV1Service.js'

const generate = async () => {
	const clientBuilder = new ClientBuilder()

	clientBuilder.on('error', (...args) => console.error(...args))
	clientBuilder.on('warn', (...args) => console.warn(...args))
	clientBuilder.on('info', (...args) => console.info(...args))
	clientBuilder.on('success', (...args) => console.info(...args))
	clientBuilder.on('start', (...args) => console.log(...args))

	// load the config from purista.client.json in current working directory
	await clientBuilder.loadConfig()

	try {
		// get the definitions from the builder source files
		const definitions = await clientBuilder.getDefinitionsFromServiceBuilders([pingPongV1Service])

		// clear the output folder
		await clientBuilder.cleanDistFolder()

		// generate the source files
		await clientBuilder.generateHttpClient(definitions)

		// add a index.ts with exports to the source files
		await clientBuilder.createIndex()

		// add a package.json
		await clientBuilder.createPackageJson()

		// compile the source files
		await clientBuilder.build()
	} catch (error) {
		console.error(error)
	} finally {
		// cleanup the builder and remove event listeners
		clientBuilder.destroy()
	}
}

generate()
