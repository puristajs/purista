---
order: 70
title: Uptrace
shortTitle: Uptrace
description: Uptrace
tag:
  - opentelemetry
  - Uptrace
---


![Uptrace](/graphic/uptrace_screenshot.png)

__Official website: [Uptrace](https://uptrace.io)__

See it in action and try out!  
You will need docker and docker-compose installed at your machine.  
At the [PURISTA repository](https://github.com/sebastianwessel/purista) in `examples/fullexample` you will find a running example:

Start the required docker containers:

```bash
npm run uptrace:up
```

Open the Uptrace in your browser: [http://localhost:14318](http://localhost:14318).  
In the top bar on, besides the Uptrace logo, select the _PURISTA_ project.

Start the example:

```bash
npm run uptrace:start
```

To generate some traces, go to the OpenAPI UI at [http://localhost:8080/](http://localhost:8080/) and call some commands.  
To stop and cleanup and stop all docker containers:

```bash
npm run uptrace:down
```
