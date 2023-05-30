# Full example

This is an example of PURISTA using the NATS event bridge & NATS state store.  

## Setup

## Start a NATS broker

To start a local NATS broker you can use the npm command.  
This will start the container in the background and download a NATS docker image if needed.

```bash
npm run nats:up

```

## Run the example

As soon as the NATS broker is running, you can start the example.  
Navigate to [http://localhost:8080/api](http://localhost:8080/api) to open the OpenAPI UI

## Stop the NATS broker

You can stop the container with:

```bash
npm run nats:down

```
