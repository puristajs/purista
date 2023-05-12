# Dapr example

The example is referenced in the handbook at [purista.dev](https://purista.dev).

The implementation of the service are stored in folder `src/service`, while the individual run implementation & configuration is stored in `deployment/[service-name]`.

## Install Dapr locally

The example expects to be executed on local Dapr development environment.

You can setup your local environment quickly by following the official Dapr documentation at [https://docs.dapr.io/getting-started/install-dapr-selfhost/](https://docs.dapr.io/getting-started/install-dapr-selfhost/).

## Start the example

You can simply run `npm start` which uses the Dapr "Multi-App Run" developing feature to start multiple services at once.  
This will also output logs in the subfolder `.dapr/logs` within each `deployment/[service-name]` directory.

As soon as you have started the services, you should be able to send a simple request:

```bash
curl http://localhost:6101/v1.0/invoke/user-v1/method/ping -X POST -H 'Content-Type: application/json' -d @./ping.json
```

You will find a [Postman](https://www.postman.com) collection & environment in folder [./postman/](./postman/) for simple usage.
