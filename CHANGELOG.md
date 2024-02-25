# Changelog

All notable changes to this project will be documented in this file.

## [1.11.0] - 2024-02-25

### Bug Fixes

- Esm imports
- Warning on default stores
- Pr workflow

### Documentation

- Update temporal example
- Update handbook links in doc index
- Update api documentation
- Update api documentation
- Update temporal integration
- Update schema documentation
- Add and improve doc
- Fix typo

### Miscellaneous Tasks

- Mark example package private
- Context store getter functions
- Cleanup project config and settings
- Update vscode settings
- Update tsconfig.json files
- Improve typing for custom stores
- Improve store doc & types
- Fix tests
- Fixup store unit tests
- Add github workflow for update website
- Update project config
- Update doc output folder
- Update workflow
- Update workflow
- Update workflow
- Update package.lock
- Update workflow
- Update workflow config
- Update workflow
- Remove docs and improve workflow
- Update doc build output folder
- Add publish package workflow
- Set action environment
- Test github action
- Update workflows
- Fix workflow
- Fix workflow
- Update workflows
- Reduce code and dependencies
- Cleanup code
- Update code and doc to use await on getInstance
- Improve code and fix test
- Collect coverage from unit and integration tests
- Minor improvements
- Migrate and finalize example tests
- Include examples in tests
- Minor improvements and cleanups
- Update lint config
- Lint prefer using nullish coalescing operator
- Fix publish workflow
- Update publish workflow
- Update publish workflow
- Bump minor version to v1.11.0
- Update publish workflow
- Cleanup workflow names
- Include changelog in release workflow

## [1.10.8] - 2024-02-18

### Bug Fixes

- Cli init index event bridge configs
- Hono server when no protect handler is provided
- NATS example

### Documentation

- Update docs and examples

### Miscellaneous Tasks

- Bump vitest version
- Add eslint vitest globals plugin
- Improve naming
- Improve NATS bridge
- Improve cli install
- Fix lint and improve tests
- Update project settings
- Bump versions to 1.10.8

## [1.10.7] - 2024-02-18

### Bug Fixes

- CLI init
- NATS state store getter

### Documentation

- Update handbook
- Update api documentation
- Update doc

### Features

- Add version check to CLI

### Miscellaneous Tasks

- Improve store getter types and code cleanup in stores
- Bump packages
- Update package lock
- Fix lint
- Fix store tests
- Use vitest instead of jest
- Fix tests
- Disable unstable integration tests
- Impove test setup
- Improve test
- Increase vitest hookTimeout
- Bump versions to 1.10.7

## [1.10.6] - 2024-02-15

### Bug Fixes

- Mocked context invoke

### Miscellaneous Tasks

- Bump versions to 1.10.6

## [1.10.5] - 2024-02-15

### Bug Fixes

- Mutable obj issue in context mocks

### Miscellaneous Tasks

- Bump versions to 1.10.5

## [1.10.4] - 2024-02-15

### Bug Fixes

- Mutable issue in createInvokeFunctionProxy

### Miscellaneous Tasks

- Bump versions to 1.10.4

## [1.10.3] - 2024-02-14

### Bug Fixes

- Hono webserver request content type

### Miscellaneous Tasks

- Bump versions to 1.10.3

## [1.10.2] - 2024-02-14

### Miscellaneous Tasks

- Minor fixes and dep updates
- Bump versions to 1.10.2

## [1.10.1] - 2024-02-14

### Bug Fixes

- Hono vars

### Documentation

- Update doc
- Chore update
- Fix analytics
- Update
- Update

### Miscellaneous Tasks

- Bump versions to 1.10.1

## [1.10.0] - 2024-02-11

### Bug Fixes

- Version bump for new packages
- Hono based servers compress issue
- UnhandledError.fromError returns UnhandledError
- Minor code smells
- Keep OT traceId and custom trace id separated
- OpenApi path parameter and add example
- Add missing type params
- Refactor type handling in builders fixes #159
- SafeBind
- Package.json files use dist instead of lib
- Service config type in service builder getInstance
- Test

### Documentation

- Add new packages to api docs
- Migrate to vitepress #152
- Add schema page
- Fix k8s examples
- Minor readme changes
- Update documentation
- Fix api doc generation
- Update doc
- Update doc

