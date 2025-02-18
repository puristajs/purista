import type { WriteStream } from 'node:fs'
import { createWriteStream } from 'node:fs'
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

import { rimraf } from 'rimraf'
import ts from 'typescript'

import type { ServiceBuilder } from '../ServiceBuilder/ServiceBuilder.impl.js'
import type { HttpExposedServiceMeta } from '../core/index.js'
import { GenericEventEmitter, isHttpExposedServiceMeta } from '../core/index.js'
import type { FullDefinition, FullServiceDefinition } from '../helper/index.js'
import { convertToCamelCase, mergeServiceDefintion } from '../helper/index.js'
import { puristaVersion } from '../version.js'
import { getWriter } from './getWriter.impl.js'
import { mergeIntoServiceDefintion } from './mergeIntoServiceDefintion.impl.js'
import { metaToFunctionBridge } from './metaToFunctionBridge.impl.js'
import { metaToFunctionHttp } from './metaToFunctionHttp.impl.js'
import { configFullSchema, configSchema } from './schema/configSchema.js'
import type { ClientBuilderEvents } from './types/ClientBuilderEvents.js'
import type { Config, ConfigFull } from './types/Config.js'

export const CONFIG_FILE_NAME = 'purista.client.json'

/**
 * ClientBuilder to generate clients, based on service definitions.
 */
export class ClientBuilder extends GenericEventEmitter<ClientBuilderEvents> {
	public config: ConfigFull

	/**
	 * The root file from where the relative paths are resolved.
	 * Defaults to current users directory
	 */
	public rootPath = process.cwd()

	constructor(config?: Partial<Config>) {
		super()
		this.config = configFullSchema.parse({
			version: puristaVersion,
			definitionPath: './definitions',
			outputPath: './dist',
			buildAs: 'both',
			...config,
			httpClient: {
				clientName: 'HttpClient',
				...config?.httpClient,
			},
			eventBridgeClient: {
				clientName: 'EventBridgeClient',
				...config?.eventBridgeClient,
			},
			package: {
				name: 'my-custom-client-package',
				description: 'The client library package for a PURISTA based application',
				private: true,
				...config?.package,
			},
		})
	}

	/**
	 * Loads the config fom JSON file.
	 * If no path is provided, it will try to load the config from purista.client.json in rootPath directory
	 * @param path
	 */
	async loadConfig(path?: string) {
		const p = path ?? join(this.rootPath, CONFIG_FILE_NAME)
		const content = await readFile(p)
		const parsedContent = JSON.parse(content.toString('utf-8'))
		const config = configSchema.parse(parsedContent)

		this.config = configFullSchema.parse({
			...config,
			httpClient: {
				buildAs: 'esm',
				clientName: 'HttpClient',
				...config?.httpClient,
			},
			eventBridgeClient: {
				...config?.eventBridgeClient,
			},
		})
	}

	/**
	 * Gets the definitions from the provided service builders
	 */
	async getDefinitionsFromServiceBuilders(serviceBuilders: ServiceBuilder[]) {
		const services: FullServiceDefinition = {}

		for (const builder of serviceBuilders) {
			const definition = await builder.getFullServiceDefintion()
			mergeServiceDefintion(services, definition)
		}

		return services
	}

	/**
	 * Writes the config to a config file.
	 * Defaults to purista.client.json in rootPath directory
	 *
	 * @param path
	 */
	async writeConfig(path?: string) {
		const p = path ?? join(this.rootPath, CONFIG_FILE_NAME)
		await writeFile(p, JSON.stringify(this.config, null, 2))
	}

	/**
	 * Resolves the definitions folder path from config with rootPath
	 * @returns path of definitions folder
	 */
	getDefinitionPath() {
		return join(this.rootPath, this.config.definitionPath)
	}

	/**
	 * Resolves the output folder path from config with rootPath
	 * @returns path of output folder
	 */
	getOutputPath() {
		return join(this.rootPath, this.config.outputPath)
	}

