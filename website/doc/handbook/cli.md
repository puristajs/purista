---
title: Installation & CLI
description: Use the PURISTA CLI to setup your project, create services, commands and subscriptions.
order: 30
---

# CLI

## Create a new project

The easiest and fastest way to start with PURISTA is the usage of your package managers `create` command.  

In the project folder, simply execute:

::: code-group

```bash [npm]
npm create purista@latest
```

```bash [bun]
bun create purista@latest
```

```bash [yarn]
yarn create purista@latest
```

```bash [pnpm]
pnpm create purista@latest
```

:::

The CLI tool will guide you through all the necessary steps.  

## PURISTA CLI

PURISTA provides a command line interface (CLI) that allows you to create new services, and add commands or subscriptions to existing services.  

__It is highly recommended to install the CLI global__.

You can manually install the PURISTA CLI via:

::: code-group

```bash [npm]
npm install -g @purista/cli
```

```bash [bun]
bun add --global @purista/cli
```

```bash [yarn]
yarn global add @purista/cli
```

```bash [pnpm]
pnpm add -g @purista/cli
```

:::

If you have installed the CLI globally, you can add service, commands and subscriptions to your project.  
In your project root simply run:

```bash
purista add [service|command|subscription]
```

## PURISTA config file

Since version 1.12.0, the PURISTA CLI expects to find a `purista.json` file in the root of your project. This file contains basic information about your project. Especially the settings for file and event casing conventions are important.

### Schema

This configuration file follows the [JSON Schema](https://json-schema.org/) specification.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": { ... }
}
```

### Configuration Options

#### `$schema`

- __**__Type:__**__ `string`
- __**__Description:__**__ A field for the [JSON schema](https://json-schema.org/) specification.

#### `runtime`

- __**__Type:__**__ `string`
- __**__Allowed Values:__**__ `node`, `bun`
- __**__Default:__**__ `node`
- __**__Description:__**__ Specifies the runtime environment for the project.

#### `eventBridge`

- __**__Type:__**__ `string`
- __**__Allowed Values:__**__ `default`, `amqp`, `nats`, `mqtt`, `dapr`
- __**__Default:__**__ `default`
- __**__Description:__**__ Defines the event bridge used in the project.

#### `fileConvention`

- __**__Type:__**__ `string`
- __**__Allowed Values:__**__ `camel`, `snake`, `kebab`, `pascal`, `pascalSnake`
- __**__Default:__**__ `camel`
- __**__Description:__**__ Determines the file naming convention used in the project.

#### `eventConvention`

- __**__Type:__**__ `string`
- __**__Allowed Values:__**__ `camel`, `snake`, `kebab`, `pascal`, `pascalSnake`, `constantCase`, `dotCase`, `pathCase`, `trainCase`
- __**__Default:__**__ `camel`
- __**__Description:__**__ Determines the naming convention for events in the project.

#### `linter`

- __**__Type:__**__ `string`
- __**__Allowed Values:__**__ `biome`, `eslint`, `none`
- __**__Default:__**__ `none`
- __**__Description:__**__ Specifies the linter used in the project.

#### `formatter`

- __**__Type:__**__ `string`
- __**__Allowed Values:__**__ `biome`, `prettier`, `none`
- __**__Default:__**__ `none`
- __**__Description:__**__ Specifies the formatter used in the project.

#### `servicePath`

- __**__Type:__**__ `string`
- __**__Default:__**__ `src/service`
- __**__Description:__**__ Defines the relative path where services are located in the project.

### Example `purista.json` Configuration

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "runtime": "node",
  "eventBridge": "nats",
  "fileConvention": "kebab",
  "eventConvention": "dotCase",
  "linter": "eslint",
  "formatter": "prettier",
  "servicePath": "src/services"
}
```
