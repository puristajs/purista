import{_ as l,W as c,X as d,Z as e,a0 as s,a1 as o,$ as n,Y as r,D as i}from"./framework-d89ed822.js";const u={},p=e("h1",{id:"module-purista-httpserver",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#module-purista-httpserver","aria-hidden":"true"},"#"),n(" Module: @purista/httpserver")],-1),_=e("p",null,[n("The HttpServerService is a service which exposes commands of services as http endpoints."),e("br"),n(" All exposed commands must be marked as exposed endpoints in the CommandBuilder.")],-1),h=e("p",null,"While the main focus is on development and debug, the HttpServerService will also fit for small projects or running on IoT/edge.",-1),v={href:"https://www.fastify.io/",target:"_blank",rel:"noopener noreferrer"},m=e("br",null,null,-1),f={href:"https://www.fastify.io/ecosystem/",target:"_blank",rel:"noopener noreferrer"},b=r(`<p>The HttpServerService can also be configured, to provide the OpenApi-UI in browsers.<br> The OpenApi definitions is created from the CommandBuilder settings of each command.<br> This means, that there are no additional steps or code required, to provide the OpenApi definition.<br> It is autogenerated mostly from input and output schema definitions.</p><p><strong><code>Example</code></strong></p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token keyword">import</span> fastifyStatic <span class="token keyword">from</span> <span class="token string">&#39;@fastify/static&#39;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> DefaultEventBridge<span class="token punctuation">,</span> gracefulShutdown<span class="token punctuation">,</span> initLogger <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;@purista/core&#39;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> httpServerV1Service<span class="token punctuation">,</span> HttpServerServiceV1Config <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;@purista/httpserver&#39;</span>

<span class="token keyword">const</span> <span class="token function-variable function">main</span> <span class="token operator">=</span> <span class="token keyword">async</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
 <span class="token keyword">const</span> logger <span class="token operator">=</span> <span class="token function">initLogger</span><span class="token punctuation">(</span><span class="token punctuation">)</span>

 <span class="token keyword">const</span> eventBridge <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">DefaultEventBridge</span><span class="token punctuation">(</span><span class="token punctuation">)</span>

 <span class="token keyword">const</span> httpServerConfig<span class="token operator">:</span> HttpServerServiceV1Config <span class="token operator">=</span> <span class="token punctuation">{</span>
   fastify<span class="token operator">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
   port<span class="token operator">:</span> <span class="token number">8080</span><span class="token punctuation">,</span>
   logLevel<span class="token operator">:</span> <span class="token string">&#39;debug&#39;</span><span class="token punctuation">,</span>
   domain<span class="token operator">:</span> <span class="token string">&#39;localhost&#39;</span><span class="token punctuation">,</span>
   apiMountPath<span class="token operator">:</span> <span class="token string">&#39;/api&#39;</span><span class="token punctuation">,</span>
   openApi<span class="token operator">:</span> <span class="token punctuation">{</span>
     enabled<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
     info<span class="token operator">:</span> <span class="token punctuation">{</span>
       title<span class="token operator">:</span> <span class="token string">&#39;backend api&#39;</span><span class="token punctuation">,</span>
       description<span class="token operator">:</span> <span class="token string">&#39;OpenApi definition for server endpoints&#39;</span><span class="token punctuation">,</span>
       version<span class="token operator">:</span> <span class="token string">&#39;1.0.0&#39;</span><span class="token punctuation">,</span>
     <span class="token punctuation">}</span><span class="token punctuation">,</span>
   <span class="token punctuation">}</span><span class="token punctuation">,</span>
 <span class="token punctuation">}</span>

 <span class="token keyword">const</span> httpServerService <span class="token operator">=</span> httpServerV1Service<span class="token punctuation">.</span><span class="token function">getInstance</span><span class="token punctuation">(</span>eventBridge<span class="token punctuation">,</span> <span class="token punctuation">{</span>
   serviceConfig<span class="token operator">:</span> httpServerConfig<span class="token punctuation">,</span>
 <span class="token punctuation">}</span><span class="token punctuation">)</span>

 <span class="token comment">// static file handler</span>
 <span class="token keyword">const</span> defaultPublicPath <span class="token operator">=</span> <span class="token function">resolve</span><span class="token punctuation">(</span>__dirname<span class="token punctuation">,</span> <span class="token string">&#39;..&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;public&#39;</span><span class="token punctuation">)</span>
 httpServerService<span class="token punctuation">.</span>server<span class="token operator">?.</span><span class="token function">register</span><span class="token punctuation">(</span>fastifyStatic<span class="token punctuation">,</span> <span class="token punctuation">{</span>
   root<span class="token operator">:</span> defaultPublicPath<span class="token punctuation">,</span>
   decorateReply<span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
 <span class="token punctuation">}</span><span class="token punctuation">)</span>

 <span class="token comment">// start the webserver</span>
 <span class="token keyword">await</span> httpServerService<span class="token punctuation">.</span><span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span>

 <span class="token comment">// and and start your services here</span>
 <span class="token comment">// ...</span>
 <span class="token comment">// ...</span>

 <span class="token function">gracefulShutdown</span><span class="token punctuation">(</span>logger<span class="token punctuation">,</span> <span class="token punctuation">[</span>
   <span class="token comment">// start with the event bridge to no longer accept incoming messages</span>
   eventBridge<span class="token punctuation">,</span>
   <span class="token comment">// shut down optional services</span>
   <span class="token comment">// ...</span>
   <span class="token comment">// ...</span>
   httpServerService<span class="token punctuation">,</span>
 <span class="token punctuation">]</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span>

<span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="table-of-contents" tabindex="-1"><a class="header-anchor" href="#table-of-contents" aria-hidden="true">#</a> Table of contents</h2><h3 id="namespaces" tabindex="-1"><a class="header-anchor" href="#namespaces" aria-hidden="true">#</a> Namespaces</h3>`,5),k=e("h3",{id:"type-aliases",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#type-aliases","aria-hidden":"true"},"#"),n(" Type Aliases")],-1),g=e("h3",{id:"variables",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#variables","aria-hidden":"true"},"#"),n(" Variables")],-1),S=e("h2",{id:"type-aliases-1",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#type-aliases-1","aria-hidden":"true"},"#"),n(" Type Aliases")],-1),y=e("h3",{id:"httpserverv1servicecommandstorestapiinputpayload",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#httpserverv1servicecommandstorestapiinputpayload","aria-hidden":"true"},"#"),n(" HttpServerV1ServiceCommandsToRestApiInputPayload")],-1),w=e("strong",null,"HttpServerV1ServiceCommandsToRestApiInputPayload",-1),C=e("code",null,"z.output",-1),x=e("code",null,"httpServerV1ServiceCommandsToRestApiInputPayloadSchema",-1),V=e("h4",{id:"defined-in",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#defined-in","aria-hidden":"true"},"#"),n(" Defined in")],-1),O={href:"https://github.com/sebastianwessel/purista/blob/8c66693/packages/httpserver/src/service/httpServer/v1/subscription/serviceCommandsToRestApi/types.ts#L5",target:"_blank",rel:"noopener noreferrer"},H=e("h2",{id:"variables-1",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#variables-1","aria-hidden":"true"},"#"),n(" Variables")],-1),P=e("h3",{id:"httpserverserviceinfo",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#httpserverserviceinfo","aria-hidden":"true"},"#"),n(" httpServerServiceInfo")],-1),A=e("code",null,"Const",-1),B=e("strong",null,"httpServerServiceInfo",-1),L=e("code",null,"ServiceInfoType",-1),T=e("h4",{id:"defined-in-1",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#defined-in-1","aria-hidden":"true"},"#"),n(" Defined in")],-1),I={href:"https://github.com/sebastianwessel/purista/blob/8c66693/packages/httpserver/src/service/httpServer/v1/httpServerV1ServiceBuilder.ts#L11",target:"_blank",rel:"noopener noreferrer"},D=e("hr",null,null,-1),N=e("h3",{id:"httpserverv1service",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#httpserverv1service","aria-hidden":"true"},"#"),n(" httpServerV1Service")],-1),R=e("code",null,"Const",-1),M=e("strong",null,"httpServerV1Service",-1),z=e("code",null,"ServiceBuilder",-1),E=e("code",null,"apiMountPath?",-1),U=e("code",null,"string",-1),W=e("code",null,"compressOptions?",-1),j=e("code",null,"any",-1),q=e("code",null,"cookieSecret?",-1),X=e("code",null,"string",-1),Y=e("code",null,"corsOptions?",-1),Z=e("code",null,"any",-1),$=e("code",null,"domain",-1),F=e("code",null,"string",-1),G=e("code",null,"enableCompress?",-1),J=e("code",null,"boolean",-1),K=e("code",null,"enableCors?",-1),Q=e("code",null,"boolean",-1),ee=e("code",null,"enableHealthz?",-1),ne=e("code",null,"boolean",-1),se=e("code",null,"enableHelmet?",-1),te=e("code",null,"boolean",-1),oe=e("code",null,"fastify?",-1),ae=e("code",null,"any",-1),ie=e("code",null,"helmetOptions?",-1),le=e("code",null,"host?",-1),ce=e("code",null,"string",-1),de=e("code",null,"logLevel?",-1),re=e("code",null,'"error"',-1),ue=e("code",null,'"debug"',-1),pe=e("code",null,'"fatal"',-1),_e=e("code",null,'"warn"',-1),he=e("code",null,'"info"',-1),ve=e("code",null,'"trace"',-1),me=e("code",null,"openApi?",-1),fe=e("code",null,"port",-1),be=e("code",null,"number",-1),ke=e("code",null,"uploadDir?",-1),ge=e("code",null,"string",-1),Se=e("code",null,"apiMountPath?",-1),ye=e("code",null,"string",-1),we=e("code",null,"compressOptions?",-1),Ce=e("code",null,"any",-1),xe=e("code",null,"cookieSecret?",-1),Ve=e("code",null,"string",-1),Oe=e("code",null,"corsOptions?",-1),He=e("code",null,"any",-1),Pe=e("code",null,"domain",-1),Ae=e("code",null,"string",-1),Be=e("code",null,"enableCompress?",-1),Le=e("code",null,"boolean",-1),Te=e("code",null,"enableCors?",-1),Ie=e("code",null,"boolean",-1),De=e("code",null,"enableHealthz?",-1),Ne=e("code",null,"boolean",-1),Re=e("code",null,"enableHelmet?",-1),Me=e("code",null,"boolean",-1),ze=e("code",null,"fastify?",-1),Ee=e("code",null,"any",-1),Ue=e("code",null,"helmetOptions?",-1),We=e("code",null,"host?",-1),je=e("code",null,"string",-1),qe=e("code",null,"logLevel?",-1),Xe=e("code",null,'"error"',-1),Ye=e("code",null,'"debug"',-1),Ze=e("code",null,'"fatal"',-1),$e=e("code",null,'"warn"',-1),Fe=e("code",null,'"info"',-1),Ge=e("code",null,'"trace"',-1),Je=e("code",null,"openApi?",-1),Ke=e("code",null,"port",-1),Qe=e("code",null,"number",-1),en=e("code",null,"uploadDir?",-1),nn=e("code",null,"string",-1),sn=e("code",null,"HttpServerClass",-1),tn=e("code",null,"apiMountPath?",-1),on=e("code",null,"string",-1),an=e("code",null,"compressOptions?",-1),ln=e("code",null,"any",-1),cn=e("code",null,"cookieSecret?",-1),dn=e("code",null,"string",-1),rn=e("code",null,"corsOptions?",-1),un=e("code",null,"any",-1),pn=e("code",null,"domain",-1),_n=e("code",null,"string",-1),hn=e("code",null,"enableCompress?",-1),vn=e("code",null,"boolean",-1),mn=e("code",null,"enableCors?",-1),fn=e("code",null,"boolean",-1),bn=e("code",null,"enableHealthz?",-1),kn=e("code",null,"boolean",-1),gn=e("code",null,"enableHelmet?",-1),Sn=e("code",null,"boolean",-1),yn=e("code",null,"fastify?",-1),wn=e("code",null,"any",-1),Cn=e("code",null,"helmetOptions?",-1),xn=e("code",null,"host?",-1),Vn=e("code",null,"string",-1),On=e("code",null,"logLevel?",-1),Hn=e("code",null,'"error"',-1),Pn=e("code",null,'"debug"',-1),An=e("code",null,'"fatal"',-1),Bn=e("code",null,'"warn"',-1),Ln=e("code",null,'"info"',-1),Tn=e("code",null,'"trace"',-1),In=e("code",null,"openApi?",-1),Dn=e("code",null,"port",-1),Nn=e("code",null,"number",-1),Rn=e("code",null,"uploadDir?",-1),Mn=e("code",null,"string",-1),zn=e("h4",{id:"defined-in-2",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#defined-in-2","aria-hidden":"true"},"#"),n(" Defined in")],-1),En={href:"https://github.com/sebastianwessel/purista/blob/8c66693/packages/httpserver/src/service/httpServer/v1/httpServerV1Service.ts#L16",target:"_blank",rel:"noopener noreferrer"},Un=e("hr",null,null,-1),Wn=e("h3",{id:"httpserverv1servicebuilder",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#httpserverv1servicebuilder","aria-hidden":"true"},"#"),n(" httpServerV1ServiceBuilder")],-1),jn=e("code",null,"Const",-1),qn=e("strong",null,"httpServerV1ServiceBuilder",-1),Xn=e("code",null,"ServiceBuilder",-1),Yn=e("code",null,"apiMountPath?",-1),Zn=e("code",null,"string",-1),$n=e("code",null,"compressOptions?",-1),Fn=e("code",null,"any",-1),Gn=e("code",null,"cookieSecret?",-1),Jn=e("code",null,"string",-1),Kn=e("code",null,"corsOptions?",-1),Qn=e("code",null,"any",-1),es=e("code",null,"domain",-1),ns=e("code",null,"string",-1),ss=e("code",null,"enableCompress?",-1),ts=e("code",null,"boolean",-1),os=e("code",null,"enableCors?",-1),as=e("code",null,"boolean",-1),is=e("code",null,"enableHealthz?",-1),ls=e("code",null,"boolean",-1),cs=e("code",null,"enableHelmet?",-1),ds=e("code",null,"boolean",-1),rs=e("code",null,"fastify?",-1),us=e("code",null,"any",-1),ps=e("code",null,"helmetOptions?",-1),_s=e("code",null,"host?",-1),hs=e("code",null,"string",-1),vs=e("code",null,"logLevel?",-1),ms=e("code",null,'"error"',-1),fs=e("code",null,'"debug"',-1),bs=e("code",null,'"fatal"',-1),ks=e("code",null,'"warn"',-1),gs=e("code",null,'"info"',-1),Ss=e("code",null,'"trace"',-1),ys=e("code",null,"openApi?",-1),ws=e("code",null,"port",-1),Cs=e("code",null,"number",-1),xs=e("code",null,"uploadDir?",-1),Vs=e("code",null,"string",-1),Os=e("code",null,"apiMountPath?",-1),Hs=e("code",null,"string",-1),Ps=e("code",null,"compressOptions?",-1),As=e("code",null,"any",-1),Bs=e("code",null,"cookieSecret?",-1),Ls=e("code",null,"string",-1),Ts=e("code",null,"corsOptions?",-1),Is=e("code",null,"any",-1),Ds=e("code",null,"domain",-1),Ns=e("code",null,"string",-1),Rs=e("code",null,"enableCompress?",-1),Ms=e("code",null,"boolean",-1),zs=e("code",null,"enableCors?",-1),Es=e("code",null,"boolean",-1),Us=e("code",null,"enableHealthz?",-1),Ws=e("code",null,"boolean",-1),js=e("code",null,"enableHelmet?",-1),qs=e("code",null,"boolean",-1),Xs=e("code",null,"fastify?",-1),Ys=e("code",null,"any",-1),Zs=e("code",null,"helmetOptions?",-1),$s=e("code",null,"host?",-1),Fs=e("code",null,"string",-1),Gs=e("code",null,"logLevel?",-1),Js=e("code",null,'"error"',-1),Ks=e("code",null,'"debug"',-1),Qs=e("code",null,'"fatal"',-1),et=e("code",null,'"warn"',-1),nt=e("code",null,'"info"',-1),st=e("code",null,'"trace"',-1),tt=e("code",null,"openApi?",-1),ot=e("code",null,"port",-1),at=e("code",null,"number",-1),it=e("code",null,"uploadDir?",-1),lt=e("code",null,"string",-1),ct=e("code",null,"HttpServerClass",-1),dt=e("code",null,"apiMountPath?",-1),rt=e("code",null,"string",-1),ut=e("code",null,"compressOptions?",-1),pt=e("code",null,"any",-1),_t=e("code",null,"cookieSecret?",-1),ht=e("code",null,"string",-1),vt=e("code",null,"corsOptions?",-1),mt=e("code",null,"any",-1),ft=e("code",null,"domain",-1),bt=e("code",null,"string",-1),kt=e("code",null,"enableCompress?",-1),gt=e("code",null,"boolean",-1),St=e("code",null,"enableCors?",-1),yt=e("code",null,"boolean",-1),wt=e("code",null,"enableHealthz?",-1),Ct=e("code",null,"boolean",-1),xt=e("code",null,"enableHelmet?",-1),Vt=e("code",null,"boolean",-1),Ot=e("code",null,"fastify?",-1),Ht=e("code",null,"any",-1),Pt=e("code",null,"helmetOptions?",-1),At=e("code",null,"host?",-1),Bt=e("code",null,"string",-1),Lt=e("code",null,"logLevel?",-1),Tt=e("code",null,'"error"',-1),It=e("code",null,'"debug"',-1),Dt=e("code",null,'"fatal"',-1),Nt=e("code",null,'"warn"',-1),Rt=e("code",null,'"info"',-1),Mt=e("code",null,'"trace"',-1),zt=e("code",null,"openApi?",-1),Et=e("code",null,"port",-1),Ut=e("code",null,"number",-1),Wt=e("code",null,"uploadDir?",-1),jt=e("code",null,"string",-1),qt=e("h4",{id:"defined-in-3",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#defined-in-3","aria-hidden":"true"},"#"),n(" Defined in")],-1),Xt={href:"https://github.com/sebastianwessel/purista/blob/8c66693/packages/httpserver/src/service/httpServer/v1/httpServerV1ServiceBuilder.ts#L18",target:"_blank",rel:"noopener noreferrer"},Yt=e("hr",null,null,-1),Zt=e("h3",{id:"puristaversion",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#puristaversion","aria-hidden":"true"},"#"),n(" puristaVersion")],-1),$t=e("p",null,[n("• "),e("code",null,"Const"),n(),e("strong",null,"puristaVersion"),n(": "),e("code",null,'"1.4.9"')],-1),Ft=e("h4",{id:"defined-in-4",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#defined-in-4","aria-hidden":"true"},"#"),n(" Defined in")],-1),Gt={href:"https://github.com/sebastianwessel/purista/blob/8c66693/packages/httpserver/src/version.ts#L1",target:"_blank",rel:"noopener noreferrer"};function Jt(Kt,Qt){const t=i("RouterLink"),a=i("ExternalLinkIcon");return c(),d("div",null,[e("p",null,[s(t,{to:"/api/"},{default:o(()=>[n("PURISTA API - v1.4.9")]),_:1}),n(" / "),s(t,{to:"/api/modules.html"},{default:o(()=>[n("Modules")]),_:1}),n(" / @purista/httpserver")]),p,_,h,e("p",null,[n("Under the hood, "),e("a",v,[n("fastify"),s(a)]),n(" is used as basement."),m,n(" Because of this, the whole "),e("a",f,[n("fastify ecosystem"),s(a)]),n(" can be used and integrated.")]),b,e("ul",null,[e("li",null,[s(t,{to:"/api/modules/purista_httpserver.internal.html"},{default:o(()=>[n("internal")]),_:1})])]),k,e("ul",null,[e("li",null,[s(t,{to:"/api/modules/purista_httpserver.html#httpserverv1servicecommandstorestapiinputpayload"},{default:o(()=>[n("HttpServerV1ServiceCommandsToRestApiInputPayload")]),_:1})])]),g,e("ul",null,[e("li",null,[s(t,{to:"/api/modules/purista_httpserver.html#httpserverserviceinfo"},{default:o(()=>[n("httpServerServiceInfo")]),_:1})]),e("li",null,[s(t,{to:"/api/modules/purista_httpserver.html#httpserverv1service"},{default:o(()=>[n("httpServerV1Service")]),_:1})]),e("li",null,[s(t,{to:"/api/modules/purista_httpserver.html#httpserverv1servicebuilder"},{default:o(()=>[n("httpServerV1ServiceBuilder")]),_:1})]),e("li",null,[s(t,{to:"/api/modules/purista_httpserver.html#puristaversion"},{default:o(()=>[n("puristaVersion")]),_:1})])]),S,y,e("p",null,[n("Ƭ "),w,n(": "),C,n("<typeof "),s(t,{to:"/api/modules/purista_httpserver.internal.html#httpserverv1servicecommandstorestapiinputpayloadschema"},{default:o(()=>[x]),_:1}),n(">")]),V,e("p",null,[e("a",O,[n("packages/httpserver/src/service/httpServer/v1/subscription/serviceCommandsToRestApi/types.ts:5"),s(a)])]),H,P,e("p",null,[n("• "),A,n(),B,n(": "),s(t,{to:"/api/modules/purista_httpserver.internal.html#serviceinfotype"},{default:o(()=>[L]),_:1})]),T,e("p",null,[e("a",I,[n("packages/httpserver/src/service/httpServer/v1/httpServerV1ServiceBuilder.ts:11"),s(a)])]),D,N,e("p",null,[n("• "),R,n(),M,n(": "),s(t,{to:"/api/classes/purista_httpserver.internal.ServiceBuilder.html"},{default:o(()=>[z]),_:1}),n("<{ "),E,n(": "),U,n(" ; "),W,n(": "),j,n(" ; "),q,n(": "),X,n(" ; "),Y,n(": "),Z,n(" ; "),$,n(": "),F,n(" ; "),G,n(": "),J,n(" ; "),K,n(": "),Q,n(" ; "),ee,n(": "),ne,n(" ; "),se,n(": "),te,n(" ; "),oe,n(": "),ae,n(" ; "),ie,n(": { enableCSPNonces?: boolean | undefined; global?: boolean | undefined; } ; "),le,n(": "),ce,n(" ; "),de,n(": "),re,n(" | "),ue,n(" | "),pe,n(" | "),_e,n(" | "),he,n(" | "),ve,n(" ; "),me,n(": { info: { title: string; version: string; description?: string | undefined; termsOfService?: string | undefined; contact?: { name?: string | undefined; url?: string | undefined; email?: string | undefined; } | undefined; license?: { ...; } | undefined; }; ... 6 more ...; tags?: { ...; }[] | undefined; } ; "),fe,n(": "),be,n(" ; "),ke,n(": "),ge,n(" }, { "),Se,n(": "),ye,n(" ; "),we,n(": "),Ce,n(" ; "),xe,n(": "),Ve,n(" ; "),Oe,n(": "),He,n(" ; "),Pe,n(": "),Ae,n(" ; "),Be,n(": "),Le,n(" ; "),Te,n(": "),Ie,n(" ; "),De,n(": "),Ne,n(" ; "),Re,n(": "),Me,n(" ; "),ze,n(": "),Ee,n(" ; "),Ue,n(": { enableCSPNonces?: boolean | undefined; global?: boolean | undefined; } ; "),We,n(": "),je,n(" ; "),qe,n(": "),Xe,n(" | "),Ye,n(" | "),Ze,n(" | "),$e,n(" | "),Fe,n(" | "),Ge,n(" ; "),Je,n(": { info: { title: string; version: string; description?: string | undefined; termsOfService?: string | undefined; contact?: { name?: string | undefined; url?: string | undefined; email?: string | undefined; } | undefined; license?: { ...; } | undefined; }; ... 6 more ...; tags?: { ...; }[] | undefined; } ; "),Ke,n(": "),Qe,n(" ; "),en,n(": "),nn,n(" }, "),s(t,{to:"/api/classes/purista_httpserver.internal.HttpServerClass.html"},{default:o(()=>[sn]),_:1}),n("<{ "),tn,n(": "),on,n(" ; "),an,n(": "),ln,n(" ; "),cn,n(": "),dn,n(" ; "),rn,n(": "),un,n(" ; "),pn,n(": "),_n,n(" ; "),hn,n(": "),vn,n(" ; "),mn,n(": "),fn,n(" ; "),bn,n(": "),kn,n(" ; "),gn,n(": "),Sn,n(" ; "),yn,n(": "),wn,n(" ; "),Cn,n(": { enableCSPNonces?: boolean | undefined; global?: boolean | undefined; } ; "),xn,n(": "),Vn,n(" ; "),On,n(": "),Hn,n(" | "),Pn,n(" | "),An,n(" | "),Bn,n(" | "),Ln,n(" | "),Tn,n(" ; "),In,n(": { info: { title: string; version: string; description?: string | undefined; termsOfService?: string | undefined; contact?: { name?: string | undefined; url?: string | undefined; email?: string | undefined; } | undefined; license?: { ...; } | undefined; }; ... 6 more ...; tags?: { ...; }[] | undefined; } ; "),Dn,n(": "),Nn,n(" ; "),Rn,n(": "),Mn,n(" }>>")]),zn,e("p",null,[e("a",En,[n("packages/httpserver/src/service/httpServer/v1/httpServerV1Service.ts:16"),s(a)])]),Un,Wn,e("p",null,[n("• "),jn,n(),qn,n(": "),s(t,{to:"/api/classes/purista_httpserver.internal.ServiceBuilder.html"},{default:o(()=>[Xn]),_:1}),n("<{ "),Yn,n(": "),Zn,n(" ; "),$n,n(": "),Fn,n(" ; "),Gn,n(": "),Jn,n(" ; "),Kn,n(": "),Qn,n(" ; "),es,n(": "),ns,n(" ; "),ss,n(": "),ts,n(" ; "),os,n(": "),as,n(" ; "),is,n(": "),ls,n(" ; "),cs,n(": "),ds,n(" ; "),rs,n(": "),us,n(" ; "),ps,n(": { enableCSPNonces?: boolean | undefined; global?: boolean | undefined; } ; "),_s,n(": "),hs,n(" ; "),vs,n(": "),ms,n(" | "),fs,n(" | "),bs,n(" | "),ks,n(" | "),gs,n(" | "),Ss,n(" ; "),ys,n(": { info: { title: string; version: string; description?: string | undefined; termsOfService?: string | undefined; contact?: { name?: string | undefined; url?: string | undefined; email?: string | undefined; } | undefined; license?: { ...; } | undefined; }; ... 6 more ...; tags?: { ...; }[] | undefined; } ; "),ws,n(": "),Cs,n(" ; "),xs,n(": "),Vs,n(" }, { "),Os,n(": "),Hs,n(" ; "),Ps,n(": "),As,n(" ; "),Bs,n(": "),Ls,n(" ; "),Ts,n(": "),Is,n(" ; "),Ds,n(": "),Ns,n(" ; "),Rs,n(": "),Ms,n(" ; "),zs,n(": "),Es,n(" ; "),Us,n(": "),Ws,n(" ; "),js,n(": "),qs,n(" ; "),Xs,n(": "),Ys,n(" ; "),Zs,n(": { enableCSPNonces?: boolean | undefined; global?: boolean | undefined; } ; "),$s,n(": "),Fs,n(" ; "),Gs,n(": "),Js,n(" | "),Ks,n(" | "),Qs,n(" | "),et,n(" | "),nt,n(" | "),st,n(" ; "),tt,n(": { info: { title: string; version: string; description?: string | undefined; termsOfService?: string | undefined; contact?: { name?: string | undefined; url?: string | undefined; email?: string | undefined; } | undefined; license?: { ...; } | undefined; }; ... 6 more ...; tags?: { ...; }[] | undefined; } ; "),ot,n(": "),at,n(" ; "),it,n(": "),lt,n(" }, "),s(t,{to:"/api/classes/purista_httpserver.internal.HttpServerClass.html"},{default:o(()=>[ct]),_:1}),n("<{ "),dt,n(": "),rt,n(" ; "),ut,n(": "),pt,n(" ; "),_t,n(": "),ht,n(" ; "),vt,n(": "),mt,n(" ; "),ft,n(": "),bt,n(" ; "),kt,n(": "),gt,n(" ; "),St,n(": "),yt,n(" ; "),wt,n(": "),Ct,n(" ; "),xt,n(": "),Vt,n(" ; "),Ot,n(": "),Ht,n(" ; "),Pt,n(": { enableCSPNonces?: boolean | undefined; global?: boolean | undefined; } ; "),At,n(": "),Bt,n(" ; "),Lt,n(": "),Tt,n(" | "),It,n(" | "),Dt,n(" | "),Nt,n(" | "),Rt,n(" | "),Mt,n(" ; "),zt,n(": { info: { title: string; version: string; description?: string | undefined; termsOfService?: string | undefined; contact?: { name?: string | undefined; url?: string | undefined; email?: string | undefined; } | undefined; license?: { ...; } | undefined; }; ... 6 more ...; tags?: { ...; }[] | undefined; } ; "),Et,n(": "),Ut,n(" ; "),Wt,n(": "),jt,n(" }>>")]),qt,e("p",null,[e("a",Xt,[n("packages/httpserver/src/service/httpServer/v1/httpServerV1ServiceBuilder.ts:18"),s(a)])]),Yt,Zt,$t,Ft,e("p",null,[e("a",Gt,[n("packages/httpserver/src/version.ts:1"),s(a)])])])}const no=l(u,[["render",Jt],["__file","purista_httpserver.html.vue"]]);export{no as default};