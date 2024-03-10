---
title: Teletrace
description: Use Opentelemetry with Teletrace to trace PURISTA based typescript applications
order: 407000
---

# Teletrace

![Teletrace](/graphic/teletrace_screenshot.png)
__GitHub Repo: [Teletrace](https://github.com/teletrace/teletrace)__

See it in action and try out!
You will need docker and docker-compose installed at your machine.
At the [PURISTA repository](https://github.com/puristajs/purista) in `examples/fullexample` you will find a running example:

Start the required docker containers:

```bash
npm run teletrace:up
```

Open the Teletrace UI in your browser:
<ExternalLink href="http://localhost:8081" />.

Start the example:

```bash
npm run teletrace:start
```

To generate some traces, go to the OpenAPI UI at <ExternalLink href="http://localhost:8080" /> and call some commands.
To stop and cleanup and stop all docker containers:

```bash
npm run teletrace:down
```