### Features

- Add secret store for AWS Secrets Manager #106
- Add cache map to basic config store class
- Add config store for AWS Systems Manager Parameter Store #104
- Add secret star for Azure Key Vault #107
- Add chained invoke functions in commands and subscriptions #149
- Hono based web server  #153
- Allow different schema libs #154
- Add schema for custom emit and improve types #158
- Add dynamic route registration to hono server
- Add esm support to cli
- CLI support for ESM, vitest and Biome
- Cli add parameter type and schema per default to subscriptions

### Miscellaneous Tasks

- Minor cleanup
- Bump dependency versions
- Fix typo
- Fix test setup
- Update nvmrc to node 20
- Improve logger
- Add lint rule to force imports with type scope
- Make props available in subclass in HttpClient
- Prepare esm support in purista cli
- Improve imports to use type imports
- Simplify stores and cleanup code
- Refactor code base to ESM #147
- Update vuepress setup
- Bump dependency versions
- Exclude test files from npm packages
- Dev env should use repo typescript version
- Improve error handling
- Bump dependency versions
- Fix lint
- Exclude tests from build
- Improve Hono types
- Add toJSON method to error classes
- Use PatternRouter instead of own implementation
- Remove unused dev dependencies
- Cleanup dependencies
- Bump dependencies to most recent
- Update and fix tests
- Remove deprecated method calls
- Update package-lock.json
- Bump dependencies
- Prevent multiple command endpoint registrations
- Use safeBind instead of bind to keep types
- Minor code improvements
- Minor improvements
- Improve example
- Minor improvements
- Bump dependencies
- Migrate to hono v4
- Minor improvements
- Add static file servering to example
- Improve tests
- Fix build package.json
- Bump versions to 1.10.0

## [1.9.1] - 2024-01-26

### Bug Fixes

- Filename typo in cli
- Set opentelemetry status on error in HttpClient
- Set span processor in service class

### Miscellaneous Tasks

- Lint
- Bump versions to 1.9.1

## [1.9.0] - 2023-11-18

### Bug Fixes

- InfisicalSecretStore docs

### Documentation

- Add Google Secret Manager secret store package
- Update api documentation
- Update documentation
- Update CHANGELOG

### Features

- Add caching option to secret store
- Add secret store for Google Cloud Secret Manager #108

### Miscellaneous Tasks

- Update dependencies
- Bump versions to 1.9.0

## [1.8.3] - 2023-10-19

### Documentation

- Update api documentation
- Update documentation
- Update CHANGELOG

### Features

- Make healthz function configurable
- Add optional openapi paths in config

### Miscellaneous Tasks

- Bump dependencies
- Update hono router
- Bump versions to 1.8.3

## [1.8.2] - 2023-09-27

### Bug Fixes

- Correct build config and upgrade esbuild
- Pass principalId and tenantId to response msg

### Documentation

- Update api documentation
- Update documentation
- Update CHANGELOG

### Miscellaneous Tasks

- Improve type imports
- Bump versions to 1.8.2

## [1.8.1] - 2023-09-12

### Bug Fixes

- Downgrade esbuild
- Traceparent handling in HttpServerService

### Documentation

- Update api documentation
- Update documentation
- Update CHANGELOG

### Miscellaneous Tasks

- Bump versions to 1.8.1

## [1.8.0] - 2023-09-09

### Bug Fixes

- Openapi security
- Improve mock of startActiveSpan and wrapInSpan
- Update InfisicalClient to api changes
- Http server service default config
- Handle traceId in HttpServerService correctly #140

### Documentation

- Update api documentation
- Update documentation
- Update CHANGELOG

### Features

- Add optional tenantId to message body #136
- Update to mqtt lib version 5

### Miscellaneous Tasks

- Update tsconfig
- Update packages
- Cleanup bun test
- Update github issue bug template
- Bump dependency versions
- Update package log
- Update build config
- Bump versions to 1.8.0

## [1.7.5] - 2023-07-06

### Bug Fixes

- Error handling

### Documentation

- Update api documentation
- Update documentation
- Update CHANGELOG

### Miscellaneous Tasks

- Bump versions to 1.7.5

