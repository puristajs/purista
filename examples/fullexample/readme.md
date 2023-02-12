# Full example

This is a full example of PURISTA.  

## Setup

## Grafana setup

As example, you will find in folder `grafana` a ready to go `docker-compose` for [grafana](https://grafana.com).  
This docker compose spins up [Grafana](https://grafana.com/grafana/) itself, [Tempo](https://grafana.com/traces/) for traces, [Loki](https://grafana.com/logs/) for logs and [Prometheus](https://grafana.com/metrics/) for metrics.

The docker compose file also includes a RabbitMQ broker.

```bash
npm run grafana:up

```

Visit Grafana ui in browser: [http://localhost:3000](http://localhost:3000)

Start the example project:

```bash
npm run start:grafana
````

Open in your browser [https://localhost:4443](https://localhost:4443).  
Your browser might complain about the invalid https certificate, because we are using some local generated ssl certificate here.  
Just ignore the warning, accept the certificate.  

**YOU need to use `localhost` instead of `127.0.0.1` because of CORS restrictions!**

To stop grafana you can use this command:

```bash
npm run grafana:down

```

## Uptrace setup

As example, you will find in folder `uptrace` a ready to go `docker-compose` for [Uptrace](https://uptrace.dev).  

The docker compose file also includes a RabbitMQ broker.

```bash
npm run uptrace:up

```

Visit Uptrace ui in browser: [http://localhost:14318](http://localhost:14318) and choose in upper left corner our example project `PURISTA`.

Start the example project:

```bash
npm run start:uptrace
````

Visit example swagger ui in browser: [https://localhost:4443/api](https://localhost:4443/api).  
Your browser might complain about the invalid https certificate, because we are using some local generated ssl certificate here.  
Just ignore the warning, accept the certificate.

To stop uptrace you can use this command:

```bash
npm run uptrace:down

```

## Manual setup

### RabbitMQ

This example is using `@purista/amqpbridge` as event bridge.  
This means you need to have a local running RabbitMQ broker.

```bash
docker run --rm -it -d --hostname my-rabbit -p 15672:15672 -p 5672:5672 rabbitmq:3-management
```

You can access the RabbitMQ ui via [http://localhost:15672](http://localhost:15672)
The default username is `guest` with password of `guest`.

### Jaeger

It is also recommended, to have a local jaeger instance running.

```bash
docker run -d --name jaeger \                    
  -e COLLECTOR_ZIPKIN_HTTP_PORT=9411 \
  -p 5775:5775/udp \
  -p 6831:6831/udp \
  -p 6832:6832/udp \
  -p 5778:5778 \
  -p 16686:16686 \
  -p 14268:14268 \
  -p 9411:9411 \
```

You can access the jaeger ui via [http://localhost:16686](http://localhost:16686)


### Zipkin

If you like to use Zipkin:

```bash
docker run -d -p 9411:9411 openzipkin/zipkin-slim
```

You can access the jaeger ui via [http://localhost:9411](http://localhost:9411)
