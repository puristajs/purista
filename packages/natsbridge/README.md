# @purista/natsbridge

Package for using a [NATS](https://nats.io/) broker as event bridge.  
The event bridge supports brokers with and without JetStream enabled.

If JetStream is enabled, subscriptions which are marked as durable are persisted by using JetStream.  
If JetStream is not available, subscription fall back to live-subscriptions without any persistence.  

Example usage:

```typescript
import { NatsBridge } from '@purista/natsbridge'

// create and init our eventbridge
  const eventBridge = new NatsBridge()
  await eventBridge.start()

```

**Visit [purista.dev](https://purista.dev)**

**Follow on Twitter [@purista_js](https://twitter.com/purista_js)**  
**Join the [Discord Chat](https://discord.gg/9feaUm3H2v)**

<a href="https://www.producthunt.com/posts/purista?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-purista" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=386519&theme=light" alt="PURISTA - Typescript&#0032;framework&#0032;for&#0032;IoT&#0044;&#0032;microservices&#0044;&#0032;and&#0032;serverless | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>
