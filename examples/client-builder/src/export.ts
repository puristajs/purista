/**
 * Example on how to export the definitions from a service.
 * The definitions are written to JSON files in the `./definitions` folder.
 */
import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'

import { exportServiceDefinitions } from '@purista/core'

import { pingPongV1Service } from './service/pingPong/v1/pingPongV1Service.js'

const exportDefinitions = async () => {
	const serviceBuilders = [pingPongV1Service]

	const definitions = await exportServiceDefinitions(serviceBuilders)

	await writeFile(join(process.cwd(), 'definitions', 'export.json'), JSON.stringify(definitions, null, 2))
}

exportDefinitions()
