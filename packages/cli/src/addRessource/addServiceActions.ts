/* eslint-disable no-console */
import camelCase from 'camelcase'
import type { Actions } from 'node-plop'

import { TEMPLATE_BASE } from '../config.js'
import { lintFiles } from '../manipulation/lintFiles.js'

export const addServiceActions: Actions = [
	{
		type: 'add',
		skipIfExists: true,
		path: 'src/service/ServiceEvent.enum.ts',
		templateFile: `${TEMPLATE_BASE}/src/service/serviceEvent.enum.ts.hbs`,
	},
	{
		type: 'add',
		skipIfExists: true,
		path: 'src/service/{{camelCase name}}/readme.md',
		templateFile: `${TEMPLATE_BASE}/src/service/serviceName/readme.md`,
	},
	{
		type: 'add',
		skipIfExists: true,
		path: 'src/service/{{camelCase name}}/general{{properCase name}}ServiceInfo.ts',
		templateFile: `${TEMPLATE_BASE}/src/service/serviceName/generalServicenameServiceInfo.ts.hbs`,
	},
	{
		type: 'add',
		skipIfExists: true,
		path: 'src/service/{{camelCase name}}/v{{version}}/readme.md',
		templateFile: `${TEMPLATE_BASE}/src/service/serviceName/v1/readme.md`,
	},
	{
		type: 'add',
		skipIfExists: true,
		path: 'src/service/{{camelCase name}}/v{{version}}/{{camelCase name}}V{{version}}Service.ts',
		templateFile: `${TEMPLATE_BASE}/src/service/serviceName/v1/servicenameV1Service.ts.hbs`,
	},
	{
		type: 'add',
		skipIfExists: true,
		path: 'src/service/{{camelCase name}}/v{{version}}/{{camelCase name}}V{{version}}Service.test.ts',
		templateFile: `${TEMPLATE_BASE}/src/service/serviceName/v1/servicenameV1Service.test.ts.hbs`,
	},
	{
		type: 'add',
		skipIfExists: true,
		path: 'src/service/{{camelCase name}}/v{{version}}/{{camelCase name}}V{{version}}ServiceBuilder.ts',
		templateFile: `${TEMPLATE_BASE}/src/service/serviceName/v1/servicenameV1Builder.ts.hbs`,
	},
	{
		type: 'add',
		skipIfExists: true,
		path: 'src/service/{{camelCase name}}/v{{version}}/index.ts',
		templateFile: `${TEMPLATE_BASE}/src/service/serviceName/v1/index.ts.hbs`,
	},
	{
		type: 'add',
		skipIfExists: true,
		path: 'src/service/{{camelCase name}}/v{{version}}/{{camelCase name}}ServiceConfig.ts',
		templateFile: `${TEMPLATE_BASE}/src/service/serviceName/v1/serviceNameServiceConfig.ts.hbs`,
	},
	async answers => {
		try {
			const files: string[] = [
				`src/service/${camelCase(answers.name, { pascalCase: false })}/general${camelCase(answers.name, {
					pascalCase: true,
				})}ServiceInfo.ts`,
				`src/service/${camelCase(answers.name, { pascalCase: false })}/v${answers.version}/${camelCase(answers.name)}V${
					answers.version
				}Service.ts`,
				`src/service/${camelCase(answers.name, { pascalCase: false })}/v${answers.version}/${camelCase(answers.name)}V${
					answers.version
				}Service.test.ts`,
				`src/service/${camelCase(answers.name, { pascalCase: false })}/v${answers.version}/${camelCase(answers.name)}V${
					answers.version
				}ServiceBuilder.ts`,
				`src/service/${camelCase(answers.name, { pascalCase: false })}/v${answers.version}/${camelCase(
					answers.name,
				)}ServiceConfig.ts`,
				`src/service/${camelCase(answers.name, { pascalCase: false })}/v${answers.version}/index.ts`,
				'src/service/ServiceEvent.enum.ts',
			]

			await lintFiles(files)
		} catch (error) {
			return 'Please check manually!'
		}
		return 'files updated'
	},
	answers => {
		return '📖 Learn more about PURISTA at https://purista.dev'
	},
]
