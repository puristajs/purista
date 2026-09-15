import { writeFile } from 'node:fs/promises'
import { exportServiceDefinitions } from '@purista/core'
import { reportingV1Service } from './service/reporting/v1/reportingV1Service.js'

const definitions = await exportServiceDefinitions([reportingV1Service])

await writeFile('purista.definitions.json', `${JSON.stringify(definitions, null, 2)}\n`)
