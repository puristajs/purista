---
order: 10
title: TRIGGERMESH
shortTitle: TRIGGERMESH
description: Temporal
tag:
  - triggermesh
---

[TRIGGER__MESH__](https://www.triggermesh.com) is a very interesting project.  
Currently, no software SDK's are provided to directly connect to TRIGGER__MESH__ from a typescript program. Because of this, there is currently no direct PURISTA integration planned.  

So, why is TRIGGER__MESH__ interesting?  
It allows integrating third party solutions or to connect different sources. The transform function allows a simple mapping of events to PURISTA message format. This means there is no need to develop the own adapters, which are running as 24/7 instance, with the need to administrate and maintain.

Connecting to different sources or targets can be moved to the infrastructure layer and custom code is reduced to simple transform functions.

As an example, here the AWS Event Bridge event is transformed to have a PURISTA message compatible payload:

```typescript
async (event) => {
  const timestamp = new Date(event.time).getTime(),

  const message = {
    id: event.id,
    instanceId: '',
    timestamp,
    contentType: 'application/json',
    contentEncoding: 'utf-8',
    messageType: 'customMessage',
    eventName: 'custom-event-name',
    principalId: account,
    sender: {
      serviceName: event.source.source,
      serviceVersion: event.version,
      serviceTarget: event.detail-type
    },
    payload: event.detail
  }

  event.detail = message

  return event;
}
```

__see [TRIGGERMESH](https://www.triggermesh.com)__

__You can follow updated on Twitter [@purista_js](https://twitter.com/purista_js) or join the [Discord server](https://discord.gg/9feaUm3H2v) to get in touch with PURISTA maintainers and other developers.__