## [1.7.4] - 2023-07-06

### Bug Fixes

- Make instanceof working with custom errors
- Cli package and add prettierrc file
- Lint
- Error handling

### Documentation

- Update api documentation
- Update documentation
- Update CHANGELOG
- Update api documentation
- Update documentation
- Update CHANGELOG

### Features

- Add readme files in code gen

### Miscellaneous Tasks

- Update dependencies
- Update deps in cli auto generator
- Update package.lock
- Bump versions to 1.7.3
- Use node 20 for develop
- Bump versions to 1.7.4

## [1.7.2] - 2023-06-10

### Bug Fixes

- Lint
- Error logging
- Remove cycling dependency
- Remove cycling dependency
- Export test
- TraceId in payload of error responses
- Missing receiver and sender in SubscriptionBuilder getDefinition
- AMQP bridge ack handling #72
- Improve gracefully shutdown of eventbridges
- Esbuild issue
- Redis state store and add integration test
- Issues and improve code and add inline documentation
- Strip and check query parameter
- Generate correlation id only once
- Use loglevel from config
- Typo
- Add types to exports in package.json
- Use correct package in examples
- Use function from core in generated code
- Rebuild packages after version bump to reflect correct version
- Version bump of state-store-redis
- Trace and log command error responses
- Mqtt command handler
- Disable durable for endpoint info subscription
- Setting instance id in event bridge
- Cli init template outdated fixes #128
- Cli init does not contain nats bridge #130
- Core package requires Hono package fixes #129
- Blueprint tsconfig files
- Deps in package.json
- Do not overwrite user config with defaults

### Depreciation

- FunctionDefinitionBuilder in favor of CommandDefinitionBuilder resolve #66
- Set/getFunction in SubscriptionDefinitionBuilder
- GetFunctionContextMock in favor of getCommandContextMock

### Documentation

- Update documentation
- Update code example
- Update documentation according to breaking changes
- Add blog to website
- Refactor handbook
- Update example
- Update doc structure
- Fix website setting
- Update documentation #97
- Revamp website #97
- Revamp example #96
- Update api documentation
- Update documentation
- Update CHANGELOG
- Update doc
- Add Product hunt upvote
- Update website
- Update website
- Update twitter img
- Add inline code documentation
- Improve doc
- Update dapr doc
- Update typedoc config and update packages
- Add postman collection to Dapr example
- Update block entry
- Update
- Update doc
- Update doc
- Update api documentation
- Update api documentation
- Update documentation
- Update CHANGELOG
- Add quickstart example code
- Update package readme files
- Update nav
- Add nats bridge info
- Update api documentation
- Update documentation
- Update CHANGELOG
- Add version 1.7 blog article
- Fix order of posts in blog
- Update api documentation
- Update documentation
- Update CHANGELOG
- Update outdated docs
- Update api documentation
- Update documentation
- Update CHANGELOG

### Features

- Implement OpenTelemetry into core resolve #63
- Subscribe to event now supports optional version parameter
- Add purista version to packages
- Add support for sinon sandbox in test helpers
- Simplify init logger - set default instead of required property
- Implement OpenTelemetry into AmqpBridge resolve #63
- Add @purista/cli package
- Implement purista cli
- Add EventBridge status check resolve #68
- Add /healthz endpoint to httpServer resolve #69
- Add string case helper functions
- Add operationId to OpenAPI schema resolve #77
- Provide an abstract secret store (getter) similar to event bridge #88
- Improve secret store #88
- Provide an abstract config store (getter) similar to event bridge  #87
- Provide an abstract key-value state store similar to event bridge #89
- Add OpenApi deprecated flag option #78
- Add predefined tests for service builder usage #100
- Add receiveMessageOnEveryInstance flag
- Add package @purista/redis-state-store #103
- Add k8s helper package #110
- Add helper and cleanup code
- Add Dapr eventbridge #85
- Add optional log level to general event bridge config
- Add HttpEventBridge and HttpClient
- Implement Dapr SDK
- MQTT eventBridge #98
- Add AMQP & MQTT bridges to cli tool
- Add js emit event to bridges
- NATS as message broker #112
- Add NATS JetStream state store package #124
- Redis config store #125
- NATS config store for JetStream enabled NATS server #126
- Infisical secret store #127

