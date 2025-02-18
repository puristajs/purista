---
title: SignNoz
description: Use Opentelemetry with SignNoz to trace PURISTA based typescript applications
order: 406000
---

# SignNoz

![SigNoz](/graphic/signoz_screenshot.png)
__Official website: [SignNoz](https://signoz.io)__

See it in action and try out!
You will need docker and docker-compose installed at your machine.
At the [PURISTA repository](https://github.com/puristajs/purista) in `examples/fullexample` you will find a running example:

Start the required docker containers:

```bash
npm run signoz:up
```

Open the SigNoz in your browser: <ExternalLink href="http://localhost:3301" />.
You should be able to login with the test user account: username: `admin@example.com` / password:`PURISTA4love`

Start the example:

```bash
npm run signoz:start
```

To generate some traces, go to the OpenAPI UI at <ExternalLink href="http://localhost:8080" /> and call some commands.
To stop and cleanup and stop all docker containers:

```bash
npm run signoz:down
```
