/**
 * Example on how to generate a client from JSON definition files
 */
import { ClientBuilder } from '@purista/core'
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
		const defnitions = await clientBuilder.getDefinitionsFromServiceBuilders([pingPongV1Service])

		// clear the output folder
		await clientBuilder.cleanDistFolder()

		// generate the source files
		await clientBuilder.generateHttpClient(defnitions)

		// add a index.ts with exports to the source files
		await clientBuilder.createIndex()

		// add a package.json
		await clientBuilder.createPackageJson()

		// compile the source files
		await clientBuilder.build()
	} catch (error) {
		// biome-ignore lint/suspicious/noConsole: <explanation>
		console.error(error)
	} finally {
		// cleanup the builder and remove event listeners
		clientBuilder.destroy()
	}
}

generate()
