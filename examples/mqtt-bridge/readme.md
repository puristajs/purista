# Full example

This is an example of PURISTA using the MQTT event bridge.  

## Setup

## Start a MQTT broker

To start a local MQTT broker you can use the npm command.  
This will start the container in the background and download a mosquitto docker image if needed.

```bash
npm run mqtt:up

```

## Run the example

As soon as the MQTT broker is running, you can start the example.  
Navigate to [http://localhost:8080/api](http://localhost:8080/api) to open the OpenAPI UI

## Stop the MQTT broker

You can stop the container with:

```bash
npm run mqtt:down

```
