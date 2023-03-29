import{_ as c,W as l,X as r,Z as n,$ as s,a0 as a,a1 as p,Y as t,D as i}from"./framework-d89ed822.js";const u={},d=n("h2",{id:"prerequisites",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#prerequisites","aria-hidden":"true"},"#"),s(" Prerequisites")],-1),k={href:"https://kubernetes.io",target:"_blank",rel:"noopener noreferrer"},v={href:"https://learnk8s.io/deploying-nodejs-kubernetes",target:"_blank",rel:"noopener noreferrer"},m={href:"https://developer.ibm.com/articles/nodejs-kubernetes-basics/",target:"_blank",rel:"noopener noreferrer"},b=t("<p>In the flowing example, it is expected:</p><ul><li>you have a mono-repo with one service <strong>TheService</strong></li><li>typescript is listed <code>devDependencies</code> in your package.json</li><li>you have in your tsconfig.json: in <code>compilerOptions</code> the <code>outDir</code> set to <code>build</code></li><li>you have in your tsconfig.json: <code>include</code> set to <code>[&quot;./src/index.ts&quot;]</code></li></ul>",2),h={class:"hint-container info"},g=n("p",{class:"hint-container-title"},"Info",-1),y={href:"https://github.com/sebastianwessel/purista/tree/master/examples/kubernetes",target:"_blank",rel:"noopener noreferrer"},f=n("h2",{id:"prepare-your-code",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#prepare-your-code","aria-hidden":"true"},"#"),s(" Prepare your code")],-1),w=n("p",null,[s("Kubernetes is normally used by microservices, which are providing HTTP endpoints. Also, it is expected, that the service provides "),n("em",null,"liveness"),s(" and "),n("em",null,"readiness"),s(" probes over HTTP. Therefore, we use a small HTTP server here.")],-1),_=n("p",null,"We also want to handle shutdown signals properly.",-1),S=t(`<p>As you will see, you can optional expose commands as HTTP endpoints. This will allow <strong>integration into existing or other microservices environments</strong> or <strong>exposing commands as HTTP endpoints for clients</strong>.</p><p>Here is a full example, of how the index file might look like, if you want to deploy a service to Kubernetes. You can adjust this example for your actual requirements.</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token comment">// src/index.ts</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> OTLPTraceExporter <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;@opentelemetry/exporter-trace-otlp-http&#39;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> SimpleSpanProcessor <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;@opentelemetry/sdk-trace-base&#39;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span>
  DefaultConfigStore<span class="token punctuation">,</span>
  DefaultEventBridge<span class="token punctuation">,</span>
  DefaultSecretStore<span class="token punctuation">,</span>
  DefaultStateStore<span class="token punctuation">,</span>
  gracefulShutdown<span class="token punctuation">,</span>
  initLogger<span class="token punctuation">,</span>
  UnhandledError<span class="token punctuation">,</span>
<span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;@purista/core&#39;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> getHttpServer <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;@purista/k8s-sdk&#39;</span>

<span class="token keyword">import</span> <span class="token punctuation">{</span> theServiceV1Service <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;./service/theService/v1/&#39;</span>

<span class="token keyword">const</span> <span class="token function-variable function">main</span> <span class="token operator">=</span> <span class="token keyword">async</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  <span class="token comment">// create a logger</span>
  <span class="token keyword">const</span> logger <span class="token operator">=</span> <span class="token function">initLogger</span><span class="token punctuation">(</span><span class="token punctuation">)</span>

  <span class="token comment">// add listeners to log really unexpected errors</span>
  process<span class="token punctuation">.</span><span class="token function">on</span><span class="token punctuation">(</span><span class="token string">&#39;uncaughtException&#39;</span><span class="token punctuation">,</span> <span class="token punctuation">(</span>error<span class="token punctuation">,</span> origin<span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> err <span class="token operator">=</span> UnhandledError<span class="token punctuation">.</span><span class="token function">fromError</span><span class="token punctuation">(</span>error<span class="token punctuation">)</span>
    logger<span class="token punctuation">.</span><span class="token function">error</span><span class="token punctuation">(</span><span class="token punctuation">{</span> err<span class="token punctuation">,</span> origin <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">unhandled error: </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>err<span class="token punctuation">.</span>message<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>

  process<span class="token punctuation">.</span><span class="token function">on</span><span class="token punctuation">(</span><span class="token string">&#39;unhandledRejection&#39;</span><span class="token punctuation">,</span> <span class="token punctuation">(</span>error<span class="token punctuation">,</span> origin<span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> err <span class="token operator">=</span> UnhandledError<span class="token punctuation">.</span><span class="token function">fromError</span><span class="token punctuation">(</span>error<span class="token punctuation">)</span>
    logger<span class="token punctuation">.</span><span class="token function">error</span><span class="token punctuation">(</span><span class="token punctuation">{</span> err<span class="token punctuation">,</span> origin <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">unhandled rejection: </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>err<span class="token punctuation">.</span>message<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>

  <span class="token comment">// optional: set up opentelemetry if you like to use it</span>
  <span class="token keyword">const</span> exporter <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">OTLPTraceExporter</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
    url<span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">http://localhost:14268/api/traces</span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>
  <span class="token keyword">const</span> spanProcessor <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">SimpleSpanProcessor</span><span class="token punctuation">(</span>exporter<span class="token punctuation">)</span>

  <span class="token comment">// optional: set up stores if they are needed for your service</span>
  <span class="token keyword">const</span> secretStore <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">DefaultSecretStore</span><span class="token punctuation">(</span><span class="token punctuation">{</span> logger <span class="token punctuation">}</span><span class="token punctuation">)</span>
  <span class="token keyword">const</span> configStore <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">DefaultConfigStore</span><span class="token punctuation">(</span><span class="token punctuation">{</span> logger <span class="token punctuation">}</span><span class="token punctuation">)</span>
  <span class="token keyword">const</span> stateStore <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">DefaultStateStore</span><span class="token punctuation">(</span><span class="token punctuation">{</span> logger <span class="token punctuation">}</span><span class="token punctuation">)</span>

  <span class="token comment">// set up the eventbridge and start the event bridge</span>
  <span class="token keyword">const</span> eventBridge <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">DefaultEventBridge</span><span class="token punctuation">(</span><span class="token punctuation">{</span> spanProcessor <span class="token punctuation">}</span><span class="token punctuation">)</span>
  <span class="token keyword">await</span> eventBridge<span class="token punctuation">.</span><span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span>

  <span class="token comment">// set up the service</span>
  <span class="token keyword">const</span> theService <span class="token operator">=</span> theServiceV1Service<span class="token punctuation">.</span><span class="token function">getInstance</span><span class="token punctuation">(</span>eventBridge<span class="token punctuation">,</span> <span class="token punctuation">{</span>
    spanProcessor<span class="token punctuation">,</span>
    configStore<span class="token punctuation">,</span>
    secretStore<span class="token punctuation">,</span>
    stateStore<span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>
  <span class="token keyword">await</span> theService<span class="token punctuation">.</span><span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span>

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

  <span class="token comment">// register shut down methods</span>
  <span class="token function">gracefulShutdown</span><span class="token punctuation">(</span>logger<span class="token punctuation">,</span> <span class="token punctuation">[</span>
    <span class="token comment">// start with the event bridge to no longer accept incoming messages</span>
    eventBridge<span class="token punctuation">,</span>
    <span class="token comment">// optional: shut down the service</span>
    theService<span class="token punctuation">,</span>
    <span class="token comment">// optional: shut down the secret store</span>
    secretStore<span class="token punctuation">,</span>
    <span class="token comment">// optional: shut down the config store</span>
    configStore<span class="token punctuation">,</span>
    <span class="token comment">// optional: shut down the state store</span>
    stateStore<span class="token punctuation">,</span>
    <span class="token comment">// stop the http server</span>
    server<span class="token punctuation">,</span>
  <span class="token punctuation">]</span><span class="token punctuation">)</span>

  <span class="token comment">// start the http server</span>
  <span class="token keyword">await</span> server<span class="token punctuation">.</span><span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span>

<span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>With this setup, you should be able to build and deploy your app as a container in Kubernetes like any other node-based service.</p><h2 id="build-a-docker-image" tabindex="-1"><a class="header-anchor" href="#build-a-docker-image" aria-hidden="true">#</a> Build a docker image</h2><p>To get a docker image, which then can be deployed, you will need to have done two things:</p><ul><li>compile the typescript code base to plain JavaScript</li><li>create a docker file with minimum resources (no dev dependencies) and compiled JavaScript</li></ul>`,7),x={href:"https://docs.docker.com/build/building/multi-stage/",target:"_blank",rel:"noopener noreferrer"},T=t(`<p>Place a <code>Dockerfile</code> into the root of your repository. The file looks something like this.</p><div class="language-Dockerfile line-numbers-mode" data-ext="Dockerfile"><pre class="language-Dockerfile"><code>FROM node:18-alpine as builder

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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container warning"><p class="hint-container-title">Note</p><p>Please be aware, that this is just an example for demonstration and local development purpose.<br> You should adjust it for production, depending on your actual environment.</p></div><h2 id="that-s-it" tabindex="-1"><a class="header-anchor" href="#that-s-it" aria-hidden="true">#</a> That&#39;s it?</h2><p>Well, you might want to define a (Kubernetes) service, which makes Pods accessible to other Pods or users outside the cluster.</p><p>But, here we only focus on the PURISTA related stuff, and not go into details of Kubernetes. There are a bunch of good articles, documentations, how-to&#39;s, which cover the Kubernetes and infrastructure stuff a way better.</p><h2 id="add-custom-endpoints" tabindex="-1"><a class="header-anchor" href="#add-custom-endpoints" aria-hidden="true">#</a> Add custom endpoints</h2>`,12),P=n("br",null,null,-1),D={href:"https://prometheus.io",target:"_blank",rel:"noopener noreferrer"},N=n("code",null,"/metrics",-1),E=t(`<p>We can simply extend our file <code>/src/index.ts</code>, to provide the endpoint <code>/metrics</code></p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code>
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>The new endpoint <code>/metrics</code> can now be added to the <strong>deployment.yaml</strong> file for Kubernetes.</p>`,3);function R(j,O){const e=i("ExternalLinkIcon"),o=i("RouterLink");return l(),r("div",null,[d,n("p",null,[s("At this point, it is expected, that you are familiar at least with the basics of "),n("a",k,[s("Kubernetes"),a(e)]),s(". There are some good resources to learn, how Node.js programs can be deployed in a Kubernetes cluster:")]),n("ul",null,[n("li",null,[n("a",v,[s("learnk8s - Deploying Node.js apps in a local Kubernetes cluster"),a(e)])]),n("li",null,[n("a",m,[s("IBM - Node.js in a Kubernetes world"),a(e)])])]),b,n("div",h,[g,n("p",null,[s("Here, we only focus on technical requirements and basic setup. The example can be found on "),n("a",y,[s("GitHub PURISTA examples"),a(e)]),s(".")])]),f,w,_,n("p",null,[s("This can be done by using "),a(o,{to:"/api/modules/purista_k8s_sdk.html"},{default:p(()=>[s("@purista/k8s-sdk")]),_:1}),s(".")]),S,n("p",null,[s("Luckily, we can do it in one big step, by using docker's "),n("a",x,[s("multi-stage builds"),a(e)])]),T,n("p",null,[s("There might be the need, that you want to add some custom endpoints."),P,s(" As an example, in "),a(o,{to:"/handbook/2._start-building/2.1_service/3_service_advanced.html"},{default:p(()=>[s("2.1 Service - Advanced")]),_:1}),s(" we add "),n("a",D,[s("Prometheus"),a(e)]),s(" to our service. To allow Prometheus to collect the data, we need an additional "),N,s(" endpoint.")]),E])}const H=c(u,[["render",R],["__file","2_kubernetes.html.vue"]]);export{H as default};