	/**
	 * Deletes the content of the output folder.
	 * Should be called before generating the client
	 * @returns
	 */
	async cleanDistFolder() {
		await rimraf(this.getOutputPath())
		await mkdir(this.getOutputPath())
		await mkdir(join(this.getOutputPath(), 'src'))
	}

	/**
	 * Creates a index.ts file which exports the client(s) and types.
	 * Is used in generated package.json
	 */
	async createIndex() {
		const ext = this.config.buildAs !== 'commonjs' ? '.js' : ''

		const writer = getWriter()

		const path = join(this.getOutputPath(), 'src')

		const files = await readdir(path)
		for (const file of files) {
			if (!file.endsWith('.ts')) {
				continue
			}
			writer.writeLine(`export * from './${file.replace('.ts', ext)}'`)
		}

		await writeFile(join(path, 'index.ts'), writer.toString())
	}

	/**
	 * Creates a package.json file in the output folder.
	 * Exports the files which are build by tsc based on generated client files
	 */
	async createPackageJson() {
		const hasEsm = this.config.buildAs !== 'commonjs'
		const hasCommonJs = this.config.buildAs !== 'esm'

		const packageJson: Record<string, any> = {
			name: 'my-client',
			description: 'The client library package for a PURISTA based application',
			private: true,
			type: hasEsm ? 'module' : 'commonjs',
			exports: {
				'./package.json': './package.json',
				'.': {},
			},
			devDependencies: {
				'@purista/core': 'latest',
			},
			...this.config.package,
		}

		if (hasCommonJs) {
			packageJson.main = './dist/commonjs/index.js'
			packageJson.types = './dist/commonjs/index.d.ts'
			packageJson.exports['.'] = {
				...packageJson.exports['.'],
				require: {
					types: './dist/commonjs/index.d.ts',
					default: './dist/commonjs/index.js',
				},
			}
		}

		if (hasEsm) {
			packageJson.exports['.'] = {
				...packageJson.exports['.'],
				import: {
					types: './dist/esm/index.d.ts',
					default: './dist/esm/index.js',
				},
			}
		}

		await writeFile(join(this.getOutputPath(), 'package.json'), JSON.stringify(packageJson, null, 2))
	}

	/**
	 * Runs the tsc against the generated ts source files.
	 * Depending on settings, it will generate ESM and/or commonJS files
	 */
	build() {
		const hasEsm = this.config.buildAs !== 'commonjs'
		const hasCommonJs = this.config.buildAs !== 'esm'

		if (hasEsm) {
			const esmOptions: ts.CompilerOptions = {
				declaration: true,
				outDir: join(this.getOutputPath(), 'dist', 'esm'),
				target: ts.ScriptTarget.ES2022,
				module: ts.ModuleKind.NodeNext,
				skipLibCheck: true,
				moduleResolution: ts.ModuleResolutionKind.NodeNext,
			}

			this.compile([join(this.getOutputPath(), 'src', 'index.ts')], esmOptions, 'ESM')
		}

		if (hasCommonJs) {
			const commonJsOptions: ts.CompilerOptions = {
				declaration: true,
				outDir: join(this.getOutputPath(), 'dist', 'commonjs'),
				skipLibCheck: true,
				target: ts.ScriptTarget.ES2015,
				module: ts.ModuleKind.CommonJS,
			}

			this.compile([join(this.getOutputPath(), 'src', 'index.ts')], commonJsOptions, 'CommonJs')
		}
	}

	/**
	 * Internal helper for compiling typescript files
	 * @param fileNames
	 * @param options
	 * @param type
	 */
	private compile(fileNames: string[], options: ts.CompilerOptions, type: string) {
		const program = ts.createProgram(fileNames, options)

		const emitResult = program.emit()

		const allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics)

