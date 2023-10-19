import{_ as r}from"./plugin-vue_export-helper-c27b6911.js";import{r as p,o as d,c as k,b as n,d as s,e,w as t,a as o}from"./app-1068bce5.js";const m={},v=n("h2",{id:"prerequisites",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#prerequisites","aria-hidden":"true"},"#"),s(" Prerequisites")],-1),b={href:"https://kubernetes.io",target:"_blank",rel:"noopener noreferrer"},h={href:"https://learnk8s.io/deploying-nodejs-kubernetes",target:"_blank",rel:"noopener noreferrer"},g={href:"https://developer.ibm.com/articles/nodejs-kubernetes-basics/",target:"_blank",rel:"noopener noreferrer"},f=o("<p>In the flowing example, it is expected:</p><ul><li>you have a mono-repo with one service <strong>TheService</strong></li><li>typescript is listed <code>devDependencies</code> in your package.json</li><li>you have in your tsconfig.json: in <code>compilerOptions</code> the <code>outDir</code> set to <code>build</code></li><li>you have in your tsconfig.json: <code>include</code> set to <code>[&quot;./src/index.ts&quot;]</code></li></ul>",2),y={class:"hint-container info"},w=n("p",{class:"hint-container-title"},"Info",-1),_={href:"https://github.com/sebastianwessel/purista/tree/master/examples/kubernetes",target:"_blank",rel:"noopener noreferrer"},S=n("h2",{id:"prepare-your-code",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#prepare-your-code","aria-hidden":"true"},"#"),s(" Prepare your code")],-1),x=n("p",null,[s("Kubernetes is normally used by microservices, which are providing HTTP endpoints. Also, it is expected, that the service provides "),n("em",null,"liveness"),s(" and "),n("em",null,"readiness"),s(" probes over HTTP. Therefore, we use a small HTTP server here.")],-1),P=n("p",null,"We also want to handle shutdown signals properly.",-1),T={class:"hint-container info"},N=n("p",{class:"hint-container-title"},"Info",-1),I={href:"https://hono.dev",target:"_blank",rel:"noopener noreferrer"},E=n("br",null,null,-1),j={href:"https://bun.sh",target:"_blank",rel:"noopener noreferrer"},B=n("br",null,null,-1),D={href:"https://hono.dev",target:"_blank",rel:"noopener noreferrer"},R=o('<p>As you will see, you can optional expose commands as HTTP endpoints. This will allow <strong>integration into existing or other microservices environments</strong> or <strong>exposing commands as HTTP endpoints for clients</strong>.</p><p>Here is a full example, of how the index file might look like, if you want to deploy a service to Kubernetes. You can adjust this example for your actual requirements.</p><div class="hint-container warning"><p class="hint-container-title">Node.js package required</p><p>If you use Node.js as runtime, you need to install the additional package <code>@hono/node-server</code> with version <code>1.0.0</code> or higher!</p></div>',3),H=n("div",{class:"language-typescript line-numbers-mode","data-ext":"ts"},[n("pre",{class:"language-typescript"},[n("code",null,[n("span",{class:"token comment"},"// src/index.ts"),s(`
`),n("span",{class:"token comment"},"// For running on Node.js a small additional package is needed:"),s(`
`),n("span",{class:"token keyword"},"import"),s(),n("span",{class:"token punctuation"},"{"),s(" serve "),n("span",{class:"token punctuation"},"}"),s(),n("span",{class:"token keyword"},"from"),s(),n("span",{class:"token string"},"'@purista/hono-node-server'"),s(`

`),n("span",{class:"token keyword"},"import"),s(),n("span",{class:"token punctuation"},"{"),s(" OTLPTraceExporter "),n("span",{class:"token punctuation"},"}"),s(),n("span",{class:"token keyword"},"from"),s(),n("span",{class:"token string"},"'@opentelemetry/exporter-trace-otlp-http'"),s(`
`),n("span",{class:"token keyword"},"import"),s(),n("span",{class:"token punctuation"},"{"),s(" SimpleSpanProcessor "),n("span",{class:"token punctuation"},"}"),s(),n("span",{class:"token keyword"},"from"),s(),n("span",{class:"token string"},"'@opentelemetry/sdk-trace-base'"),s(`
`),n("span",{class:"token keyword"},"import"),s(),n("span",{class:"token punctuation"},"{"),s(" AmqpBridge "),n("span",{class:"token punctuation"},"}"),s(),n("span",{class:"token keyword"},"from"),s(),n("span",{class:"token string"},"'@purista/amqpbridge'"),s(`
`),n("span",{class:"token keyword"},"import"),s(),n("span",{class:"token punctuation"},"{"),s(`
  DefaultConfigStore`),n("span",{class:"token punctuation"},","),s(`
  DefaultSecretStore`),n("span",{class:"token punctuation"},","),s(`
  DefaultStateStore`),n("span",{class:"token punctuation"},","),s(`
  getNewInstanceId`),n("span",{class:"token punctuation"},","),s(`
  gracefulShutdown`),n("span",{class:"token punctuation"},","),s(`
  initLogger`),n("span",{class:"token punctuation"},","),s(`
  UnhandledError`),n("span",{class:"token punctuation"},","),s(`
`),n("span",{class:"token punctuation"},"}"),s(),n("span",{class:"token keyword"},"from"),s(),n("span",{class:"token string"},"'@purista/core'"),s(`
`),n("span",{class:"token keyword"},"import"),s(),n("span",{class:"token punctuation"},"{"),s(" getHttpServer "),n("span",{class:"token punctuation"},"}"),s(),n("span",{class:"token keyword"},"from"),s(),n("span",{class:"token string"},"'@purista/k8s-sdk'"),s(`

`),n("span",{class:"token keyword"},"import"),s(),n("span",{class:"token punctuation"},"{"),s(" theServiceV1Service "),n("span",{class:"token punctuation"},"}"),s(),n("span",{class:"token keyword"},"from"),s(),n("span",{class:"token string"},"'./service/theService/v1/'"),s(`

`),n("span",{class:"token keyword"},"const"),s(),n("span",{class:"token function-variable function"},"main"),s(),n("span",{class:"token operator"},"="),s(),n("span",{class:"token keyword"},"async"),s(),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},")"),s(),n("span",{class:"token operator"},"=>"),s(),n("span",{class:"token punctuation"},"{"),s(`
  `),n("span",{class:"token comment"},"// create a logger"),s(`
  `),n("span",{class:"token keyword"},"const"),s(" logger "),n("span",{class:"token operator"},"="),s(),n("span",{class:"token function"},"initLogger"),n("span",{class:"token punctuation"},"("),n("span",{class:"token string"},"'debug'"),n("span",{class:"token punctuation"},")"),s(`

  `),n("span",{class:"token comment"},"// add listeners to log really unexpected errors"),s(`
  process`),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"on"),n("span",{class:"token punctuation"},"("),n("span",{class:"token string"},"'uncaughtException'"),n("span",{class:"token punctuation"},","),s(),n("span",{class:"token punctuation"},"("),s("error"),n("span",{class:"token punctuation"},","),s(" origin"),n("span",{class:"token punctuation"},")"),s(),n("span",{class:"token operator"},"=>"),s(),n("span",{class:"token punctuation"},"{"),s(`
    `),n("span",{class:"token keyword"},"const"),s(" err "),n("span",{class:"token operator"},"="),s(" UnhandledError"),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"fromError"),n("span",{class:"token punctuation"},"("),s("error"),n("span",{class:"token punctuation"},")"),s(`
    logger`),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"error"),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},"{"),s(" err"),n("span",{class:"token punctuation"},","),s(" origin "),n("span",{class:"token punctuation"},"}"),n("span",{class:"token punctuation"},","),s(),n("span",{class:"token template-string"},[n("span",{class:"token template-punctuation string"},"`"),n("span",{class:"token string"},"unhandled error: "),n("span",{class:"token interpolation"},[n("span",{class:"token interpolation-punctuation punctuation"},"${"),s("err"),n("span",{class:"token punctuation"},"."),s("message"),n("span",{class:"token interpolation-punctuation punctuation"},"}")]),n("span",{class:"token template-punctuation string"},"`")]),n("span",{class:"token punctuation"},")"),s(`
  `),n("span",{class:"token punctuation"},"}"),n("span",{class:"token punctuation"},")"),s(`

  process`),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"on"),n("span",{class:"token punctuation"},"("),n("span",{class:"token string"},"'unhandledRejection'"),n("span",{class:"token punctuation"},","),s(),n("span",{class:"token punctuation"},"("),s("error"),n("span",{class:"token punctuation"},","),s(" origin"),n("span",{class:"token punctuation"},")"),s(),n("span",{class:"token operator"},"=>"),s(),n("span",{class:"token punctuation"},"{"),s(`
    `),n("span",{class:"token keyword"},"const"),s(" err "),n("span",{class:"token operator"},"="),s(" UnhandledError"),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"fromError"),n("span",{class:"token punctuation"},"("),s("error"),n("span",{class:"token punctuation"},")"),s(`
    logger`),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"error"),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},"{"),s(" err"),n("span",{class:"token punctuation"},","),s(" origin "),n("span",{class:"token punctuation"},"}"),n("span",{class:"token punctuation"},","),s(),n("span",{class:"token template-string"},[n("span",{class:"token template-punctuation string"},"`"),n("span",{class:"token string"},"unhandled rejection: "),n("span",{class:"token interpolation"},[n("span",{class:"token interpolation-punctuation punctuation"},"${"),s("err"),n("span",{class:"token punctuation"},"."),s("message"),n("span",{class:"token interpolation-punctuation punctuation"},"}")]),n("span",{class:"token template-punctuation string"},"`")]),n("span",{class:"token punctuation"},")"),s(`
  `),n("span",{class:"token punctuation"},"}"),n("span",{class:"token punctuation"},")"),s(`

  `),n("span",{class:"token comment"},"// optional: set up opentelemetry if you like to use it"),s(`
  `),n("span",{class:"token keyword"},"const"),s(" exporter "),n("span",{class:"token operator"},"="),s(),n("span",{class:"token keyword"},"new"),s(),n("span",{class:"token class-name"},"OTLPTraceExporter"),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},"{"),s(`
    url`),n("span",{class:"token operator"},":"),s(),n("span",{class:"token template-string"},[n("span",{class:"token template-punctuation string"},"`"),n("span",{class:"token string"},"http://localhost:14268/api/traces"),n("span",{class:"token template-punctuation string"},"`")]),n("span",{class:"token punctuation"},","),s(`
  `),n("span",{class:"token punctuation"},"}"),n("span",{class:"token punctuation"},")"),s(`
  `),n("span",{class:"token keyword"},"const"),s(" spanProcessor "),n("span",{class:"token operator"},"="),s(),n("span",{class:"token keyword"},"new"),s(),n("span",{class:"token class-name"},"SimpleSpanProcessor"),n("span",{class:"token punctuation"},"("),s("exporter"),n("span",{class:"token punctuation"},")"),s(`

  `),n("span",{class:"token comment"},"// optional: set up stores if they are needed for your service"),s(`
  `),n("span",{class:"token keyword"},"const"),s(" secretStore "),n("span",{class:"token operator"},"="),s(),n("span",{class:"token keyword"},"new"),s(),n("span",{class:"token class-name"},"DefaultSecretStore"),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},"{"),s(" logger "),n("span",{class:"token punctuation"},"}"),n("span",{class:"token punctuation"},")"),s(`
  `),n("span",{class:"token keyword"},"const"),s(" configStore "),n("span",{class:"token operator"},"="),s(),n("span",{class:"token keyword"},"new"),s(),n("span",{class:"token class-name"},"DefaultConfigStore"),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},"{"),s(" logger "),n("span",{class:"token punctuation"},"}"),n("span",{class:"token punctuation"},")"),s(`
  `),n("span",{class:"token keyword"},"const"),s(" stateStore "),n("span",{class:"token operator"},"="),s(),n("span",{class:"token keyword"},"new"),s(),n("span",{class:"token class-name"},"DefaultStateStore"),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},"{"),s(" logger "),n("span",{class:"token punctuation"},"}"),n("span",{class:"token punctuation"},")"),s(`

  `),n("span",{class:"token comment"},"// set up the eventbridge and start the event bridge"),s(`
  `),n("span",{class:"token keyword"},"const"),s(" eventBridge "),n("span",{class:"token operator"},"="),s(),n("span",{class:"token keyword"},"new"),s(),n("span",{class:"token class-name"},"AmqpBridge"),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},"{"),s(`
    spanProcessor`),n("span",{class:"token punctuation"},","),s(`
    instanceId`),n("span",{class:"token operator"},":"),s(" process"),n("span",{class:"token punctuation"},"."),s("env"),n("span",{class:"token punctuation"},"."),n("span",{class:"token constant"},"HOSTNAME"),s(),n("span",{class:"token operator"},"||"),s(),n("span",{class:"token function"},"getNewInstanceId"),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},")"),n("span",{class:"token punctuation"},","),s(`
    config`),n("span",{class:"token operator"},":"),s(),n("span",{class:"token punctuation"},"{"),s(`
      url`),n("span",{class:"token operator"},":"),s(" process"),n("span",{class:"token punctuation"},"."),s("env"),n("span",{class:"token punctuation"},"."),n("span",{class:"token constant"},"AMQP_URL"),n("span",{class:"token punctuation"},","),s(`
    `),n("span",{class:"token punctuation"},"}"),n("span",{class:"token punctuation"},","),s(`
  `),n("span",{class:"token punctuation"},"}"),n("span",{class:"token punctuation"},")"),s(`
  `),n("span",{class:"token keyword"},"await"),s(" eventBridge"),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"start"),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},")"),s(`

  `),n("span",{class:"token comment"},"// set up the service"),s(`
  `),n("span",{class:"token keyword"},"const"),s(" theService "),n("span",{class:"token operator"},"="),s(" theServiceV1Service"),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"getInstance"),n("span",{class:"token punctuation"},"("),s("eventBridge"),n("span",{class:"token punctuation"},","),s(),n("span",{class:"token punctuation"},"{"),s(`
    spanProcessor`),n("span",{class:"token punctuation"},","),s(`
    configStore`),n("span",{class:"token punctuation"},","),s(`
    secretStore`),n("span",{class:"token punctuation"},","),s(`
    stateStore`),n("span",{class:"token punctuation"},","),s(`
  `),n("span",{class:"token punctuation"},"}"),n("span",{class:"token punctuation"},")"),s(`
  `),n("span",{class:"token keyword"},"await"),s(" theService"),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"start"),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},")"),s(`

  `),n("span",{class:"token comment"},"// create http server"),s(`
  `),n("span",{class:"token keyword"},"const"),s(" app "),n("span",{class:"token operator"},"="),s(),n("span",{class:"token function"},"getHttpServer"),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},"{"),s(`
    logger`),n("span",{class:"token punctuation"},","),s(`
    `),n("span",{class:"token comment"},"// check event bridge health if /healthz endpoint is called"),s(`
    `),n("span",{class:"token function-variable function"},"healthFn"),n("span",{class:"token operator"},":"),s(),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},")"),s(),n("span",{class:"token operator"},"=>"),s(" eventBridge"),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"isHealthy"),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},")"),n("span",{class:"token punctuation"},","),s(`
    `),n("span",{class:"token comment"},"// optional: expose the commands if they are defined to have url endpoint"),s(`
    services`),n("span",{class:"token operator"},":"),s(" theService"),n("span",{class:"token punctuation"},","),s(`
    `),n("span",{class:"token comment"},"// optional: expose service endpoints at [apiMountPath]/v[serviceVersion]/[path defined for command]"),s(`
    `),n("span",{class:"token comment"},"// defaults to /api"),s(`
    apiMountPath`),n("span",{class:"token operator"},":"),s(),n("span",{class:"token string"},"'/api'"),n("span",{class:"token punctuation"},","),s(`
  `),n("span",{class:"token punctuation"},"}"),n("span",{class:"token punctuation"},")"),s(`

  `),n("span",{class:"token comment"},"// start the http server"),s(`
  `),n("span",{class:"token comment"},"// defaults to port 3000"),s(`
  `),n("span",{class:"token comment"},"// optional: you can set the `port` in the optional parameter of this method"),s(`
  `),n("span",{class:"token comment"},"// use the `serve` method form the `@purista/hono-node-server` package"),s(`
  `),n("span",{class:"token keyword"},"const"),s(" server "),n("span",{class:"token operator"},"="),s(),n("span",{class:"token function"},"serve"),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},"{"),s(`
    fetch`),n("span",{class:"token operator"},":"),s(" app"),n("span",{class:"token punctuation"},"."),s("fetch"),n("span",{class:"token punctuation"},","),s(`
  `),n("span",{class:"token punctuation"},"}"),n("span",{class:"token punctuation"},")"),s(`

  `),n("span",{class:"token comment"},"// register shut down methods"),s(`
  `),n("span",{class:"token function"},"gracefulShutdown"),n("span",{class:"token punctuation"},"("),s("logger"),n("span",{class:"token punctuation"},","),s(),n("span",{class:"token punctuation"},"["),s(`
    `),n("span",{class:"token comment"},"// start with the event bridge to no longer accept incoming messages"),s(`
    eventBridge`),n("span",{class:"token punctuation"},","),s(`
    `),n("span",{class:"token comment"},"// optional: shut down the service"),s(`
    theService`),n("span",{class:"token punctuation"},","),s(`
    `),n("span",{class:"token comment"},"// optional: shut down the secret store"),s(`
    secretStore`),n("span",{class:"token punctuation"},","),s(`
    `),n("span",{class:"token comment"},"// optional: shut down the config store"),s(`
    configStore`),n("span",{class:"token punctuation"},","),s(`
    `),n("span",{class:"token comment"},"// optional: shut down the state store"),s(`
    stateStore`),n("span",{class:"token punctuation"},","),s(`
    `),n("span",{class:"token punctuation"},"{"),s(`
      name`),n("span",{class:"token operator"},":"),s(),n("span",{class:"token string"},"'httpserver'"),n("span",{class:"token punctuation"},","),s(`
      `),n("span",{class:"token function-variable function"},"destroy"),n("span",{class:"token operator"},":"),s(),n("span",{class:"token keyword"},"async"),s(),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},")"),s(),n("span",{class:"token operator"},"=>"),s(),n("span",{class:"token punctuation"},"{"),s(`
        server`),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"closeIdleConnections"),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},")"),s(`
        server`),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"close"),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},")"),s(`
      `),n("span",{class:"token punctuation"},"}"),n("span",{class:"token punctuation"},","),s(`
    `),n("span",{class:"token punctuation"},"}"),n("span",{class:"token punctuation"},","),s(`
  `),n("span",{class:"token punctuation"},"]"),n("span",{class:"token punctuation"},")"),s(`
`),n("span",{class:"token punctuation"},"}"),s(`

`),n("span",{class:"token function"},"main"),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},")"),s(`
`)])]),n("div",{class:"line-numbers","aria-hidden":"true"},[n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"})])],-1),A=n("div",{class:"language-typescript line-numbers-mode","data-ext":"ts"},[n("pre",{class:"language-typescript"},[n("code",null,[n("span",{class:"token comment"},"// src/index.ts"),s(`
`),n("span",{class:"token keyword"},"import"),s(),n("span",{class:"token punctuation"},"{"),s(" OTLPTraceExporter "),n("span",{class:"token punctuation"},"}"),s(),n("span",{class:"token keyword"},"from"),s(),n("span",{class:"token string"},"'@opentelemetry/exporter-trace-otlp-http'"),s(`
`),n("span",{class:"token keyword"},"import"),s(),n("span",{class:"token punctuation"},"{"),s(" SimpleSpanProcessor "),n("span",{class:"token punctuation"},"}"),s(),n("span",{class:"token keyword"},"from"),s(),n("span",{class:"token string"},"'@opentelemetry/sdk-trace-base'"),s(`
`),n("span",{class:"token keyword"},"import"),s(),n("span",{class:"token punctuation"},"{"),s(" AmqpBridge "),n("span",{class:"token punctuation"},"}"),s(),n("span",{class:"token keyword"},"from"),s(),n("span",{class:"token string"},"'@purista/amqpbridge'"),s(`
`),n("span",{class:"token keyword"},"import"),s(),n("span",{class:"token punctuation"},"{"),s(`
  DefaultConfigStore`),n("span",{class:"token punctuation"},","),s(`
  DefaultSecretStore`),n("span",{class:"token punctuation"},","),s(`
  DefaultStateStore`),n("span",{class:"token punctuation"},","),s(`
  getNewInstanceId`),n("span",{class:"token punctuation"},","),s(`
  gracefulShutdown`),n("span",{class:"token punctuation"},","),s(`
  initLogger`),n("span",{class:"token punctuation"},","),s(`
  UnhandledError`),n("span",{class:"token punctuation"},","),s(`
`),n("span",{class:"token punctuation"},"}"),s(),n("span",{class:"token keyword"},"from"),s(),n("span",{class:"token string"},"'@purista/core'"),s(`
`),n("span",{class:"token keyword"},"import"),s(),n("span",{class:"token punctuation"},"{"),s(" getHttpServer "),n("span",{class:"token punctuation"},"}"),s(),n("span",{class:"token keyword"},"from"),s(),n("span",{class:"token string"},"'@purista/k8s-sdk'"),s(`

`),n("span",{class:"token keyword"},"import"),s(),n("span",{class:"token punctuation"},"{"),s(" theServiceV1Service "),n("span",{class:"token punctuation"},"}"),s(),n("span",{class:"token keyword"},"from"),s(),n("span",{class:"token string"},"'./service/theService/v1/'"),s(`

`),n("span",{class:"token keyword"},"const"),s(),n("span",{class:"token function-variable function"},"main"),s(),n("span",{class:"token operator"},"="),s(),n("span",{class:"token keyword"},"async"),s(),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},")"),s(),n("span",{class:"token operator"},"=>"),s(),n("span",{class:"token punctuation"},"{"),s(`
  `),n("span",{class:"token comment"},"// create a logger"),s(`
  `),n("span",{class:"token keyword"},"const"),s(" logger "),n("span",{class:"token operator"},"="),s(),n("span",{class:"token function"},"initLogger"),n("span",{class:"token punctuation"},"("),n("span",{class:"token string"},"'debug'"),n("span",{class:"token punctuation"},")"),s(`

  `),n("span",{class:"token comment"},"// add listeners to log really unexpected errors"),s(`
  process`),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"on"),n("span",{class:"token punctuation"},"("),n("span",{class:"token string"},"'uncaughtException'"),n("span",{class:"token punctuation"},","),s(),n("span",{class:"token punctuation"},"("),s("error"),n("span",{class:"token punctuation"},","),s(" origin"),n("span",{class:"token punctuation"},")"),s(),n("span",{class:"token operator"},"=>"),s(),n("span",{class:"token punctuation"},"{"),s(`
    `),n("span",{class:"token keyword"},"const"),s(" err "),n("span",{class:"token operator"},"="),s(" UnhandledError"),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"fromError"),n("span",{class:"token punctuation"},"("),s("error"),n("span",{class:"token punctuation"},")"),s(`
    logger`),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"error"),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},"{"),s(" err"),n("span",{class:"token punctuation"},","),s(" origin "),n("span",{class:"token punctuation"},"}"),n("span",{class:"token punctuation"},","),s(),n("span",{class:"token template-string"},[n("span",{class:"token template-punctuation string"},"`"),n("span",{class:"token string"},"unhandled error: "),n("span",{class:"token interpolation"},[n("span",{class:"token interpolation-punctuation punctuation"},"${"),s("err"),n("span",{class:"token punctuation"},"."),s("message"),n("span",{class:"token interpolation-punctuation punctuation"},"}")]),n("span",{class:"token template-punctuation string"},"`")]),n("span",{class:"token punctuation"},")"),s(`
  `),n("span",{class:"token punctuation"},"}"),n("span",{class:"token punctuation"},")"),s(`

  process`),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"on"),n("span",{class:"token punctuation"},"("),n("span",{class:"token string"},"'unhandledRejection'"),n("span",{class:"token punctuation"},","),s(),n("span",{class:"token punctuation"},"("),s("error"),n("span",{class:"token punctuation"},","),s(" origin"),n("span",{class:"token punctuation"},")"),s(),n("span",{class:"token operator"},"=>"),s(),n("span",{class:"token punctuation"},"{"),s(`
    `),n("span",{class:"token keyword"},"const"),s(" err "),n("span",{class:"token operator"},"="),s(" UnhandledError"),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"fromError"),n("span",{class:"token punctuation"},"("),s("error"),n("span",{class:"token punctuation"},")"),s(`
    logger`),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"error"),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},"{"),s(" err"),n("span",{class:"token punctuation"},","),s(" origin "),n("span",{class:"token punctuation"},"}"),n("span",{class:"token punctuation"},","),s(),n("span",{class:"token template-string"},[n("span",{class:"token template-punctuation string"},"`"),n("span",{class:"token string"},"unhandled rejection: "),n("span",{class:"token interpolation"},[n("span",{class:"token interpolation-punctuation punctuation"},"${"),s("err"),n("span",{class:"token punctuation"},"."),s("message"),n("span",{class:"token interpolation-punctuation punctuation"},"}")]),n("span",{class:"token template-punctuation string"},"`")]),n("span",{class:"token punctuation"},")"),s(`
  `),n("span",{class:"token punctuation"},"}"),n("span",{class:"token punctuation"},")"),s(`

  `),n("span",{class:"token comment"},"// optional: set up opentelemetry if you like to use it"),s(`
  `),n("span",{class:"token keyword"},"const"),s(" exporter "),n("span",{class:"token operator"},"="),s(),n("span",{class:"token keyword"},"new"),s(),n("span",{class:"token class-name"},"OTLPTraceExporter"),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},"{"),s(`
    url`),n("span",{class:"token operator"},":"),s(),n("span",{class:"token template-string"},[n("span",{class:"token template-punctuation string"},"`"),n("span",{class:"token string"},"http://localhost:14268/api/traces"),n("span",{class:"token template-punctuation string"},"`")]),n("span",{class:"token punctuation"},","),s(`
  `),n("span",{class:"token punctuation"},"}"),n("span",{class:"token punctuation"},")"),s(`
  `),n("span",{class:"token keyword"},"const"),s(" spanProcessor "),n("span",{class:"token operator"},"="),s(),n("span",{class:"token keyword"},"new"),s(),n("span",{class:"token class-name"},"SimpleSpanProcessor"),n("span",{class:"token punctuation"},"("),s("exporter"),n("span",{class:"token punctuation"},")"),s(`

  `),n("span",{class:"token comment"},"// optional: set up stores if they are needed for your service"),s(`
  `),n("span",{class:"token keyword"},"const"),s(" secretStore "),n("span",{class:"token operator"},"="),s(),n("span",{class:"token keyword"},"new"),s(),n("span",{class:"token class-name"},"DefaultSecretStore"),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},"{"),s(" logger "),n("span",{class:"token punctuation"},"}"),n("span",{class:"token punctuation"},")"),s(`
  `),n("span",{class:"token keyword"},"const"),s(" configStore "),n("span",{class:"token operator"},"="),s(),n("span",{class:"token keyword"},"new"),s(),n("span",{class:"token class-name"},"DefaultConfigStore"),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},"{"),s(" logger "),n("span",{class:"token punctuation"},"}"),n("span",{class:"token punctuation"},")"),s(`
  `),n("span",{class:"token keyword"},"const"),s(" stateStore "),n("span",{class:"token operator"},"="),s(),n("span",{class:"token keyword"},"new"),s(),n("span",{class:"token class-name"},"DefaultStateStore"),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},"{"),s(" logger "),n("span",{class:"token punctuation"},"}"),n("span",{class:"token punctuation"},")"),s(`

  `),n("span",{class:"token comment"},"// set up the eventbridge and start the event bridge"),s(`
  `),n("span",{class:"token keyword"},"const"),s(" eventBridge "),n("span",{class:"token operator"},"="),s(),n("span",{class:"token keyword"},"new"),s(),n("span",{class:"token class-name"},"AmqpBridge"),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},"{"),s(`
    spanProcessor`),n("span",{class:"token punctuation"},","),s(`
    instanceId`),n("span",{class:"token operator"},":"),s(" process"),n("span",{class:"token punctuation"},"."),s("env"),n("span",{class:"token punctuation"},"."),n("span",{class:"token constant"},"HOSTNAME"),s(),n("span",{class:"token operator"},"||"),s(),n("span",{class:"token function"},"getNewInstanceId"),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},")"),n("span",{class:"token punctuation"},","),s(`
    config`),n("span",{class:"token operator"},":"),s(),n("span",{class:"token punctuation"},"{"),s(`
      url`),n("span",{class:"token operator"},":"),s(" process"),n("span",{class:"token punctuation"},"."),s("env"),n("span",{class:"token punctuation"},"."),n("span",{class:"token constant"},"AMQP_URL"),n("span",{class:"token punctuation"},","),s(`
    `),n("span",{class:"token punctuation"},"}"),n("span",{class:"token punctuation"},","),s(`
  `),n("span",{class:"token punctuation"},"}"),n("span",{class:"token punctuation"},")"),s(`
  `),n("span",{class:"token keyword"},"await"),s(" eventBridge"),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"start"),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},")"),s(`

  `),n("span",{class:"token comment"},"// set up the service"),s(`
  `),n("span",{class:"token keyword"},"const"),s(" theService "),n("span",{class:"token operator"},"="),s(" theServiceV1Service"),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"getInstance"),n("span",{class:"token punctuation"},"("),s("eventBridge"),n("span",{class:"token punctuation"},","),s(),n("span",{class:"token punctuation"},"{"),s(`
    spanProcessor`),n("span",{class:"token punctuation"},","),s(`
    configStore`),n("span",{class:"token punctuation"},","),s(`
    secretStore`),n("span",{class:"token punctuation"},","),s(`
    stateStore`),n("span",{class:"token punctuation"},","),s(`
  `),n("span",{class:"token punctuation"},"}"),n("span",{class:"token punctuation"},")"),s(`
  `),n("span",{class:"token keyword"},"await"),s(" theService"),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"start"),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},")"),s(`

  `),n("span",{class:"token comment"},"// create http server"),s(`
  `),n("span",{class:"token keyword"},"const"),s(" app "),n("span",{class:"token operator"},"="),s(),n("span",{class:"token function"},"getHttpServer"),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},"{"),s(`
    logger`),n("span",{class:"token punctuation"},","),s(`
    `),n("span",{class:"token comment"},"// check event bridge health if /healthz endpoint is called"),s(`
    `),n("span",{class:"token function-variable function"},"healthFn"),n("span",{class:"token operator"},":"),s(),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},")"),s(),n("span",{class:"token operator"},"=>"),s(" eventBridge"),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"isHealthy"),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},")"),n("span",{class:"token punctuation"},","),s(`
    `),n("span",{class:"token comment"},"// optional: expose the commands if they are defined to have url endpoint"),s(`
    services`),n("span",{class:"token operator"},":"),s(" theService"),n("span",{class:"token punctuation"},","),s(`
    `),n("span",{class:"token comment"},"// optional: expose service endpoints at [apiMountPath]/v[serviceVersion]/[path defined for command]"),s(`
    `),n("span",{class:"token comment"},"// defaults to /api"),s(`
    apiMountPath`),n("span",{class:"token operator"},":"),s(),n("span",{class:"token string"},"'/api'"),n("span",{class:"token punctuation"},","),s(`
  `),n("span",{class:"token punctuation"},"}"),n("span",{class:"token punctuation"},")"),s(`

  `),n("span",{class:"token comment"},"// start the http server"),s(`
  `),n("span",{class:"token comment"},"// defaults to port 3000"),s(`
  `),n("span",{class:"token comment"},"// optional: you can set the `port` in the optional parameter of this method"),s(`
  `),n("span",{class:"token comment"},"// Use Bun native `serve` method"),s(`
  `),n("span",{class:"token keyword"},"const"),s(" server "),n("span",{class:"token operator"},"="),s(" Bun"),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"serve"),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},"{"),s(`
    fetch`),n("span",{class:"token operator"},":"),s(" app"),n("span",{class:"token punctuation"},"."),s("fetch"),n("span",{class:"token punctuation"},","),s(`
  `),n("span",{class:"token punctuation"},"}"),n("span",{class:"token punctuation"},")"),s(`

  `),n("span",{class:"token comment"},"// register shut down methods"),s(`
  `),n("span",{class:"token function"},"gracefulShutdown"),n("span",{class:"token punctuation"},"("),s("logger"),n("span",{class:"token punctuation"},","),s(),n("span",{class:"token punctuation"},"["),s(`
    `),n("span",{class:"token comment"},"// start with the event bridge to no longer accept incoming messages"),s(`
    eventBridge`),n("span",{class:"token punctuation"},","),s(`
    `),n("span",{class:"token comment"},"// optional: shut down the service"),s(`
    theService`),n("span",{class:"token punctuation"},","),s(`
    `),n("span",{class:"token comment"},"// optional: shut down the secret store"),s(`
    secretStore`),n("span",{class:"token punctuation"},","),s(`
    `),n("span",{class:"token comment"},"// optional: shut down the config store"),s(`
    configStore`),n("span",{class:"token punctuation"},","),s(`
    `),n("span",{class:"token comment"},"// optional: shut down the state store"),s(`
    stateStore`),n("span",{class:"token punctuation"},","),s(`
    `),n("span",{class:"token punctuation"},"{"),s(`
      name`),n("span",{class:"token operator"},":"),s(),n("span",{class:"token string"},"'httpserver'"),n("span",{class:"token punctuation"},","),s(`
      `),n("span",{class:"token function-variable function"},"destroy"),n("span",{class:"token operator"},":"),s(),n("span",{class:"token keyword"},"async"),s(),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},")"),s(),n("span",{class:"token operator"},"=>"),s(),n("span",{class:"token punctuation"},"{"),s(`
        server`),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"closeIdleConnections"),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},")"),s(`
        server`),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"close"),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},")"),s(`
      `),n("span",{class:"token punctuation"},"}"),n("span",{class:"token punctuation"},","),s(`
    `),n("span",{class:"token punctuation"},"}"),n("span",{class:"token punctuation"},","),s(`
  `),n("span",{class:"token punctuation"},"]"),n("span",{class:"token punctuation"},")"),s(`
`),n("span",{class:"token punctuation"},"}"),s(`

`),n("span",{class:"token function"},"main"),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},")"),s(`
`)])]),n("div",{class:"line-numbers","aria-hidden":"true"},[n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"})])],-1),O=n("p",null,"With this setup, you should be able to build and deploy your app as a container in Kubernetes like any other node-based service.",-1),V=n("h2",{id:"build-a-docker-image",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#build-a-docker-image","aria-hidden":"true"},"#"),s(" Build a docker image")],-1),U=n("p",null,"To get a docker image, which then can be deployed, you will need to have done two things:",-1),q=n("ul",null,[n("li",null,"compile the typescript code base to plain JavaScript"),n("li",null,"create a docker file with minimum resources (no dev dependencies) and compiled JavaScript")],-1),L={href:"https://docs.docker.com/build/building/multi-stage/",target:"_blank",rel:"noopener noreferrer"},C=o(`<p>Place a <code>Dockerfile</code> into the root of your repository. The file looks something like this.</p><div class="language-Dockerfile line-numbers-mode" data-ext="Dockerfile"><pre class="language-Dockerfile"><code>FROM node:18-alpine as builder

RUN mkdir -p /app
WORKDIR /app

# should be improved by you depending on your needs
# AVOID TO COPY EVERYTHING FOR REAL PRODUCTION!
# use a .dockerignore file
COPY . .

RUN npm ci

RUN npx tsc
# or you can use esbuild
# RUN npx esbuild ./src/index.ts --bundle --platform=node --outfile=build/src/index.js

FROM node:18-alpine as app

ENV NODE_ENV=production

RUN mkdir -p /app
WORKDIR /app
COPY --chown=node:node --from=builder /app/package.json /app
COPY --chown=node:node --from=builder /app/build /app

RUN npm install --omit=dev

# exposed port must match the one used to start the http server in src/index.ts
EXPOSE 8080
ENTRYPOINT [&quot;node&quot;, &quot;index.js&quot;]
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container warning"><p class="hint-container-title">Note</p><p>Please adjust this example to your needs.<br> You should improve it, by only copying needed things.</p></div><p>Now, it&#39;s time to build the image.<br> To do so, run <code>docker build . -t the-service:v1</code>, which will create a docker imaged named <code>TheService</code> with the tag <code>v1</code>.<br> You can adjust the naming and tagging to your preferred way.</p><p>Because the image is currently only available on your local machine, you need to push it to a registry.<br> Kubernetes will then be able, to pull the image from the registry.<br> Which registry is used, depends on your project and environment.</p><p>Here is a basic <strong>deployment.yaml</strong> file for Kubernetes.</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> apps/v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Deployment
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
    <span class="token key atrule">name</span><span class="token punctuation">:</span> theServiceV1
    <span class="token key atrule">labels</span><span class="token punctuation">:</span>
        <span class="token key atrule">app</span><span class="token punctuation">:</span> theServiceV1
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
    <span class="token key atrule">replicas</span><span class="token punctuation">:</span> <span class="token number">2</span>
    <span class="token key atrule">selector</span><span class="token punctuation">:</span>
        <span class="token key atrule">matchLabels</span><span class="token punctuation">:</span>
            <span class="token key atrule">app</span><span class="token punctuation">:</span> theServiceV1
    <span class="token key atrule">template</span><span class="token punctuation">:</span>
        <span class="token key atrule">metadata</span><span class="token punctuation">:</span>
            <span class="token key atrule">labels</span><span class="token punctuation">:</span>
                <span class="token key atrule">app</span><span class="token punctuation">:</span> theServiceV1
        <span class="token key atrule">spec</span><span class="token punctuation">:</span>
            <span class="token key atrule">containers</span><span class="token punctuation">:</span>
              <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> theServiceV1
                <span class="token key atrule">image</span><span class="token punctuation">:</span> the<span class="token punctuation">-</span>service<span class="token punctuation">:</span>v1
                <span class="token key atrule">imagePullPolicy</span><span class="token punctuation">:</span> IfNotPresent
                <span class="token key atrule">args</span><span class="token punctuation">:</span>
                <span class="token key atrule">livenessProbe</span><span class="token punctuation">:</span>
                  <span class="token key atrule">httpGet</span><span class="token punctuation">:</span>
                    <span class="token key atrule">path</span><span class="token punctuation">:</span> /healthz
                    <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">8080</span>
                  <span class="token key atrule">initialDelaySeconds</span><span class="token punctuation">:</span> <span class="token number">10</span>
                  <span class="token key atrule">periodSeconds</span><span class="token punctuation">:</span> <span class="token number">10</span>

                <span class="token key atrule">readinessProbe</span><span class="token punctuation">:</span>
                  <span class="token key atrule">httpGet</span><span class="token punctuation">:</span>
                    <span class="token key atrule">path</span><span class="token punctuation">:</span> /healthz
                    <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">8080</span>
                  <span class="token key atrule">initialDelaySeconds</span><span class="token punctuation">:</span> <span class="token number">5</span>
                  <span class="token key atrule">periodSeconds</span><span class="token punctuation">:</span> <span class="token number">10</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container warning"><p class="hint-container-title">Note</p><p>Please be aware, that this is just an example for demonstration and local development purpose.<br> You should adjust it for production, depending on your actual environment.</p></div><h2 id="that-s-it" tabindex="-1"><a class="header-anchor" href="#that-s-it" aria-hidden="true">#</a> That&#39;s it?</h2><p>Well, you might want to define a (Kubernetes) service, which makes Pods accessible to other Pods or users outside the cluster.</p><p>But, here we only focus on the PURISTA related stuff, and not go into details of Kubernetes. There are a bunch of good articles, documentations, how-to&#39;s, which cover the Kubernetes and infrastructure stuff a way better.</p><h2 id="add-custom-endpoints" tabindex="-1"><a class="header-anchor" href="#add-custom-endpoints" aria-hidden="true">#</a> Add custom endpoints</h2>`,12),K=n("br",null,null,-1),M={href:"https://prometheus.io",target:"_blank",rel:"noopener noreferrer"},Y=n("code",null,"/metrics",-1),F=o(`<p>We can simply extend our file <code>/src/index.ts</code>, to provide the endpoint <code>/metrics</code></p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code>
<span class="token comment">// create http server</span>
<span class="token keyword">const</span> server <span class="token operator">=</span> <span class="token function">getHttpServer</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  logger<span class="token punctuation">,</span>
  <span class="token comment">// check event bridge health if /healthz endpoint is called</span>
  <span class="token function-variable function">healthFn</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> eventBridge<span class="token punctuation">.</span><span class="token function">isHealthy</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
  <span class="token comment">// optional: expose the commands if they are defined to have url endpoint</span>
  services<span class="token operator">:</span> theService<span class="token punctuation">,</span>
  <span class="token comment">// optional: expose service endpoints at [apiMountPath]/v[serviceVersion]/[path defined for command]</span>
  <span class="token comment">// defaults to /api</span>
  apiMountPath<span class="token operator">:</span> <span class="token string">&#39;/api&#39;</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>

<span class="token comment">// add the metrics route</span>
server<span class="token punctuation">.</span>router<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span><span class="token string">&#39;GET&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;/metrics&#39;</span><span class="token punctuation">,</span> <span class="token keyword">async</span> <span class="token punctuation">(</span>_request<span class="token punctuation">,</span> response<span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  response<span class="token punctuation">.</span><span class="token function">setHeader</span><span class="token punctuation">(</span><span class="token string">&#39;Content-Type&#39;</span><span class="token punctuation">,</span> register<span class="token punctuation">.</span>contentType<span class="token punctuation">)</span>
  response<span class="token punctuation">.</span><span class="token function">end</span><span class="token punctuation">(</span><span class="token keyword">await</span> register<span class="token punctuation">.</span><span class="token function">metrics</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>The new endpoint <code>/metrics</code> can now be added to the <strong>deployment.yaml</strong> file for Kubernetes.</p>`,3),W={href:"https://twitter.com/purista_js",target:"_blank",rel:"noopener noreferrer"},z={href:"https://discord.gg/9feaUm3H2v",target:"_blank",rel:"noopener noreferrer"};function G($,J){const a=p("ExternalLinkIcon"),c=p("RouterLink"),u=p("CodeTabs");return d(),k("div",null,[v,n("p",null,[s("At this point, it is expected, that you are familiar at least with the basics of "),n("a",b,[s("Kubernetes"),e(a)]),s(". There are some good resources to learn, how Node.js programs can be deployed in a Kubernetes cluster:")]),n("ul",null,[n("li",null,[n("a",h,[s("learnk8s - Deploying Node.js apps in a local Kubernetes cluster"),e(a)])]),n("li",null,[n("a",g,[s("IBM - Node.js in a Kubernetes world"),e(a)])])]),f,n("div",y,[w,n("p",null,[s("Here, we only focus on technical requirements and basic setup. The example can be found on "),n("a",_,[s("GitHub PURISTA examples"),e(a)]),s(".")])]),S,x,P,n("p",null,[s("It can be done by using "),e(c,{to:"/api/modules/purista_k8s_sdk.html"},{default:t(()=>[s("@purista/k8s-sdk")]),_:1}),s(".")]),n("div",T,[N,n("p",null,[s("The "),e(c,{to:"/api/modules/purista_k8s_sdk.html"},{default:t(()=>[s("@purista/k8s-sdk")]),_:1}),s(" package is using "),n("a",I,[s("Hono"),e(a)]),s(" to provide a modern, flexible and lightweight http server."),E,s(" Because of this, the webserver is able to use the benefits of different runtime environments like "),n("a",j,[s("Bun"),e(a)]),s("."),B,s(" See "),n("a",D,[s("Hono"),e(a)])])]),R,e(u,{id:"76",data:[{id:"Node.js"},{id:"Bun"}],active:0,"tab-id":"code"},{title0:t(({value:i,isActive:l})=>[s("Node.js")]),title1:t(({value:i,isActive:l})=>[s("Bun")]),tab0:t(({value:i,isActive:l})=>[H]),tab1:t(({value:i,isActive:l})=>[A]),_:1},8,["data"]),O,V,U,q,n("p",null,[s("Luckily, we can do it in one big step, by using docker's "),n("a",L,[s("multi-stage builds"),e(a)])]),C,n("p",null,[s("There might be the need, that you want to add some custom endpoints."),K,s(" As an example, in "),e(c,{to:"/handbook/2._start-building/2.1_service/3_service_advanced.html"},{default:t(()=>[s("2.1 Service - Advanced")]),_:1}),s(" we add "),n("a",M,[s("Prometheus"),e(a)]),s(" to our service. To allow Prometheus to collect the data, we need an additional "),Y,s(" endpoint.")]),F,n("p",null,[n("strong",null,[s("You can follow updated on Twitter "),n("a",W,[s("@purista_js"),e(a)]),s(" or join the "),n("a",z,[s("Discord server"),e(a)]),s(" to get in touch with PURISTA maintainers and other developers.")])])])}const Z=r(m,[["render",G],["__file","2_kubernetes.html.vue"]]);export{Z as default};
