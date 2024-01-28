---
title: Zipkin
description: Use Opentelemetry with Zipkin to trace PURISTA based typescript applications
order: 409000
---

# Zipkin

![Zipkin](/graphic/zipkin_screenshot.png)
__Official website: [Zipkin](https://zipkin.io)__

See it in action and try out!
You will need docker and docker-compose installed at your machine.
At the [PURISTA repository](https://github.com/sebastianwessel/purista) in `examples/fullexample` you will find a running example:

Start the required docker containers:

```bash
npm run zipkin:up
```

Open the Zipkin in your browser: <ExternalLink href="http://localhost:9411" />.

Start the example:

```bash
npm run zipkin:start
```

To generate some traces, go to the OpenAPI UI at <ExternalLink href="http://localhost:8080" /> and call some commands.
To stop and cleanup and stop all docker containers:

```bash
npm run zipkin:down
```
