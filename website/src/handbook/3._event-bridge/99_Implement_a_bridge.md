---
order: 99
title: Implement a custom event bridge
shortTitle: Custom event bridge
description: A deeper look into internals of PURISTA typescript application backend framework.
tag:
  - event bridge
---

An example for implementing a own custom event bridge will be available in the next time.  
In the meanwile, you can have a look into the `@purista/amqpbridge` package.  

Basically, you need to create a class, which extends the `EventBridgeBaseClass`.

```typescript
export class MyBridge extends EventBridgeBaseClass<MyConfig> implements EventBridge
}
```

__You can follow updated on Twitter [@purista_js](https://twitter.com/purista_js) or join the [Discord server](https://discord.gg/9feaUm3H2v) to get in touch with PURISTA maintainers and other developers.__
