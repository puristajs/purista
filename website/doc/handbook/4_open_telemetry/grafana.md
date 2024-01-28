---
title: Grafana
description: Use Opentelemetry with Grafana to trace PURISTA based typescript applications
order: 404000
---

# Grafana

![Grafana](/graphic/grafana_screenshot.png)
__Official website: [Grafana Labs](https://grafana.com)__

See it in action and try out!
You will need docker and docker-compose installed at your machine.
At the [PURISTA repository](https://github.com/sebastianwessel/purista) in `examples/fullexample` you will find a running example:

```bash
npm run grafana:up
```

Open the Grafana UI in your browser: <ExternalLink href="http://localhost:3000" /> and go to page _Explore_ and select _Tempo_.

Start the example:

```bash
npm run grafana:start
```

To generate some traces, go to the OpenAPI UI at <ExternalLink href="http://localhost:8080" /> and call some commands.
In the example, the log output is also sent to Grafana Loki and certain JSON fields are pre-configured.
If you switch to _Loki_ in the Grafana UI, you can see, that if you expand a log entry, the trace id is a link, which opens _Tempo_ with the selected trace and span for the log entry.

To stop and cleanup and stop all docker containers:

```bash
npm run grafana:down
```
