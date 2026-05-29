---
title: Version 1.10
longTitle: Version 1.10
description: PURISTA TypeScript Cloud Framework v1.10 - cloud tools
date: 2024-01-30
order: 20240130
image: /graphic/v1-10-0.jpeg
---


---

## Website

The website is now based on [VitePress](https://vitepress.dev), and the handbook and help content will be migrated, extended, and updated over time.

## CLI

The CLI has been upgraded to support ESM modules.  
Because of this, Vitest will be installed by default as the test framework if module resolution is set to ESM.

## New Packages

## Stores

In version 1.10.0, the following stores are now available:

- [AWS secret store](../handbook/2_building_business-logic/stores/secret-stores.md)
- [AWS config store](../handbook/2_building_business-logic/stores/config-stores.md)
- [Azure secret store](../handbook/2_building_business-logic/stores/secret-stores.md)
- [Google Cloud secret store](../handbook/2_building_business-logic/stores/secret-stores.md)

## Hono based HTTP server

We now introduce the new [Hono](https://hono.dev/) based HTTP server service.

This allows us to support more runtimes even better.  

Check out: [HTTP Server](../handbook/3_eco_system/http_server.md)

## Improvements

### Invoking commands

Invoking commands has been refactored. While the old style should work as before, it has been deprecated.  

Please see: [Invoke other Command](../handbook/2_building_business-logic/command/invoke_command_from_command.md)

### Schemas

PURISTA now supports a broad range of schema libraries, thanks to [TypeSchema](https://typeschema.com/#coverage).
It is highly recommended to use [Zod](https://zod.dev), as it is the officially supported schema library. However, if you already have schemas, many of them can now be used directly.
