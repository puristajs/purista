---
order: 40
title: Grafana
shortTitle: Grafana
description: Integrate Grafana Tempo and Grafana Loki into a PURISTA project
image: https://purista.dev/graphic/grafana_screenshot.png
cover: https://purista.dev/graphic/grafana_screenshot.png
tag:
  - opentelemetry
  - grafana
  - tempo
  - loki
---

## Example

![Grafana](/graphic/grafana_screenshot.png)

__Official website: [Grafana Labs](https://grafana.com)__

See it in action and try out!  
You will need docker and docker-compose installed at your machine.  
At the [PURISTA repository](https://github.com/sebastianwessel/purista) in `examples/fullexample` you will find a running example:

```bash
npm run grafana:up
```

Open the Grafana UI in your browser: [http://localhost:3000](http://localhost:3000) and go to page _Explore_ and select _Tempo_.

Start the example:

```bash
npm run grafana:start
```

To generate some traces, go to the OpenAPI UI at [http://localhost:8080/](http://localhost:8080/) and call some commands.  
In the example, the log output is also sent to Grafana Loki and certain JSON fields are pre-configured.  
If you switch to _Loki_ in the Grafana UI, you can see, that if you expand a log entry, the trace id is a link, which opens _Tempo_ with the selected trace and span for the log entry.

To stop and cleanup and stop all docker containers:

```bash
npm run grafana:down
```

__You can follow updated on Twitter [@purista_js](https://twitter.com/purista_js) or join the [Discord server](https://discord.gg/9feaUm3H2v) to get in touch with PURISTA maintainers and other developers.__
