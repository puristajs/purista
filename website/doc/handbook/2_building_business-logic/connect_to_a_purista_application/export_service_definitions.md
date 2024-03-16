---
title: Export service definitions
description: Export the service defintions to share them and to use them for building connectors or visualizations
order: 210010
---

# Exporting Service Definitions

The concept of builders stems from the desire to efficiently access and process information about services, commands, subscriptions, events, endpoints, and more, in a manner conducive to sharing and automation. Hence, PURISTA offers the capability to export information from service builders as easily serializable JSON objects. These objects can be saved, shared, and processed as needed.

Exporting this information is a straightforward process.

```typescript
import { writeFile } from 'node:fs/promise'
import { join } from 'node:path'

import { exportServiceDefinitions } from '@purista/core'

import { pingV1Service } from './service/ping/v1/index.js'
import { fooV1Service } from './service/foo/v1/index.js'
import { barV1Service } from './service/bar/v1/index.js'

const exportDefinitions = async () => {

  const serviceBuilders = [pingV1Service, fooV1Service, barV1Service]

  const definitions = await exportServiceDefinitions(serviceBuilders)

  await writeFile(join(process.cwd(), 'defintions.json'), JSON.stringify(definitions, null ,2))
}
```

This small script exports the full service definitions of the provided service builders.  
It includes information about each command and each subscription, including the shape of inputs, outputs, custom events.  

The shape of the data looks like this:

```typescript
const definitions = {
  version: 'X.Y.Z', // the PURISTA version used to generate the definition
  services: {
    [serviceName]: {
      [serviceVersion]: {
        description: 'The description of the service version',
        deprecated: false, // indicates if the whole service is deprecated
        commands: {
          [commandName]: {
            commandName: 'foo',
            commandDescription: 'The description for foo',
            eventBridgeConfig: {
              durable: false,
              autoacknowledge: true,
              shared: true
            },
            metadata: {
              expose: {
                contentTypeRequest: 'application/json',
                contentEncodingRequest: 'utf-8',
                contentTypeResponse: 'application/json',
                contentEncodingResponse: 'utf-8',
                inputPayload: {
                  type: 'object',
                  properties: {
                    ping: {
                      type: 'string',
                      title: 'Ping input'
                    }
                  },
                  required: [
                    ping
                  ],
                  title: 'ping input payload schema'
                },
                parameter: {
                  // ...Schema
                },
                outputPayload: {
                  // ...schema
                },
                deprecated: false, // indicates if command is deprecated
                http: {
                  method: 'POST',
                  path: 'ping',
                  openApi: {
                    description: 'the ping command exposed as http endpoint',
                    summary: 'ping',
                    isSecure: false,
                    query: [
                      {
                        name: 'query',
                        required: false
                      }
                    ],
                    tags: ['OpenAPI_TAG'],
                    additionalStatusCodes: [],
                    operationId: 'ping'
                  }
                }
              }
            },
            eventName: 'fooed', // The event name
            hooks: {
              beforeGuard: {},
              afterGuard: {}
            },
            invokes: {
              [serviceName]: {
                [serviceVersion]: {

                }
              }
            },
            emitList: {
              [customEventName]: {
                // ...payload schema
              }
            }
          }
        }
        subscriptions: {
          [subscriptionName]
        }
      }
    }
  }
}
```
