---
order: 50
title: Jaeger
shortTitle: Jaeger
description: Jaeger
image: https://purista.dev/graphic/jaeger_screenshot.png
cover: https://purista.dev/graphic/jaeger_screenshot.png
tag:
  - opentelemetry
  - Jaeger
---

![Jaeger](/graphic/jaeger_screenshot.png)

__Official website: [Jaeger](https://www.jaegertracing.io)__

See it in action and try out!  
You will need docker and docker-compose installed at your machine.  
At the [PURISTA repository](https://github.com/sebastianwessel/purista) in `examples/fullexample` you will find a running example:

Start the required docker containers:

```bash
npm run jaeger:up
```

Open the Jaeger in your browser: [http://localhost:16686](http://localhost:16686).

Start the example:

```bash
npm run jaeger:start
```

To generate some traces, go to the OpenAPI UI at [http://localhost:8080/](http://localhost:8080/) and call some commands.  
To stop and cleanup and stop all docker containers:

```bash
npm run jaeger:down
```