### Miscellaneous Tasks

- Bump dependency packages
- Update doc theme config
- Bump versions to 1.4.9
- Cleanup code structure
- Provide full example
- Update vuepress-theme-hope
- Correct vuepress packages
- Cleanup setup
- Improve automated document generation
- Use @swc/jest in favor of ts-jest
- Minor code cleanup
- Update package.lock
- Cleanup code - remove onSuccess and onError hook in favor of event listening
- Add cycling dependency checker
- Add inline documentation
- Fix file casing
- Fix git file casing
- Minor improvements
- Update github issue templates
- Evaluate bun and correct package.json duplicates resolve #74
- Add vscode launch jest single file execution
- Improve types and code cleanup
- Code cleanup
- Bump zod package versions
- Improve code and types
- Add fatal to logger mock and improve type
- Improve code, types and inline documentation
- Add unit tests #2
- Improve addQueryParameters types solves #90
- Update github issue templates
- Update github issue templates
- Update integration test #2
- Minor fix and improvements
- Remove spanProcessor parameter
- Minor code improvements
- Improve getter types in stores #87 #88
- Improve types
- Add warning
- Add inline doc #78
- Update test
- Add inline doc
- Update and improve cli #102
- Update gitignore
- Bump dependencies
- Set types because of package update
- Code and type improvements
- Improve code
- Update uptrace example config
- Refactor HttpserverService to ServiceBuilder #111
- Big code cleanup
- Update packages and project config
- Unify config handling in event bridge
- Minor output improvement
- Improve types
- Update project config
- Update package script
- Update packages
- Set current version
- Package
- Bump versions to 1.5.0
- Improve k8s-sdk
- Improve event bridge config typ
- Use node query parser instead of external qs package
- Require at least node v 18.15
- Use enum EventBridgeEventNames
- Cleanup code
- Improve span names
- Improve setup
- Improve k8s-sdk and enable http compression
- Improve setup
- Add testcontainers package
- Add test and cleanup and improve code
- Improve types
- Add test
- Minor fixes
- Update dependencies
- Remove async if not needed
- Use @hono/node-server 1.0.0-rc.1 with native fetch
- Log span context and traceId
- Add inline doc and cleanup code
- Minor changes
- Minor cleanup
- Bump versions to 1.6.0
- Update packages
- Add Teletrace example and docu #122
- Share bridge integration test setup
- Set hono router name
- Unify folder name to package name
- Minor opentelemetry improvements
- Update config
- Minor code improvements
- Update dependencies
- NATS only without durable
- Minor updates
- Cleanup
- Do not run release build parallel
- Bump versions to 1.7.0
- Disable coverage threshold for quickfix
- Bump versions to 1.7.1
- Cleanup tsconfig blueprint in cli tool
- Remove unused dependency
- Bump versions to 1.7.2

### Refactor

- Improve code and types and reduce complexity in DefaultEventBridge
- Improve code and types and reduce complexity in Service
- Unify logger name to be always logger

## [1.4.8] - 2022-10-09

### Bug Fixes

- [BUG] HttpServer onError hook does not return #55
- [BUG] OpenApi does not reflect multiple path parameter resolves #57
- Correct documentation generation

### Documentation

- Update documentation
- Update documentation

### Features

- Add token status codes

### Miscellaneous Tasks

- Bump versions to 1.4.7
- Bump version
- Bump dependencies
- Bump versions to 1.4.8

### Resolves

- [TASK] Add duplication check on service builder #54

## [1.4.6] - 2022-09-25

### Bug Fixes

- Package run command

### Documentation

- Update documentation

### Miscellaneous Tasks

- Bump versions to 1.4.6

## [1.4.5] - 2022-08-21

### Miscellaneous Tasks

- Correct tag

## [1.4.4] - 2022-08-21

### Bug Fixes

- Httpserver error response
- Improve types
- Use status 204 on empty response and log errors

### Documentation

- Add documentation
- Update api documentation
- Update documentation
- Update doc
- Update api doc
- Update documentation
- Update doc
- Update documentation
- Update documentation

### Miscellaneous Tasks

- Cleanup example
- Return trace id in response header
- Update dependencies
- Bump versions to 1.4.4