		for (const diagnostic of allDiagnostics) {
			if (diagnostic.file && diagnostic.start) {
				const { line, character } = ts.getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start)
				const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')
				this.emit('warn', `${type} build: ${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`)
			} else {
				this.emit('warn', `${type} build: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')}`)
			}
		}

		const exitCode = emitResult.emitSkipped ? 1 : 0
		if (exitCode) {
			this.emit('error', `${type} build: process exiting with code '${exitCode}'.`)
			throw new Error(`${type} build: process exiting with code '${exitCode}'.`)
		}
		this.emit('success', `${type} build done`)
	}

	/**
	 * Loads the definitions from JSON files
	 * @param path
	 * @returns
	 */
	async loadDefinitionFiles(path?: string): Promise<FullServiceDefinition> {
		this.emit('start', 'Start reading definitions')

		const services: FullServiceDefinition = {}

		const p = path ?? this.getDefinitionPath()

		const files = await readdir(p)
		for (const file of files) {
			if (!file.endsWith('.json')) {
				continue
			}
			try {
				const content = await readFile(join(p, file), { encoding: 'utf8' })

				const json: FullDefinition = JSON.parse(content)

				if (json.services) {
					mergeIntoServiceDefintion(services, json.services)
					this.emit('success', file)
				}
			} catch (error) {
				this.emit('error', error as Error)
			}
		}

		return services
	}

	/**
	 * Generates the zero-dependency HTTP client source files
	 * @param serviceDefinition
	 */
	async generateHttpClient(serviceDefinition: FullServiceDefinition) {
		const ext = this.config.buildAs !== 'commonjs' ? '.js' : ''

		const clientStream = createWriteStream(join(this.getOutputPath(), 'src', 'http_client.ts'))
		const typeStream = createWriteStream(join(this.getOutputPath(), 'src', 'types_http_client.ts'))

		typeStream.write(this.getHttpClientConfigTypeString())

		const clientWriter = getWriter()

		clientWriter
			.writeLine(`import * as ClientType from './types_http_client${ext}'`)
			.blankLine()
			.writeLine(`export class ${this.config.httpClient.clientName} {`)
			.blankLine()
			.writeLine(
				"public __config__: Omit<ClientType.HttpClientOptions, 'baseUrl' | 'traceIdHeaderName'> & {baseUrl: string, traceIdHeaderName: string}",
			)
			.blankLine()
			.withIndentationLevel(1, () => {
				clientWriter.write('constructor(config?: ClientType.HttpClientOptions)').block(() => {
					clientWriter
						.write('this.__config__ = ')
						.block(() => {
							clientWriter.writeLine(`baseUrl: 'http://localhost:3000/api',`)
							clientWriter.writeLine('defaultTimeout: 30000,')
							clientWriter.writeLine('isKeepAlive: true,')
							clientWriter.writeLine("traceIdHeaderName: 'x-trace-id',")
							clientWriter
								.write('defaultHeaders: ')
								.inlineBlock(() => {
									clientWriter.writeLine("'Content-Type': 'application/json; utf-8',")
								})
								.write(',')
							clientWriter.writeLine('...config,')
						})
						.blankLine()
				})
			})

		clientStream.write(clientWriter.toString())
		clientStream.write(`
  /**
   * Helper to create the url and HTTP headers
   * @param path 
   * @param options 
   * @returns 
   */
  private __getUrlAndHeader__(path: string, options?: ClientType.HttpClientRequestOptions, traceId?: string) {
    let fullPath = [...new URL(this.__config__.baseUrl).pathname?.split('/'),...path.split('/')].filter(p=>p).join('/')
    if (options?.hash) {
      fullPath += \`#\${options.hash}\`
    }

    const url = new URL(fullPath, this.__config__.baseUrl)

    for (const [key, value] of Object.entries(options?.query ?? {})) {
      url.searchParams.set(key, value)
    }

    if (this.__config__.basicAuth) {
      url.password = this.__config__.basicAuth.password
      url.username = this.__config__.basicAuth.username
    }

    const headers: Record<string, string> = {
      ...this.__config__.defaultHeaders,
      ...options?.headers,
    }

    if (this.__config__.bearerToken) {
      headers['Authorization'] = \`Bearer \${this.__config__.bearerToken}\`
    }

    if(traceId) {
      headers[this.__config__.traceIdHeaderName ?? 'x-trace-id'] = traceId
    }

    return {
      url,
      headers,
    }
  }

  /**
   * Set the bearer token for requests
   * */
  __setBearerToken__(bearerToken:string | undefined){
    this.__config__.bearerToken = bearerToken
  }

  /**
   * Helper method
   * @param method
   * @param path
   * @param options
   * @param payload
   * @param traceId
   * @throws Error
   * @returns
   */
  private async __execute__(method: string, path: string, options?: ClientType.HttpClientRequestOptions, payload?: unknown, trace?: string) {
    const traceId = trace ?? crypto.randomUUID()
    const { url, headers } = this.__getUrlAndHeader__(path, options, traceId)

    const controller = new AbortController()
    const timeoutValue = options?.timeout ?? this.__config__.defaultTimeout
    const timeout = setTimeout(() => {
      controller.abort(
        new HttpError(408, method, url.toString(), \`Request timeout exceeded \${timeoutValue} ms\`, undefined, traceId),
      )
    }, timeoutValue)

    let body: string | undefined

    if (typeof payload === 'string') {
      body = payload
    } else {
      body = payload ? JSON.stringify(payload) : undefined
    }

    try {
      const response = await fetch(url, {
        method,
        signal: controller.signal,
        keepalive: this.__config__.isKeepAlive,
        headers,
        credentials: 'include',
        body,
      })

      if (!response.ok) {
        let body = ''
        if (response.headers.get('content-type')?.startsWith('application/json')) {
          body = await response.json()
        } else {
          body = await response.text()
        }
        

        const headers = Array.from(response.headers)

        throw new HttpError(response.status, method, url.toString(), \`\${response.statusText}\`, body, traceId)
      }

      if (response.status === 204) {
        return undefined
      }

      if (response.headers.get('content-type')?.startsWith('application/json')) {
        return await response.json()
      }
      return response.text()
    } finally {
      clearTimeout(timeout)
    }
  }
    `)

		await this.generateHttpClientSource(clientStream, typeStream, serviceDefinition)

		clientStream.write('}')

		clientStream.write(this.getHttpErrorClassString())

		await Promise.all([
			new Promise((resolve, _reject) => clientStream.end(() => resolve(undefined))),
			new Promise((resolve, _reject) => typeStream.end(() => resolve(undefined))),
		])
	}

	/**
	 * Helper function which generates the getters
	 * @param clientStream
	 * @param typeStream
	 * @param serviceDefinitions
	 */
	private async generateHttpClientSource(
		clientStream: WriteStream,
		typeStream: WriteStream,
		serviceDefinitions: FullServiceDefinition,
	) {
		for (const [serviceName, serviceDefinition] of Object.entries(serviceDefinitions)) {
			const writer = getWriter()
			writer.newLine().withIndentationLevel(1, () => {
				writer
					.writeLine(`/** Service ${serviceName} */`)
					.write(`get ${convertToCamelCase(serviceName)}()`)
					.block(() => {
						const s = Object.entries(serviceDefinition).reduce(
							(input, [serviceVersion, def]) => {
								const commands = Object.values(def.commands).filter(cmdDef => isHttpExposedServiceMeta(cmdDef.metadata))

								if (!commands.length) {
									return input
								}

								return {
									// biome-ignore lint/performance/noAccumulatingSpread: <explanation>
									...input,
									[serviceVersion]: commands.reduce((ret: string[], httpDef) => {
										const meta = httpDef.metadata as unknown as HttpExposedServiceMeta
										const { functionString, typeString } = metaToFunctionHttp(
											serviceName,
											serviceVersion,
											httpDef.commandName,
											meta,
										)
										typeStream.write(typeString)
										const final = ret
										final.push(`/** ${httpDef.commandDescription}  */`, `${httpDef.commandName}: ${functionString},`)
										return final
									}, [] as string[]),
								}
							},
							{} as { [key: string]: string[] },
						)

						writer.write('return').block(() => {
							for (const [serviceVersion, def] of Object.entries(s)) {
								this.emit('info', `${serviceName} version ${serviceVersion}`)
								writer.write(`'v${serviceVersion}':`).block(() => {
									for (const line of def) {
										writer.writeLine(line)
									}
								})
							}
						})
					})
					.newLine()
			})

			clientStream.write(writer.toString())
		}
	}

	/**
	 * Generates the correlating type file
	 * @returns
	 */
	private getHttpClientConfigTypeString() {
		const writer = getWriter()

		writer.write('export type HttpClientOptions = ').block(() => {
			writer.writeLine('/**')
			writer.writeLine('* the base url to be used')
			writer.writeLine('* @example')
			writer.writeLine('* ```typescript')
			writer.writeLine('* const config = {')
			writer.writeLine("*   baseUrl: 'http://localhost/api`")
			writer.writeLine('* }')
			writer.writeLine('* // each request will be below http://localhost/api')
			writer.writeLine("* // get('v1/orders') will call http://localhost/api/v1/orders")
			writer.writeLine('* ```')
			writer.writeLine('* */')
			writer.writeLine('baseUrl?: string')

			writer.writeLine('/**')
			writer.writeLine('* If set to false, the HTTP client will not reuse the same connection for multiple requests.')
			writer.writeLine('* @default true')
			writer.writeLine('*/')
			writer.writeLine('isKeepAlive?: boolean')

			writer.writeLine('/**')
			writer.writeLine('* The header name for custom trace id')
			writer.writeLine('* @default x-trace-id')
			writer.writeLine('*/')
			writer.writeLine('traceIdHeaderName?: string')

			writer.writeLine('/**')
			writer.writeLine('* Add your default headers here')
			writer.writeLine('* These headers will be part of every request.')
			writer.writeLine('* They can be overwritten per request option')
			writer.writeLine('* */')
			writer.writeLine('defaultHeaders?: Record<string, string>')

			writer.writeLine('/**')
			writer.writeLine('* set global timeout for requests in ms')
			writer.writeLine('* @default 30000')
			writer.writeLine('*/')
			writer.writeLine('defaultTimeout?: number')

			writer.writeLine('/**')
			writer.writeLine('* Basic-Auth information')
			writer.writeLine('*/')
			writer.write('basicAuth?: ').block(() => {
				writer.writeLine('/** Basic-Auth username */')
				writer.writeLine('username: string')
				writer.writeLine('/** Basic-Auth password */')
				writer.writeLine('password: string')
			})

			writer.writeLine('/** Auth-Bearer token */')
			writer.writeLine('bearerToken?: string')
		})

		writer.blankLine()
		writer.write('export type HttpClientRequestOptions = ').block(() => {
			writer
				.writeLine('/**')
				.writeLine('* additional headers')
				.writeLine('*/')
				.writeLine('headers?: Record<string, string>')
				.writeLine('/**')
				.writeLine('* query/search string parameter')
				.writeLine('*/')
				.writeLine('query?: Record<string, string>')
				.writeLine('/**')
				.writeLine('* url hash')
				.writeLine('* @example: http://example.com/index.html#hash')
				.writeLine('*/')
				.writeLine('hash?: string')
				.writeLine('/**')
				.writeLine('* Timeout for the request in ms')
				.writeLine('* @default 30000')
				.writeLine('*/')
				.writeLine('timeout?: number')
		})

		return writer.toString()
	}

	/**
	 * Returns the source of HttpError class as string.
	 * @returns
	 */
	private getHttpErrorClassString() {
		const writer = getWriter()

		writer.write('export class HttpError extends Error ').block(() => {
			writer
				.write(
					'constructor(public errorCode: number, public method: string, public url: string, message: string, public data?: unknown, public traceId?: string)',
				)
				.block(() => {
					writer
						.writeLine('super(message)')
						.writeLine('Error.captureStackTrace(this, this.constructor)')
						.writeLine('Object.setPrototypeOf(this, HttpError.prototype)')
						.writeLine('this.name = this.constructor.name')
				})
				.blankLine()
				.write('getErrorResponse(traceId?: string) ')
				.block(() => {
					writer
						.write('const errorResponse = Object.freeze(')
						.block(() => {
							writer
								.writeLine('status: this.errorCode,')
								.writeLine('message: this.message,')
								.writeLine('data: this.data,')
								.writeLine('traceId: this.traceId ?? traceId,')
								.writeLine('url: this.url,')
						})
						.writeLine(')')
						.writeLine('return errorResponse')
				})
				.blankLine()
				.write('toString()')
				.block(() => {
					writer.writeLine('return JSON.stringify(this.getErrorResponse())')
				})
				.blankLine()
				.write('toJSON()')
				.block(() => {
					writer.writeLine('return { stack: this.stack, name: this.name, ...this.getErrorResponse() }')
				})
		})

		return writer.toString()
	}

	/**
	 * Generates the zero-dependency HTTP client source files
	 * @param serviceDefinition
	 */
	async generateHEventBridgeClient(serviceDefinition: FullServiceDefinition) {
		const ext = this.config.buildAs !== 'commonjs' ? '.js' : ''

		const clientStream = createWriteStream(join(this.getOutputPath(), 'src', 'eventbridge_client.ts'))
		const typeStream = createWriteStream(join(this.getOutputPath(), 'src', 'types_eventbridge_client.ts'))

		const clientWriter = getWriter()

		clientWriter
			.writeLine(`import type { EventBridge } from '@purista/core'`)
			.blankLine()
			.writeLine(`import * as ClientType from './types_eventbridge_client${ext}'`)
			.blankLine()
			.writeLine(`export class ${this.config.eventBridgeClient.clientName} {`)
			.blankLine()
			.withIndentationLevel(1, () => {
				clientWriter.write('constructor(public __eventBridge__: EventBridge)').block(() => {})
			})

		clientStream.write(clientWriter.toString())

		const typeWriter = getWriter()

		typeWriter.write('export type InvokeOptions = ').block(() => {
			typeWriter.write('traceId?: string,')
			typeWriter.write('principalId?: string,')
			typeWriter.write('tenantId?: string,')
		})

		typeStream.write(typeWriter.toString())

		await this.generateEventBridgeClientSource(clientStream, typeStream, serviceDefinition)

		clientStream.write('}')

		await Promise.all([
			new Promise((resolve, _reject) => clientStream.end(() => resolve(undefined))),
			new Promise((resolve, _reject) => typeStream.end(() => resolve(undefined))),
		])
	}

	private generateEventBridgeClientSource(
		clientStream: WriteStream,
		typeStream: WriteStream,
		serviceDefinitions: FullServiceDefinition,
	) {
		for (const [serviceName, serviceDefinition] of Object.entries(serviceDefinitions)) {
			const writer = getWriter()
			writer.newLine().withIndentationLevel(1, () => {
				writer
					.writeLine(`/** Service ${serviceName} */`)
					.write(`get ${convertToCamelCase(serviceName)}()`)
					.block(() => {
						const s = Object.entries(serviceDefinition).reduce(
							(input, [serviceVersion, def]) => {
								const commands = Object.values(def.commands)

								if (!commands.length) {
									return input
								}

								return {
									// biome-ignore lint/performance/noAccumulatingSpread: <explanation>
									...input,
									[serviceVersion]: commands.reduce((ret: string[], httpDef) => {
										const meta = httpDef.metadata as unknown as HttpExposedServiceMeta
										const { functionString, typeString } = metaToFunctionBridge(
											serviceName,
											serviceVersion,
											httpDef.commandName,
											meta,
											this.config.eventBridgeClient.clientName,
										)
										typeStream.write(typeString)
										const final = ret
										final.push(`/** ${httpDef.commandDescription}  */`, `${httpDef.commandName}: ${functionString},`)
										return final
									}, [] as string[]),
								}
							},
							{} as { [key: string]: string[] },
						)

						writer.write('return').block(() => {
							for (const [serviceVersion, def] of Object.entries(s)) {
								this.emit('info', `${serviceName} version ${serviceVersion}`)
								writer.write(`'v${serviceVersion}':`).block(() => {
									for (const line of def) {
										writer.writeLine(line)
									}
								})
							}
						})
					})
					.newLine()
			})

			clientStream.write(writer.toString())
		}
	}

	/**
	 * Destroys the builder and cleans the event listeners
	 */
	destroy() {
		this.removeAllListeners()
	}
}
