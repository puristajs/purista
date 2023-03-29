import{_ as c,W as d,X as r,Z as e,a0 as t,a1 as a,$ as n,Y as o,D as i}from"./framework-d89ed822.js";const p={},u=o(`<h1 id="module-purista-k8s-sdk" tabindex="-1"><a class="header-anchor" href="#module-purista-k8s-sdk" aria-hidden="true">#</a> Module: @purista/k8s-sdk</h1><p>SDK and helper to run PURISTA services in Kubernetes.</p><p>Here is a full example, how the index file might look like, if you want to deploy a service to Kubernetes.</p><p><strong><code>Example</code></strong></p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token comment">// src/index.ts</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> OTLPTraceExporter <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;@opentelemetry/exporter-trace-otlp-http&#39;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> SimpleSpanProcessor <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;@opentelemetry/sdk-trace-base&#39;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span>
  DefaultConfigStore<span class="token punctuation">,</span>
  DefaultEventBridge<span class="token punctuation">,</span>
  DefaultSecretStore<span class="token punctuation">,</span>
  DefaultStateStore<span class="token punctuation">,</span>
  gracefulShutdown<span class="token punctuation">,</span>
  initLogger<span class="token punctuation">,</span>
<span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;@purista/core&#39;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> getHttpServer <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;@purista/k8s-sdk&#39;</span>

<span class="token keyword">import</span> <span class="token punctuation">{</span> theServiceV1Service <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;./service/theService/v1/&#39;</span>

<span class="token keyword">const</span> <span class="token function-variable function">main</span> <span class="token operator">=</span> <span class="token keyword">async</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  <span class="token comment">// create a logger</span>
  <span class="token keyword">const</span> logger <span class="token operator">=</span> <span class="token function">initLogger</span><span class="token punctuation">(</span><span class="token punctuation">)</span>

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
  <span class="token keyword">const</span> eventBridge <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">DefaultEventBridge</span><span class="token punctuation">(</span><span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token punctuation">{</span> spanProcessor <span class="token punctuation">}</span><span class="token punctuation">)</span>
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
  <span class="token comment">// defaults to port 8080</span>
  <span class="token comment">// optional: you can set the port in the optional parameter of this method</span>
  <span class="token keyword">await</span> server<span class="token punctuation">.</span><span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span>

<span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="table-of-contents" tabindex="-1"><a class="header-anchor" href="#table-of-contents" aria-hidden="true">#</a> Table of contents</h2><h3 id="namespaces" tabindex="-1"><a class="header-anchor" href="#namespaces" aria-hidden="true">#</a> Namespaces</h3>`,7),h=e("h3",{id:"type-aliases",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#type-aliases","aria-hidden":"true"},"#"),n(" Type Aliases")],-1),k=e("h3",{id:"functions",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#functions","aria-hidden":"true"},"#"),n(" Functions")],-1),v=o('<h2 id="type-aliases-1" tabindex="-1"><a class="header-anchor" href="#type-aliases-1" aria-hidden="true">#</a> Type Aliases</h2><h3 id="gethttpserverconfig" tabindex="-1"><a class="header-anchor" href="#gethttpserverconfig" aria-hidden="true">#</a> GetHttpServerConfig</h3><p>Ƭ <strong>GetHttpServerConfig</strong>: <code>Object</code></p><p>The configuration object for creating the k8s http server</p><h4 id="type-declaration" tabindex="-1"><a class="header-anchor" href="#type-declaration" aria-hidden="true">#</a> Type declaration</h4>',5),m=e("thead",null,[e("tr",null,[e("th",{style:{"text-align":"left"}},"Name"),e("th",{style:{"text-align":"left"}},"Type"),e("th",{style:{"text-align":"left"}},"Description")])],-1),f=e("tr",null,[e("td",{style:{"text-align":"left"}},[e("code",null,"apiMountPath?")]),e("td",{style:{"text-align":"left"}},[e("code",null,"string")]),e("td",{style:{"text-align":"left"}},[n("the api mount path "),e("strong",null,[e("code",null,"Default")]),n(" /api")])],-1),g=e("tr",null,[e("td",{style:{"text-align":"left"}},[e("code",null,"healthFn")]),e("td",{style:{"text-align":"left"}},[n("() => "),e("code",null,"Promise"),n("<"),e("code",null,"boolean"),n(">")]),e("td",{style:{"text-align":"left"}},"health function to be executed on health check")],-1),_=e("tr",null,[e("td",{style:{"text-align":"left"}},[e("code",null,"httpServerOptions?")]),e("td",{style:{"text-align":"left"}},[e("code",null,"ServerOptions")]),e("td",{style:{"text-align":"left"}},"node http module server options")],-1),b=e("td",{style:{"text-align":"left"}},[e("code",null,"logger")],-1),y={style:{"text-align":"left"}},x=e("code",null,"Logger",-1),S=e("td",{style:{"text-align":"left"}},"a logger instance",-1),w=e("td",{style:{"text-align":"left"}},[e("code",null,"services?")],-1),P={style:{"text-align":"left"}},D=e("code",null,"Service",-1),T=e("code",null,"Service",-1),H=e("td",{style:{"text-align":"left"}},"service or array of services which should expose their commands as endpoints if defined",-1),R=e("h4",{id:"defined-in",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#defined-in","aria-hidden":"true"},"#"),n(" Defined in")],-1),L={href:"https://github.com/sebastianwessel/purista/blob/8c66693/packages/k8s-sdk/src/types.ts#L8",target:"_blank",rel:"noopener noreferrer"},E=o('<hr><h3 id="routerfunction" tabindex="-1"><a class="header-anchor" href="#routerfunction" aria-hidden="true">#</a> RouterFunction</h3><p>Ƭ <strong>RouterFunction</strong>: (<code>request</code>: <code>IncomingMessage</code>, <code>response</code>: <code>ServerResponse</code>, <code>parameter</code>: <code>Record</code>&lt;<code>string</code>, <code>unknown</code>&gt;) =&gt; <code>Promise</code>&lt;<code>void</code>&gt;</p><h4 id="type-declaration-1" tabindex="-1"><a class="header-anchor" href="#type-declaration-1" aria-hidden="true">#</a> Type declaration</h4><p>▸ (<code>request</code>, <code>response</code>, <code>parameter</code>): <code>Promise</code>&lt;<code>void</code>&gt;</p><h5 id="parameters" tabindex="-1"><a class="header-anchor" href="#parameters" aria-hidden="true">#</a> Parameters</h5><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th></tr></thead><tbody><tr><td style="text-align:left;"><code>request</code></td><td style="text-align:left;"><code>IncomingMessage</code></td></tr><tr><td style="text-align:left;"><code>response</code></td><td style="text-align:left;"><code>ServerResponse</code></td></tr><tr><td style="text-align:left;"><code>parameter</code></td><td style="text-align:left;"><code>Record</code>&lt;<code>string</code>, <code>unknown</code>&gt;</td></tr></tbody></table><h5 id="returns" tabindex="-1"><a class="header-anchor" href="#returns" aria-hidden="true">#</a> Returns</h5><p><code>Promise</code>&lt;<code>void</code>&gt;</p><h4 id="defined-in-1" tabindex="-1"><a class="header-anchor" href="#defined-in-1" aria-hidden="true">#</a> Defined in</h4>',10),I={href:"https://github.com/sebastianwessel/purista/blob/8c66693/packages/k8s-sdk/src/getHttpServer.impl.ts#L10",target:"_blank",rel:"noopener noreferrer"},B=o('<h2 id="functions-1" tabindex="-1"><a class="header-anchor" href="#functions-1" aria-hidden="true">#</a> Functions</h2><h3 id="addserviceendpoints" tabindex="-1"><a class="header-anchor" href="#addserviceendpoints" aria-hidden="true">#</a> addServiceEndpoints</h3><p>▸ <strong>addServiceEndpoints</strong>(<code>services</code>, <code>router</code>, <code>logger</code>, <code>apiMountPath?</code>): <code>void</code></p><p><strong><code>Default</code></strong></p><p>/api</p><h4 id="parameters-1" tabindex="-1"><a class="header-anchor" href="#parameters-1" aria-hidden="true">#</a> Parameters</h4>',6),M=e("thead",null,[e("tr",null,[e("th",{style:{"text-align":"left"}},"Name"),e("th",{style:{"text-align":"left"}},"Type"),e("th",{style:{"text-align":"left"}},"Default value"),e("th",{style:{"text-align":"left"}},"Description")])],-1),N=e("td",{style:{"text-align":"left"}},[e("code",null,"services")],-1),C={style:{"text-align":"left"}},F=e("code",null,"undefined",-1),O=e("code",null,"Service",-1),V=e("code",null,"unknown",-1),j=e("code",null,"Service",-1),A=e("code",null,"unknown",-1),G=e("td",{style:{"text-align":"left"}},[e("code",null,"undefined")],-1),K=e("td",{style:{"text-align":"left"}},"instance of the service to add",-1),q=e("tr",null,[e("td",{style:{"text-align":"left"}},[e("code",null,"router")]),e("td",{style:{"text-align":"left"}},[e("code",null,"default"),n("<"),e("code",null,"Function"),n(">")]),e("td",{style:{"text-align":"left"}},[e("code",null,"undefined")]),e("td",{style:{"text-align":"left"}},"the TRouter instance")],-1),z=e("td",{style:{"text-align":"left"}},[e("code",null,"logger")],-1),U={style:{"text-align":"left"}},Y=e("code",null,"Logger",-1),W=e("td",{style:{"text-align":"left"}},[e("code",null,"undefined")],-1),X=e("td",{style:{"text-align":"left"}},"the logger used for logging the addition",-1),Z=e("tr",null,[e("td",{style:{"text-align":"left"}},[e("code",null,"apiMountPath")]),e("td",{style:{"text-align":"left"}},[e("code",null,"string")]),e("td",{style:{"text-align":"left"}},[e("code",null,"'/api'")]),e("td",{style:{"text-align":"left"}})],-1),$=e("h4",{id:"returns-1",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#returns-1","aria-hidden":"true"},"#"),n(" Returns")],-1),J=e("p",null,[e("code",null,"void")],-1),Q=e("h4",{id:"defined-in-2",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#defined-in-2","aria-hidden":"true"},"#"),n(" Defined in")],-1),ee={href:"https://github.com/sebastianwessel/purista/blob/8c66693/packages/k8s-sdk/src/addServiceEndpoints.impl.ts#L30",target:"_blank",rel:"noopener noreferrer"},ne=o('<hr><h3 id="gethttpserver" tabindex="-1"><a class="header-anchor" href="#gethttpserver" aria-hidden="true">#</a> getHttpServer</h3><p>▸ <strong>getHttpServer</strong>(<code>input</code>, <code>name?</code>): <code>Object</code></p><p>Create a basic http web server. It adds per default the /healthz endpoint If services is set in options, all commands, which have defined http endpoints, will also be added as endpoints</p><p>The returned server is not started. You need to do it manually.</p><h4 id="parameters-2" tabindex="-1"><a class="header-anchor" href="#parameters-2" aria-hidden="true">#</a> Parameters</h4>',6),te=e("thead",null,[e("tr",null,[e("th",{style:{"text-align":"left"}},"Name"),e("th",{style:{"text-align":"left"}},"Type"),e("th",{style:{"text-align":"left"}},"Default value"),e("th",{style:{"text-align":"left"}},"Description")])],-1),se=e("td",{style:{"text-align":"left"}},[e("code",null,"input")],-1),ae={style:{"text-align":"left"}},oe=e("code",null,"GetHttpServerConfig",-1),le=e("td",{style:{"text-align":"left"}},[e("code",null,"undefined")],-1),ie=e("td",{style:{"text-align":"left"}},"the config",-1),ce=e("tr",null,[e("td",{style:{"text-align":"left"}},[e("code",null,"name")]),e("td",{style:{"text-align":"left"}},[e("code",null,"string")]),e("td",{style:{"text-align":"left"}},[e("code",null,"'K8sHttpHelperServer'")]),e("td",{style:{"text-align":"left"}},"-")],-1),de=e("h4",{id:"returns-2",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#returns-2","aria-hidden":"true"},"#"),n(" Returns")],-1),re=e("p",null,[e("code",null,"Object")],-1),pe=e("p",null,"a object with server, router, start and destroy functions and name var",-1),ue=e("thead",null,[e("tr",null,[e("th",{style:{"text-align":"left"}},"Name"),e("th",{style:{"text-align":"left"}},"Type")])],-1),he=e("tr",null,[e("td",{style:{"text-align":"left"}},[e("code",null,"destroy")]),e("td",{style:{"text-align":"left"}},[n("() => "),e("code",null,"Promise"),n("<"),e("code",null,"void"),n(">")])],-1),ke=e("tr",null,[e("td",{style:{"text-align":"left"}},[e("code",null,"name")]),e("td",{style:{"text-align":"left"}},[e("code",null,"string")])],-1),ve=e("td",{style:{"text-align":"left"}},[e("code",null,"router")],-1),me={style:{"text-align":"left"}},fe=e("code",null,"default",-1),ge=e("code",null,"RouterFunction",-1),_e=e("tr",null,[e("td",{style:{"text-align":"left"}},[e("code",null,"server")]),e("td",{style:{"text-align":"left"}},[e("code",null,"Server"),n("<typeof "),e("code",null,"IncomingMessage"),n(", typeof "),e("code",null,"ServerResponse"),n(">")])],-1),be=e("tr",null,[e("td",{style:{"text-align":"left"}},[e("code",null,"start")]),e("td",{style:{"text-align":"left"}},[n("("),e("code",null,"port"),n(": "),e("code",null,"number"),n(") => "),e("code",null,"Promise"),n("<"),e("code",null,"void"),n(">")])],-1),ye=e("h4",{id:"defined-in-3",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#defined-in-3","aria-hidden":"true"},"#"),n(" Defined in")],-1),xe={href:"https://github.com/sebastianwessel/purista/blob/8c66693/packages/k8s-sdk/src/getHttpServer.impl.ts#L26",target:"_blank",rel:"noopener noreferrer"};function Se(we,Pe){const s=i("RouterLink"),l=i("ExternalLinkIcon");return d(),r("div",null,[e("p",null,[t(s,{to:"/api/"},{default:a(()=>[n("PURISTA API - v1.4.9")]),_:1}),n(" / "),t(s,{to:"/api/modules.html"},{default:a(()=>[n("Modules")]),_:1}),n(" / @purista/k8s-sdk")]),u,e("ul",null,[e("li",null,[t(s,{to:"/api/modules/purista_k8s_sdk.internal.html"},{default:a(()=>[n("internal")]),_:1})])]),h,e("ul",null,[e("li",null,[t(s,{to:"/api/modules/purista_k8s_sdk.html#gethttpserverconfig"},{default:a(()=>[n("GetHttpServerConfig")]),_:1})]),e("li",null,[t(s,{to:"/api/modules/purista_k8s_sdk.html#routerfunction"},{default:a(()=>[n("RouterFunction")]),_:1})])]),k,e("ul",null,[e("li",null,[t(s,{to:"/api/modules/purista_k8s_sdk.html#addserviceendpoints"},{default:a(()=>[n("addServiceEndpoints")]),_:1})]),e("li",null,[t(s,{to:"/api/modules/purista_k8s_sdk.html#gethttpserver"},{default:a(()=>[n("getHttpServer")]),_:1})])]),v,e("table",null,[m,e("tbody",null,[f,g,_,e("tr",null,[b,e("td",y,[t(s,{to:"/api/classes/purista_k8s_sdk.internal.Logger.html"},{default:a(()=>[x]),_:1})]),S]),e("tr",null,[w,e("td",P,[t(s,{to:"/api/classes/purista_k8s_sdk.internal.Service.html"},{default:a(()=>[D]),_:1}),n(" | "),t(s,{to:"/api/classes/purista_k8s_sdk.internal.Service.html"},{default:a(()=>[T]),_:1}),n("[]")]),H])])]),R,e("p",null,[e("a",L,[n("packages/k8s-sdk/src/types.ts:8"),t(l)])]),E,e("p",null,[e("a",I,[n("packages/k8s-sdk/src/getHttpServer.impl.ts:10"),t(l)])]),B,e("table",null,[M,e("tbody",null,[e("tr",null,[N,e("td",C,[F,n(" | "),t(s,{to:"/api/classes/purista_k8s_sdk.internal.Service.html"},{default:a(()=>[O]),_:1}),n("<"),V,n("> | "),t(s,{to:"/api/classes/purista_k8s_sdk.internal.Service.html"},{default:a(()=>[j]),_:1}),n("<"),A,n(">[]")]),G,K]),q,e("tr",null,[z,e("td",U,[t(s,{to:"/api/classes/purista_k8s_sdk.internal.Logger.html"},{default:a(()=>[Y]),_:1})]),W,X]),Z])]),$,J,Q,e("p",null,[e("a",ee,[n("packages/k8s-sdk/src/addServiceEndpoints.impl.ts:30"),t(l)])]),ne,e("table",null,[te,e("tbody",null,[e("tr",null,[se,e("td",ae,[t(s,{to:"/api/modules/purista_k8s_sdk.html#gethttpserverconfig"},{default:a(()=>[oe]),_:1})]),le,ie]),ce])]),de,re,pe,e("table",null,[ue,e("tbody",null,[he,ke,e("tr",null,[ve,e("td",me,[fe,n("<"),t(s,{to:"/api/modules/purista_k8s_sdk.html#routerfunction"},{default:a(()=>[ge]),_:1}),n(">")])]),_e,be])]),ye,e("p",null,[e("a",xe,[n("packages/k8s-sdk/src/getHttpServer.impl.ts:26"),t(l)])])])}const Te=c(p,[["render",Se],["__file","purista_k8s_sdk.html.vue"]]);export{Te as default};