## [1.4.3] - 2022-07-31

### Documentation

- Update documentation

### Miscellaneous Tasks

- Add eslintignore
- Bump versions to 1.4.3

## [1.4.2] - 2022-07-31

### Bug Fixes

- Make testhelper package private
- Subscription builder typings
- CreateTestCommandResponseMsg helper return type

### Documentation

- Add google analytics
- Update documentation
- Add inline documentation
- Update handbook src
- Update documentation
- Update api docs
- Add and extend examples
- Update doc
- Update documentation
- Update documentation
- Update api documentation
- Update documentation
- Fix typos
- Update documentation
- Update documentation

### Features

- Add function context mocks and refactor mocks
- Refactor http server to use fastify and move to own package
- Update testhelper and example
- Create logger abstraction to allow different loggers
- Add service builder
- Add events to service and event bridge
- Add metric events
- Add principalId handling to httpserver service
- Add before response hook in http server solves #50

### Miscellaneous Tasks

- Add task template
- Add unit tests for core
- Improve types
- Update project config
- Improve file naming
- Make getErrorMessageForCode generic
- Improve code
- Update config
- Improve types, add instanceId
- Remove obsolete http-server code from core package
- Cleanup package json and minor fixes
- Move testhelper back to core to prevent cycling dependencies
- Improve types and subscription builder
- Use test helper in tests
- Update packages
- Minor cleanup
- Minor code cleanup
- Update packages
- Update test
- Bump versions to 1.4.0
- Bump versions to 1.4.1
- Update packages and config
- Cleanup simple example
- Bump versions to 1.4.2

### Refactor

- Default eventbridge and add function context

## [1.3.1] - 2022-06-23

### Documentation

- Add change log file #11
- Add simple example #5
- Update documentation
- Update documentation
- Add readme to packages
- Fix typos
- Add documentation for hooks
- Update documentation

### Features

- Add form multipart upload suppport to webserver
- [FEATURE-REQUEST] Add hooks #34
- Allow multiple hooks closes #34
- Improve service function hooks

### Miscellaneous Tasks

- Migrate to mono repo #31
- Add turbo
- Update project configs
- Build esm and commonjs
- Setup publish pipeline
- Bump versions to 1.3.0
- Update changelog
- Align command naming
- Correct file name
- Simplify typing
- Bump versions to 1.3.1

## [1.1.5] - 2022-05-15

### Bug Fixes

- Function builder

## [1.1.3] - 2022-05-15

### Bug Fixes

- Minor code fixes

### Features

- Add authorization method to openapi #32

### Miscellaneous Tasks

- Move test helper into own package #19

## [1.1.0] - 2022-05-14

### Bug Fixes

- Cookie handling
- Log traceId and service name + version #28
- Allow string array in headers

### Documentation

- Update documentation and website
- Update config and update generated docs
- Update doc
- Update building documentation
- Add costum events page dummy

### Features

- Unify ErrorStatus and SuccessStatus to StatusCode resolves #26
- Add traceId to handled and unhandled errors resolves #27
- Use promise.race instead timer interval #29
- Timed out invoke should send a info message #30
- Failing subscription should emit a info message #25
- Improve error handling - differentiate between handled and unhandled #24

### Miscellaneous Tasks

- Update website
- Code cleanup and update doc
- Fix lint

## [1.0.5] - 2022-05-11

### Bug Fixes

- Middleware response issue

## [1.0.4] - 2022-05-11

### Documentation

- Update documentation

### Miscellaneous Tasks

- Remove js files from linting

## [1.0.3] - 2022-05-10

### Bug Fixes

- [BUG] openapi3-ts dependency missing #14
- Use copressionMiddleware as default last middleware

### Documentation

- Add first simple documentation version resolves #4
- Add .nojekyll file to vuepress and doc folder
- Correct doc folders
- Minor improvements

### Features

- Add swagger ui

### Miscellaneous Tasks

- Initial
- Setup domain and gh-pages
- Install and setup vuepress
- Minor code cleanup
- Add vuepress config to lint ignore
- Add CNAME to doc public folder
- Update test config
- Improve test mock
- Fix package.json script

<!-- generated by git-cliff -->
