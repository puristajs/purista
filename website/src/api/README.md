PURISTA API - v1.4.9 / [Modules](modules.md)

# Changelog

All notable changes to this project will be documented in this file.

## [1.4.9] - 2023-02-06

### Bug Fixes

- Lint

### Miscellaneous Tasks

- Bump dependency packages
- Update doc theme config

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
