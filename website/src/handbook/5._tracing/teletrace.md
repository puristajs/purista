---
order: 65
title: Teletrace
shortTitle: Teletrace
description: Teletrace
image: https://purista.dev/graphic/teletrace_screenshot.png
tag:
  - opentelemetry
  - Teletrace
---

![SigNoz](/graphic/teletrace_screenshot.png)

__GitHub Repo: [Teletrace](https://github.com/teletrace/teletrace)__

See it in action and try out!  
You will need docker and docker-compose installed at your machine.  
At the [PURISTA repository](https://github.com/sebastianwessel/purista) in `examples/fullexample` you will find a running example:

Start the required docker containers:

```bash
npm run teletrace:up
```

Open the Teletrace UI in your browser: [http://localhost:8081](http://localhost:8081).  

Start the example:

```bash
npm run teletrace:start
```

To generate some traces, go to the OpenAPI UI at [http://localhost:8080/](http://localhost:8080/) and call some commands.  
To stop and cleanup and stop all docker containers:

```bash
npm run teletrace:down
```

__You can follow updated on Twitter [@purista_js](https://twitter.com/purista_js) or join the [Discord server](https://discord.gg/9feaUm3H2v) to get in touch with PURISTA maintainers and other developers.__
