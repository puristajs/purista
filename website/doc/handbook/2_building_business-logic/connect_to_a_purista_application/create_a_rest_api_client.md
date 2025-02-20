---
title: REST API client
description: Export the service defintions to share them and to use them for building connectors or visualizations
order: 210020
---

# Create a REST API client

PURISTA provides the client builder, which allows you to create a zero dependency, fetch based REST API client.

The generated client will map the http exposed service commands, similar to the `service` in the context of commands and subscriptions.

The client builder requires the service definitions as input - see [Export Service Definitions](./export_service_definitions.md).

```typescript
const client = new HttpClient()

// client.[SERVICE_NAME].v[SERVICE_VERSION].[COMMAND_NAME]
const result = client.foo.v1.bar(payload, parameter)
```

## ClientBuilder

The client builder is very modular to give you the full control.  

```typescript
const config = config = {
  version: '1.11.0', // PURISTA version
  definitionPath: './definitions', // path of *.json files with definitions
  outputPath: './dist', // output folder
  httpClient: {
    buildAs: 'both', // 'esm' | 'commonjs' | 'both'
    clientName: 'HttpClient' // class name of client
  },
}

const clientBuilder = new ClientBuilder(config)

// generate the source files
await clientBuilder.generateHttpClient(defnitions)

// cleanup the builder and remove event listeners
clientBuilder.destroy()
```

### Logging

The client builder emits some information, which can be used for logging or for direct cli output.

```typescript
const config = {
  definitionPath: './definitions',
  outputPath: './dist',
  httpClient: {
    buildAs: 'both',
    clientName: 'HttpClient',
  },
}

const clientBuilder = new ClientBuilder(config)

clientBuilder.on('error', (...args) => console.error(...args)) // [!code ++]
clientBuilder.on('warn', (...args) => console.warn(...args)) // [!code ++]
clientBuilder.on('info', (...args) => console.info(...args)) // [!code ++]
clientBuilder.on('success', (...args) => console.info(...args)) // [!code ++]
clientBuilder.on('start', (...args) => console.log(...args)) // [!code ++]

// generate the source files
await clientBuilder.generateHttpClient(defnitions)

// cleanup the builder and remove event listeners
clientBuilder.destroy()
```

### Config file

Instead of using a hardcoded config, or the need to implement config persistence, the client builder comes with some handy functions.  
The config file is a simple json file.

```json
{
  "version": "1.11.0",
  "definitionPath": "./definitions",
  "outputPath": "./dist",
  "package": {
    "name": "@company/http-client",
    "description": "my custom client",
    "private": "true"
  },
  "httpClient": {
    "buildAs": "both",
    "clientName": "HttpClient"
  },
}
```

#### Write the config file

You can simply export the current configuration.

```typescript
const config = {
  definitionPath: './definitions',
  outputPath: './dist',
  httpClient: {
    buildAs: 'both',
    clientName: 'HttpClient',
  },
}

const clientBuilder = new ClientBuilder(config)
await clientBuilder.writeConfig()

clientBuilder.destroy()
```

The `.writeConfig` method has an optional parameter.  
Per default, the function will try to store the config in `purista.client.json` in the current users folder.  
Here you can provide a custom folder.

#### Load the config file

You can load a json config file with `.loadConfig()`.  
Per default, the function will try to load the config from `purista.client.json` in the current users folder.  

The method as an optional parameter, where you can provide a custom file location.

### Create package

```typescript
const config = {
  version: '1.11.0', // PURISTA version
  definitionPath: './definitions', // path of definitions
  outputPath: './dist', // output folder
  httpClient: {
    buildAs: 'both', // 'esm' | 'commonjs' | 'both'
    clientName: 'HttpClient' // class name of client
  },
}
```

## Complete code

This small code snipped can be used to create your client.

::: code-group

```typescript [generate.ts]
import { ClientBuilder } from '@purista/core'

const generate = async ()=> {
  const clientBuilder = new ClientBuilder()

  clientBuilder.on('error', (...args) => console.error(...args))
  clientBuilder.on('warn', (...args) => console.warn(...args))
  clientBuilder.on('info', (...args) => console.info(...args))
  clientBuilder.on('success', (...args) => console.info(...args))
  clientBuilder.on('start', (...args) => console.log(...args))

  // load the config from purista.client.json in current working directory
  await clientBuilder.loadConfig()

  try {
    // load the definitions from exported json files
    const defnitions = await clientBuilder.loadDefinitionFiles()

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
    console.error(error)
  } finally {
    // cleanup the builder and remove event listeners
    clientBuilder.destroy()
  }
}

generate()
```

```json [purista.client.json]
{
  "version": "1.11.0",
  "definitionPath": "./definitions",
  "outputPath": "./dist",
  "package": {
    "name": "@company/http-client",
    "description": "my custom client",
    "private": "true"
  },
  "httpClient": {
    "buildAs": "both",
    "clientName": "HttpClient"
  },
}
```

:::

Add your definitions as JSON files in the `./definitions` subfolder.  

::: tip
In a monorepo, you can directly use the definitions via imports.

```typescript
import { pingV1Service } from './backend/src/service/ping/v1/index.js' // [!code ++]
import { fooV1Service } from './backend/src/service/foo/v1/index.js' // [!code ++]
import { barV1Service } from './backend/src/service/bar/v1/index.js' // [!code ++]
// ....
// load the definitions from exported json files // [!code --]
const defnitions = await clientBuilder.loadDefinitionFiles() // [!code --]

// use definitions from imported service builders // [!code ++]
const serviceBuilders = [pingV1Service, fooV1Service, barV1Service] // [!code ++]
const defnitions = await clientBuilder.getDefinitionsFromServiceBuilders(serviceBuilders)
 // [!code ++]
// ....
```

:::

You can simply run this code:

```sh
tsx generate.ts
```
