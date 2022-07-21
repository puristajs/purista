import{_ as c}from"./plugin-vue_export-helper.21dcd24c.js";import{r as d,o as a,c as l,b as e,e as s,w as n,d as t,a as r}from"./app.c31a4ec8.js";const h={},_=t("PURISTA API"),u=t(" / "),p=t("@purista/core"),f=t(" / Service"),m=e("h1",{id:"class-service",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#class-service","aria-hidden":"true"},"#"),t(" Class: Service")],-1),g=t("@purista/core"),b=t(".Service"),v=r(`<p>Base class for all services. This class provides base functions to work with the event bridge, logging and so on</p><p>Every service should extend this class and should not directly access the eventbridge or other service</p><div class="language-typescript ext-ts line-numbers-mode"><pre class="language-typescript"><code><span class="token keyword">class</span> <span class="token class-name">MyService</span> <span class="token keyword">extends</span> <span class="token class-name">Service</span> <span class="token punctuation">{</span>

  <span class="token function">constructor</span><span class="token punctuation">(</span>baseLogger<span class="token operator">:</span> Logger<span class="token punctuation">,</span> info<span class="token operator">:</span> ServiceInfoType<span class="token punctuation">,</span> eventBridge<span class="token operator">:</span> EventBridge<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">super</span><span class="token punctuation">(</span> baseLogger<span class="token punctuation">,</span> info<span class="token punctuation">,</span> eventBridge <span class="token punctuation">)</span>
    <span class="token comment">// ... initial service logic</span>
  <span class="token punctuation">}</span>
  <span class="token comment">// ... service methods, functions and logic</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="hierarchy" tabindex="-1"><a class="header-anchor" href="#hierarchy" aria-hidden="true">#</a> Hierarchy</h2>`,4),x=e("code",null,"ServiceClass",-1),S=e("p",null,[t("\u21B3 "),e("strong",null,[e("code",null,"Service")])],-1),y=t("\u21B3\u21B3 "),k=e("code",null,"HttpServerService",-1),w=e("h2",{id:"table-of-contents",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#table-of-contents","aria-hidden":"true"},"#"),t(" Table of contents")],-1),C=e("h3",{id:"constructors",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#constructors","aria-hidden":"true"},"#"),t(" Constructors")],-1),P=t("constructor"),I=e("h3",{id:"properties",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#properties","aria-hidden":"true"},"#"),t(" Properties")],-1),L=t("commands"),D=t("eventBridge"),T=t("info"),R=t("mainSubscriptionId"),B=t("pendingInvocations"),M=t("serviceLogger"),E=t("subscriptions"),N=e("h3",{id:"accessors",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#accessors","aria-hidden":"true"},"#"),t(" Accessors")],-1),q=t("serviceInfo"),O=e("h3",{id:"methods",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#methods","aria-hidden":"true"},"#"),t(" Methods")],-1),z=t("defaultMessageHandler"),H=t("destroy"),A=t("executeCommand"),F=t("handleSubscriptionMessage"),V=t("initializeEventbridgeConnect"),G=t("invoke"),U=t("registerCommand"),j=t("sendServiceInfo"),J=t("start"),K=t("subscribe"),Q=r('<h2 id="constructors-1" tabindex="-1"><a class="header-anchor" href="#constructors-1" aria-hidden="true">#</a> Constructors</h2><h3 id="constructor" tabindex="-1"><a class="header-anchor" href="#constructor" aria-hidden="true">#</a> constructor</h3><p>\u2022 <strong>new Service</strong>(<code>baseLogger</code>, <code>info</code>, <code>eventBridge</code>, <code>commandFunctions</code>, <code>subscriptionList</code>)</p><h4 id="parameters" tabindex="-1"><a class="header-anchor" href="#parameters" aria-hidden="true">#</a> Parameters</h4>',4),W=e("thead",null,[e("tr",null,[e("th",{style:{"text-align":"left"}},"Name"),e("th",{style:{"text-align":"left"}},"Type")])],-1),X=e("td",{style:{"text-align":"left"}},[e("code",null,"baseLogger")],-1),Y={style:{"text-align":"left"}},Z=e("code",null,"Logger",-1),$=e("td",{style:{"text-align":"left"}},[e("code",null,"info")],-1),ee={style:{"text-align":"left"}},te=e("code",null,"ServiceInfoType",-1),se=e("td",{style:{"text-align":"left"}},[e("code",null,"eventBridge")],-1),oe={style:{"text-align":"left"}},ne=e("code",null,"EventBridge",-1),ie=e("td",{style:{"text-align":"left"}},[e("code",null,"commandFunctions")],-1),re={style:{"text-align":"left"}},de=e("code",null,"CommandDefinition",-1),ce=t("<"),ae=e("code",null,"Record",-1),le=t("<"),he=e("code",null,"string",-1),_e=t(", "),ue=e("code",null,"unknown",-1),pe=t(">, "),fe=e("code",null,"Service",-1),me=t(", "),ge=e("code",null,"unknown",-1),be=t(", "),ve=e("code",null,"Record",-1),xe=t("<"),Se=e("code",null,"string",-1),ye=t(", "),ke=e("code",null,"unknown",-1),we=t(">, "),Ce=e("code",null,"unknown",-1),Pe=t(">[]"),Ie=e("td",{style:{"text-align":"left"}},[e("code",null,"subscriptionList")],-1),Le={style:{"text-align":"left"}},De=e("code",null,"SubscriptionDefinition",-1),Te=t("<"),Re=e("code",null,"EBMessage",-1),Be=t(">[]"),Me=e("h4",{id:"overrides",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#overrides","aria-hidden":"true"},"#"),t(" Overrides")],-1),Ee=t("ServiceClass"),Ne=t("."),qe=t("constructor"),Oe=e("h4",{id:"defined-in",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#defined-in","aria-hidden":"true"},"#"),t(" Defined in")],-1),ze={href:"https://github.com/sebastianwessel/purista/blob/17388e9/packages/core/src/core/Service/Service.impl.ts#L73",target:"_blank",rel:"noopener noreferrer"},He=t("core/src/core/Service/Service.impl.ts:73"),Ae=e("h2",{id:"properties-1",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#properties-1","aria-hidden":"true"},"#"),t(" Properties")],-1),Fe=e("h3",{id:"commands",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#commands","aria-hidden":"true"},"#"),t(" commands")],-1),Ve=t("\u2022 "),Ge=e("code",null,"Protected",-1),Ue=t(),je=e("strong",null,"commands",-1),Je=t(": "),Ke=e("code",null,"Map",-1),Qe=t("<"),We=e("code",null,"string",-1),Xe=t(", "),Ye=e("code",null,"CommandDefinition",-1),Ze=t("<"),$e=e("code",null,"Record",-1),et=t("<"),tt=e("code",null,"string",-1),st=t(", "),ot=e("code",null,"unknown",-1),nt=t(">, "),it=e("code",null,"Service",-1),rt=t(", "),dt=e("code",null,"unknown",-1),ct=t(", "),at=e("code",null,"Record",-1),lt=t("<"),ht=e("code",null,"string",-1),_t=t(", "),ut=e("code",null,"unknown",-1),pt=t(">, "),ft=e("code",null,"unknown",-1),mt=t(">>"),gt=e("h4",{id:"defined-in-1",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#defined-in-1","aria-hidden":"true"},"#"),t(" Defined in")],-1),bt={href:"https://github.com/sebastianwessel/purista/blob/17388e9/packages/core/src/core/Service/Service.impl.ts#L69",target:"_blank",rel:"noopener noreferrer"},vt=t("core/src/core/Service/Service.impl.ts:69"),xt=e("hr",null,null,-1),St=e("h3",{id:"eventbridge",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#eventbridge","aria-hidden":"true"},"#"),t(" eventBridge")],-1),yt=t("\u2022 "),kt=e("code",null,"Protected",-1),wt=t(),Ct=e("strong",null,"eventBridge",-1),Pt=t(": "),It=e("code",null,"EventBridge",-1),Lt=e("p",null,"The event bridge instance",-1),Dt=e("h4",{id:"overrides-1",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#overrides-1","aria-hidden":"true"},"#"),t(" Overrides")],-1),Tt=t("ServiceClass"),Rt=t("."),Bt=t("eventBridge"),Mt=e("h4",{id:"defined-in-2",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#defined-in-2","aria-hidden":"true"},"#"),t(" Defined in")],-1),Et={href:"https://github.com/sebastianwessel/purista/blob/17388e9/packages/core/src/core/Service/Service.impl.ts#L63",target:"_blank",rel:"noopener noreferrer"},Nt=t("core/src/core/Service/Service.impl.ts:63"),qt=e("hr",null,null,-1),Ot=e("h3",{id:"info",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#info","aria-hidden":"true"},"#"),t(" info")],-1),zt=t("\u2022 "),Ht=e("strong",null,"info",-1),At=t(": "),Ft=e("code",null,"ServiceInfoType",-1),Vt=e("p",null,"General service info Service name, service version and some human readable description",-1),Gt=e("h4",{id:"overrides-2",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#overrides-2","aria-hidden":"true"},"#"),t(" Overrides")],-1),Ut=t("ServiceClass"),jt=t("."),Jt=t("info"),Kt=e("h4",{id:"defined-in-3",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#defined-in-3","aria-hidden":"true"},"#"),t(" Defined in")],-1),Qt={href:"https://github.com/sebastianwessel/purista/blob/17388e9/packages/core/src/core/Service/Service.impl.ts#L60",target:"_blank",rel:"noopener noreferrer"},Wt=t("core/src/core/Service/Service.impl.ts:60"),Xt=r('<hr><h3 id="mainsubscriptionid" tabindex="-1"><a class="header-anchor" href="#mainsubscriptionid" aria-hidden="true">#</a> mainSubscriptionId</h3><p>\u2022 <code>Protected</code> <strong>mainSubscriptionId</strong>: <code>undefined</code> | <code>string</code></p><h4 id="defined-in-4" tabindex="-1"><a class="header-anchor" href="#defined-in-4" aria-hidden="true">#</a> Defined in</h4>',4),Yt={href:"https://github.com/sebastianwessel/purista/blob/17388e9/packages/core/src/core/Service/Service.impl.ts#L71",target:"_blank",rel:"noopener noreferrer"},Zt=t("core/src/core/Service/Service.impl.ts:71"),$t=e("hr",null,null,-1),es=e("h3",{id:"pendinginvocations",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#pendinginvocations","aria-hidden":"true"},"#"),t(" pendingInvocations")],-1),ts=t("\u2022 "),ss=e("code",null,"Protected",-1),os=t(),ns=e("strong",null,"pendingInvocations",-1),is=t(": "),rs=e("code",null,"Map",-1),ds=t("<"),cs=e("code",null,"string",-1),as=t(", "),ls=e("code",null,"PendigInvocation",-1),hs=t(">"),_s=e("h4",{id:"defined-in-5",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#defined-in-5","aria-hidden":"true"},"#"),t(" Defined in")],-1),us={href:"https://github.com/sebastianwessel/purista/blob/17388e9/packages/core/src/core/Service/Service.impl.ts#L65",target:"_blank",rel:"noopener noreferrer"},ps=t("core/src/core/Service/Service.impl.ts:65"),fs=e("hr",null,null,-1),ms=e("h3",{id:"servicelogger",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#servicelogger","aria-hidden":"true"},"#"),t(" serviceLogger")],-1),gs=t("\u2022 "),bs=e("code",null,"Protected",-1),vs=t(),xs=e("strong",null,"serviceLogger",-1),Ss=t(": "),ys=e("code",null,"Logger",-1),ks=e("h4",{id:"defined-in-6",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#defined-in-6","aria-hidden":"true"},"#"),t(" Defined in")],-1),ws={href:"https://github.com/sebastianwessel/purista/blob/17388e9/packages/core/src/core/Service/Service.impl.ts#L61",target:"_blank",rel:"noopener noreferrer"},Cs=t("core/src/core/Service/Service.impl.ts:61"),Ps=e("hr",null,null,-1),Is=e("h3",{id:"subscriptions",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#subscriptions","aria-hidden":"true"},"#"),t(" subscriptions")],-1),Ls=t("\u2022 "),Ds=e("code",null,"Protected",-1),Ts=t(),Rs=e("strong",null,"subscriptions",-1),Bs=t(": "),Ms=e("code",null,"Map",-1),Es=t("<"),Ns=e("code",null,"string",-1),qs=t(", "),Os=e("code",null,"SubscriptionDefinition",-1),zs=t("<"),Hs=e("code",null,"EBMessage",-1),As=t(">>"),Fs=e("h4",{id:"defined-in-7",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#defined-in-7","aria-hidden":"true"},"#"),t(" Defined in")],-1),Vs={href:"https://github.com/sebastianwessel/purista/blob/17388e9/packages/core/src/core/Service/Service.impl.ts#L67",target:"_blank",rel:"noopener noreferrer"},Gs=t("core/src/core/Service/Service.impl.ts:67"),Us=e("h2",{id:"accessors-1",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#accessors-1","aria-hidden":"true"},"#"),t(" Accessors")],-1),js=e("h3",{id:"serviceinfo",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#serviceinfo","aria-hidden":"true"},"#"),t(" serviceInfo")],-1),Js=t("\u2022 "),Ks=e("code",null,"get",-1),Qs=t(),Ws=e("strong",null,"serviceInfo",-1),Xs=t("(): "),Ys=e("code",null,"ServiceInfoType",-1),Zs=e("p",null,"Get service info",-1),$s=e("h4",{id:"returns",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#returns","aria-hidden":"true"},"#"),t(" Returns")],-1),eo=e("code",null,"ServiceInfoType",-1),to=e("h4",{id:"inherited-from",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#inherited-from","aria-hidden":"true"},"#"),t(" Inherited from")],-1),so=e("p",null,"ServiceClass.serviceInfo",-1),oo=e("h4",{id:"defined-in-8",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#defined-in-8","aria-hidden":"true"},"#"),t(" Defined in")],-1),no={href:"https://github.com/sebastianwessel/purista/blob/17388e9/packages/core/src/core/types/ServiceClass.ts#L32",target:"_blank",rel:"noopener noreferrer"},io=t("core/src/core/types/ServiceClass.ts:32"),ro=r('<h2 id="methods-1" tabindex="-1"><a class="header-anchor" href="#methods-1" aria-hidden="true">#</a> Methods</h2><h3 id="defaultmessagehandler" tabindex="-1"><a class="header-anchor" href="#defaultmessagehandler" aria-hidden="true">#</a> defaultMessageHandler</h3><p>\u25B8 <code>Protected</code> <strong>defaultMessageHandler</strong>(<code>subscriptionId</code>, <code>message</code>): <code>Promise</code>&lt;<code>void</code>&gt;</p><p>There is one subscription with a specific id which set during init. This subscriptions handles all incoming commands and invoke responses.</p><p>If the handler receives a message for a subscription with different id, the message relates to a regular subscription (passiv listener)</p><h4 id="parameters-1" tabindex="-1"><a class="header-anchor" href="#parameters-1" aria-hidden="true">#</a> Parameters</h4>',6),co=e("thead",null,[e("tr",null,[e("th",{style:{"text-align":"left"}},"Name"),e("th",{style:{"text-align":"left"}},"Type"),e("th",{style:{"text-align":"left"}},"Description")])],-1),ao=e("tr",null,[e("td",{style:{"text-align":"left"}},[e("code",null,"subscriptionId")]),e("td",{style:{"text-align":"left"}},[e("code",null,"string")]),e("td",{style:{"text-align":"left"}},"id of subscription")],-1),lo=e("td",{style:{"text-align":"left"}},[e("code",null,"message")],-1),ho={style:{"text-align":"left"}},_o=e("code",null,"EBMessage",-1),uo=e("td",{style:{"text-align":"left"}},"event bridge message",-1),po=e("h4",{id:"returns-1",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#returns-1","aria-hidden":"true"},"#"),t(" Returns")],-1),fo=e("p",null,[e("code",null,"Promise"),t("<"),e("code",null,"void"),t(">")],-1),mo=e("h4",{id:"defined-in-9",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#defined-in-9","aria-hidden":"true"},"#"),t(" Defined in")],-1),go={href:"https://github.com/sebastianwessel/purista/blob/17388e9/packages/core/src/core/Service/Service.impl.ts#L164",target:"_blank",rel:"noopener noreferrer"},bo=t("core/src/core/Service/Service.impl.ts:164"),vo=r('<hr><h3 id="destroy" tabindex="-1"><a class="header-anchor" href="#destroy" aria-hidden="true">#</a> destroy</h3><p>\u25B8 <strong>destroy</strong>(): <code>Promise</code>&lt;<code>void</code>&gt;</p><p>Shut down the service</p><h4 id="returns-2" tabindex="-1"><a class="header-anchor" href="#returns-2" aria-hidden="true">#</a> Returns</h4><p><code>Promise</code>&lt;<code>void</code>&gt;</p><h4 id="overrides-3" tabindex="-1"><a class="header-anchor" href="#overrides-3" aria-hidden="true">#</a> Overrides</h4>',7),xo=t("ServiceClass"),So=t("."),yo=t("destroy"),ko=e("h4",{id:"defined-in-10",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#defined-in-10","aria-hidden":"true"},"#"),t(" Defined in")],-1),wo={href:"https://github.com/sebastianwessel/purista/blob/17388e9/packages/core/src/core/Service/Service.impl.ts#L389",target:"_blank",rel:"noopener noreferrer"},Co=t("core/src/core/Service/Service.impl.ts:389"),Po=r('<hr><h3 id="executecommand" tabindex="-1"><a class="header-anchor" href="#executecommand" aria-hidden="true">#</a> executeCommand</h3><p>\u25B8 <code>Protected</code> <strong>executeCommand</strong>(<code>_subscriptionId</code>, <code>message</code>): <code>Promise</code>&lt;<code>void</code>&gt;</p><p>Called when a command is received by the service</p><h4 id="parameters-2" tabindex="-1"><a class="header-anchor" href="#parameters-2" aria-hidden="true">#</a> Parameters</h4>',5),Io=e("thead",null,[e("tr",null,[e("th",{style:{"text-align":"left"}},"Name"),e("th",{style:{"text-align":"left"}},"Type")])],-1),Lo=e("tr",null,[e("td",{style:{"text-align":"left"}},[e("code",null,"_subscriptionId")]),e("td",{style:{"text-align":"left"}},[e("code",null,"string")])],-1),Do=e("td",{style:{"text-align":"left"}},[e("code",null,"message")],-1),To={style:{"text-align":"left"}},Ro=e("code",null,"Command",-1),Bo=t("<"),Mo=e("code",null,"unknown",-1),Eo=t(", "),No=e("code",null,"Record",-1),qo=t("<"),Oo=e("code",null,"string",-1),zo=t(", "),Ho=e("code",null,"unknown",-1),Ao=t(">>"),Fo=e("h4",{id:"returns-3",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#returns-3","aria-hidden":"true"},"#"),t(" Returns")],-1),Vo=e("p",null,[e("code",null,"Promise"),t("<"),e("code",null,"void"),t(">")],-1),Go=e("h4",{id:"defined-in-11",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#defined-in-11","aria-hidden":"true"},"#"),t(" Defined in")],-1),Uo={href:"https://github.com/sebastianwessel/purista/blob/17388e9/packages/core/src/core/Service/Service.impl.ts#L281",target:"_blank",rel:"noopener noreferrer"},jo=t("core/src/core/Service/Service.impl.ts:281"),Jo=r('<hr><h3 id="handlesubscriptionmessage" tabindex="-1"><a class="header-anchor" href="#handlesubscriptionmessage" aria-hidden="true">#</a> handleSubscriptionMessage</h3><p>\u25B8 <code>Protected</code> <strong>handleSubscriptionMessage</strong>(<code>subscriptionId</code>, <code>message</code>): <code>Promise</code>&lt;<code>void</code>&gt;</p><h4 id="parameters-3" tabindex="-1"><a class="header-anchor" href="#parameters-3" aria-hidden="true">#</a> Parameters</h4>',4),Ko=e("thead",null,[e("tr",null,[e("th",{style:{"text-align":"left"}},"Name"),e("th",{style:{"text-align":"left"}},"Type")])],-1),Qo=e("tr",null,[e("td",{style:{"text-align":"left"}},[e("code",null,"subscriptionId")]),e("td",{style:{"text-align":"left"}},[e("code",null,"string")])],-1),Wo=e("td",{style:{"text-align":"left"}},[e("code",null,"message")],-1),Xo={style:{"text-align":"left"}},Yo=e("code",null,"EBMessage",-1),Zo=e("h4",{id:"returns-4",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#returns-4","aria-hidden":"true"},"#"),t(" Returns")],-1),$o=e("p",null,[e("code",null,"Promise"),t("<"),e("code",null,"void"),t(">")],-1),en=e("h4",{id:"defined-in-12",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#defined-in-12","aria-hidden":"true"},"#"),t(" Defined in")],-1),tn={href:"https://github.com/sebastianwessel/purista/blob/17388e9/packages/core/src/core/Service/Service.impl.ts#L337",target:"_blank",rel:"noopener noreferrer"},sn=t("core/src/core/Service/Service.impl.ts:337"),on=r('<hr><h3 id="initializeeventbridgeconnect" tabindex="-1"><a class="header-anchor" href="#initializeeventbridgeconnect" aria-hidden="true">#</a> initializeEventbridgeConnect</h3><p>\u25B8 <code>Protected</code> <strong>initializeEventbridgeConnect</strong>(<code>commandFunctions</code>, <code>subscriptions</code>): <code>Promise</code>&lt;<code>void</code>&gt;</p><p>Connect service to event bridge to receive commands and command responses</p><h4 id="parameters-4" tabindex="-1"><a class="header-anchor" href="#parameters-4" aria-hidden="true">#</a> Parameters</h4>',5),nn=e("thead",null,[e("tr",null,[e("th",{style:{"text-align":"left"}},"Name"),e("th",{style:{"text-align":"left"}},"Type")])],-1),rn=e("td",{style:{"text-align":"left"}},[e("code",null,"commandFunctions")],-1),dn={style:{"text-align":"left"}},cn=e("code",null,"CommandDefinition",-1),an=t("<"),ln=e("code",null,"Record",-1),hn=t("<"),_n=e("code",null,"string",-1),un=t(", "),pn=e("code",null,"unknown",-1),fn=t(">, "),mn=e("code",null,"Service",-1),gn=t(", "),bn=e("code",null,"unknown",-1),vn=t(", "),xn=e("code",null,"Record",-1),Sn=t("<"),yn=e("code",null,"string",-1),kn=t(", "),wn=e("code",null,"unknown",-1),Cn=t(">, "),Pn=e("code",null,"unknown",-1),In=t(">[]"),Ln=e("td",{style:{"text-align":"left"}},[e("code",null,"subscriptions")],-1),Dn={style:{"text-align":"left"}},Tn=e("code",null,"SubscriptionDefinition",-1),Rn=t("<"),Bn=e("code",null,"EBMessage",-1),Mn=t(">[]"),En=e("h4",{id:"returns-5",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#returns-5","aria-hidden":"true"},"#"),t(" Returns")],-1),Nn=e("p",null,[e("code",null,"Promise"),t("<"),e("code",null,"void"),t(">")],-1),qn=e("h4",{id:"defined-in-13",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#defined-in-13","aria-hidden":"true"},"#"),t(" Defined in")],-1),On={href:"https://github.com/sebastianwessel/purista/blob/17388e9/packages/core/src/core/Service/Service.impl.ts#L108",target:"_blank",rel:"noopener noreferrer"},zn=t("core/src/core/Service/Service.impl.ts:108"),Hn=r('<hr><h3 id="invoke" tabindex="-1"><a class="header-anchor" href="#invoke" aria-hidden="true">#</a> invoke</h3><p>\u25B8 <strong>invoke</strong>&lt;<code>T</code>&gt;(<code>input</code>, <code>ttl?</code>, <code>originalCommand?</code>): <code>Promise</code>&lt;<code>T</code>&gt;</p><p>Invoke a service over event bridge and expect some result from called service Used for service(-function) to service(-function) communication</p><h4 id="type-parameters" tabindex="-1"><a class="header-anchor" href="#type-parameters" aria-hidden="true">#</a> Type parameters</h4><table><thead><tr><th style="text-align:left;">Name</th></tr></thead><tbody><tr><td style="text-align:left;"><code>T</code></td></tr></tbody></table><h4 id="parameters-5" tabindex="-1"><a class="header-anchor" href="#parameters-5" aria-hidden="true">#</a> Parameters</h4>',7),An=e("thead",null,[e("tr",null,[e("th",{style:{"text-align":"left"}},"Name"),e("th",{style:{"text-align":"left"}},"Type")])],-1),Fn=e("td",{style:{"text-align":"left"}},[e("code",null,"input")],-1),Vn={style:{"text-align":"left"}},Gn=e("code",null,"Omit",-1),Un=t("<"),jn=e("code",null,"Command",-1),Jn=r("&lt;<code>unknown</code>, <code>Record</code>&lt;<code>string</code>, <code>unknown</code>&gt;&gt;, <code>&quot;id&quot;</code> | <code>&quot;messageType&quot;</code> | <code>&quot;sender&quot;</code> | <code>&quot;timestamp&quot;</code> | <code>&quot;correlationId&quot;</code>&gt;",19),Kn=e("tr",null,[e("td",{style:{"text-align":"left"}},[e("code",null,"ttl")]),e("td",{style:{"text-align":"left"}},[e("code",null,"number")])],-1),Qn=e("td",{style:{"text-align":"left"}},[e("code",null,"originalCommand?")],-1),Wn={style:{"text-align":"left"}},Xn=e("code",null,"Partial",-1),Yn=t("<"),Zn=e("code",null,"Command",-1),$n=t("<"),ei=e("code",null,"unknown",-1),ti=t(", "),si=e("code",null,"Record",-1),oi=t("<"),ni=e("code",null,"string",-1),ii=t(", "),ri=e("code",null,"unknown",-1),di=t(">>>"),ci=e("h4",{id:"returns-6",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#returns-6","aria-hidden":"true"},"#"),t(" Returns")],-1),ai=e("p",null,[e("code",null,"Promise"),t("<"),e("code",null,"T"),t(">")],-1),li=e("h4",{id:"overrides-4",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#overrides-4","aria-hidden":"true"},"#"),t(" Overrides")],-1),hi=t("ServiceClass"),_i=t("."),ui=t("invoke"),pi=e("h4",{id:"defined-in-14",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#defined-in-14","aria-hidden":"true"},"#"),t(" Defined in")],-1),fi={href:"https://github.com/sebastianwessel/purista/blob/17388e9/packages/core/src/core/Service/Service.impl.ts#L195",target:"_blank",rel:"noopener noreferrer"},mi=t("core/src/core/Service/Service.impl.ts:195"),gi=r('<hr><h3 id="registercommand" tabindex="-1"><a class="header-anchor" href="#registercommand" aria-hidden="true">#</a> registerCommand</h3><p>\u25B8 <code>Protected</code> <strong>registerCommand</strong>(<code>commandDefinition</code>): <code>Promise</code>&lt;<code>void</code>&gt;</p><p>Register a new command (function) for this service</p><h4 id="parameters-6" tabindex="-1"><a class="header-anchor" href="#parameters-6" aria-hidden="true">#</a> Parameters</h4>',5),bi=e("thead",null,[e("tr",null,[e("th",{style:{"text-align":"left"}},"Name"),e("th",{style:{"text-align":"left"}},"Type")])],-1),vi=e("td",{style:{"text-align":"left"}},[e("code",null,"commandDefinition")],-1),xi={style:{"text-align":"left"}},Si=e("code",null,"CommandDefinition",-1),yi=t("<"),ki=e("code",null,"Record",-1),wi=t("<"),Ci=e("code",null,"string",-1),Pi=t(", "),Ii=e("code",null,"unknown",-1),Li=t(">, "),Di=e("code",null,"Service",-1),Ti=t(", "),Ri=e("code",null,"unknown",-1),Bi=t(", "),Mi=e("code",null,"Record",-1),Ei=t("<"),Ni=e("code",null,"string",-1),qi=t(", "),Oi=e("code",null,"unknown",-1),zi=t(">, "),Hi=e("code",null,"unknown",-1),Ai=t(">"),Fi=e("h4",{id:"returns-7",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#returns-7","aria-hidden":"true"},"#"),t(" Returns")],-1),Vi=e("p",null,[e("code",null,"Promise"),t("<"),e("code",null,"void"),t(">")],-1),Gi=e("h4",{id:"overrides-5",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#overrides-5","aria-hidden":"true"},"#"),t(" Overrides")],-1),Ui=t("ServiceClass"),ji=t("."),Ji=t("registerCommand"),Ki=e("h4",{id:"defined-in-15",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#defined-in-15","aria-hidden":"true"},"#"),t(" Defined in")],-1),Qi={href:"https://github.com/sebastianwessel/purista/blob/17388e9/packages/core/src/core/Service/Service.impl.ts#L376",target:"_blank",rel:"noopener noreferrer"},Wi=t("core/src/core/Service/Service.impl.ts:376"),Xi=r('<hr><h3 id="sendserviceinfo" tabindex="-1"><a class="header-anchor" href="#sendserviceinfo" aria-hidden="true">#</a> sendServiceInfo</h3><p>\u25B8 <strong>sendServiceInfo</strong>(<code>infoType</code>, <code>target?</code>, <code>data?</code>): <code>Promise</code>&lt;<code>void</code>&gt;</p><p>Broadcast service info message</p><h4 id="parameters-7" tabindex="-1"><a class="header-anchor" href="#parameters-7" aria-hidden="true">#</a> Parameters</h4>',5),Yi=e("thead",null,[e("tr",null,[e("th",{style:{"text-align":"left"}},"Name"),e("th",{style:{"text-align":"left"}},"Type"),e("th",{style:{"text-align":"left"}},"Description")])],-1),Zi=e("td",{style:{"text-align":"left"}},[e("code",null,"infoType")],-1),$i={style:{"text-align":"left"}},er=e("code",null,"InfoMessageType",-1),tr=e("td",{style:{"text-align":"left"}},"type of info message",-1),sr=e("tr",null,[e("td",{style:{"text-align":"left"}},[e("code",null,"target?")]),e("td",{style:{"text-align":"left"}},[e("code",null,"string")]),e("td",{style:{"text-align":"left"}},"function name is need in messages like InfoServiceFunctionAdded")],-1),or=e("tr",null,[e("td",{style:{"text-align":"left"}},[e("code",null,"data?")]),e("td",{style:{"text-align":"left"}},[e("code",null,"Record"),t("<"),e("code",null,"string"),t(", "),e("code",null,"unknown"),t(">")]),e("td",{style:{"text-align":"left"}},"-")],-1),nr=e("h4",{id:"returns-8",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#returns-8","aria-hidden":"true"},"#"),t(" Returns")],-1),ir=e("p",null,[e("code",null,"Promise"),t("<"),e("code",null,"void"),t(">")],-1),rr=e("h4",{id:"defined-in-16",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#defined-in-16","aria-hidden":"true"},"#"),t(" Defined in")],-1),dr={href:"https://github.com/sebastianwessel/purista/blob/17388e9/packages/core/src/core/Service/Service.impl.ts#L148",target:"_blank",rel:"noopener noreferrer"},cr=t("core/src/core/Service/Service.impl.ts:148"),ar=r('<hr><h3 id="start" tabindex="-1"><a class="header-anchor" href="#start" aria-hidden="true">#</a> start</h3><p>\u25B8 <strong>start</strong>(): <code>Promise</code>&lt;<code>void</code>&gt;</p><p>It connects to the event bridge and subscribes to the topics that are in the subscription list.</p><h4 id="returns-9" tabindex="-1"><a class="header-anchor" href="#returns-9" aria-hidden="true">#</a> Returns</h4><p><code>Promise</code>&lt;<code>void</code>&gt;</p><h4 id="defined-in-17" tabindex="-1"><a class="header-anchor" href="#defined-in-17" aria-hidden="true">#</a> Defined in</h4>',7),lr={href:"https://github.com/sebastianwessel/purista/blob/17388e9/packages/core/src/core/Service/Service.impl.ts#L95",target:"_blank",rel:"noopener noreferrer"},hr=t("core/src/core/Service/Service.impl.ts:95"),_r=r('<hr><h3 id="subscribe" tabindex="-1"><a class="header-anchor" href="#subscribe" aria-hidden="true">#</a> subscribe</h3><p>\u25B8 <code>Protected</code> <strong>subscribe</strong>(<code>subscription</code>): <code>Promise</code>&lt;<code>string</code>&gt;</p><p>Send subscription request to event bridge Creates a new subscription</p><h4 id="parameters-8" tabindex="-1"><a class="header-anchor" href="#parameters-8" aria-hidden="true">#</a> Parameters</h4>',5),ur=e("thead",null,[e("tr",null,[e("th",{style:{"text-align":"left"}},"Name"),e("th",{style:{"text-align":"left"}},"Type")])],-1),pr=e("td",{style:{"text-align":"left"}},[e("code",null,"subscription")],-1),fr={style:{"text-align":"left"}},mr=e("code",null,"SubscriptionDefinition",-1),gr=t("<"),br=e("code",null,"EBMessage",-1),vr=t(">"),xr=e("h4",{id:"returns-10",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#returns-10","aria-hidden":"true"},"#"),t(" Returns")],-1),Sr=e("p",null,[e("code",null,"Promise"),t("<"),e("code",null,"string"),t(">")],-1),yr=e("h4",{id:"overrides-6",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#overrides-6","aria-hidden":"true"},"#"),t(" Overrides")],-1),kr=t("ServiceClass"),wr=t("."),Cr=t("subscribe"),Pr=e("h4",{id:"defined-in-18",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#defined-in-18","aria-hidden":"true"},"#"),t(" Defined in")],-1),Ir={href:"https://github.com/sebastianwessel/purista/blob/17388e9/packages/core/src/core/Service/Service.impl.ts#L258",target:"_blank",rel:"noopener noreferrer"},Lr=t("core/src/core/Service/Service.impl.ts:258");function Dr(Tr,Rr){const o=d("RouterLink"),i=d("ExternalLinkIcon");return a(),l("div",null,[e("p",null,[s(o,{to:"/api/"},{default:n(()=>[_]),_:1}),u,s(o,{to:"/api/modules/purista_core.html"},{default:n(()=>[p]),_:1}),f]),m,e("p",null,[s(o,{to:"/api/modules/purista_core.html"},{default:n(()=>[g]),_:1}),b]),v,e("ul",null,[e("li",null,[e("p",null,[s(o,{to:"/api/classes/purista_core.ServiceClass.html"},{default:n(()=>[x]),_:1})]),S,e("p",null,[y,s(o,{to:"/api/classes/purista_core.HttpServerService.html"},{default:n(()=>[k]),_:1})])])]),w,C,e("ul",null,[e("li",null,[s(o,{to:"/api/classes/purista_core.Service.html#constructor"},{default:n(()=>[P]),_:1})])]),I,e("ul",null,[e("li",null,[s(o,{to:"/api/classes/purista_core.Service.html#commands"},{default:n(()=>[L]),_:1})]),e("li",null,[s(o,{to:"/api/classes/purista_core.Service.html#eventbridge"},{default:n(()=>[D]),_:1})]),e("li",null,[s(o,{to:"/api/classes/purista_core.Service.html#info"},{default:n(()=>[T]),_:1})]),e("li",null,[s(o,{to:"/api/classes/purista_core.Service.html#mainsubscriptionid"},{default:n(()=>[R]),_:1})]),e("li",null,[s(o,{to:"/api/classes/purista_core.Service.html#pendinginvocations"},{default:n(()=>[B]),_:1})]),e("li",null,[s(o,{to:"/api/classes/purista_core.Service.html#servicelogger"},{default:n(()=>[M]),_:1})]),e("li",null,[s(o,{to:"/api/classes/purista_core.Service.html#subscriptions"},{default:n(()=>[E]),_:1})])]),N,e("ul",null,[e("li",null,[s(o,{to:"/api/classes/purista_core.Service.html#serviceinfo"},{default:n(()=>[q]),_:1})])]),O,e("ul",null,[e("li",null,[s(o,{to:"/api/classes/purista_core.Service.html#defaultmessagehandler"},{default:n(()=>[z]),_:1})]),e("li",null,[s(o,{to:"/api/classes/purista_core.Service.html#destroy"},{default:n(()=>[H]),_:1})]),e("li",null,[s(o,{to:"/api/classes/purista_core.Service.html#executecommand"},{default:n(()=>[A]),_:1})]),e("li",null,[s(o,{to:"/api/classes/purista_core.Service.html#handlesubscriptionmessage"},{default:n(()=>[F]),_:1})]),e("li",null,[s(o,{to:"/api/classes/purista_core.Service.html#initializeeventbridgeconnect"},{default:n(()=>[V]),_:1})]),e("li",null,[s(o,{to:"/api/classes/purista_core.Service.html#invoke"},{default:n(()=>[G]),_:1})]),e("li",null,[s(o,{to:"/api/classes/purista_core.Service.html#registercommand"},{default:n(()=>[U]),_:1})]),e("li",null,[s(o,{to:"/api/classes/purista_core.Service.html#sendserviceinfo"},{default:n(()=>[j]),_:1})]),e("li",null,[s(o,{to:"/api/classes/purista_core.Service.html#start"},{default:n(()=>[J]),_:1})]),e("li",null,[s(o,{to:"/api/classes/purista_core.Service.html#subscribe"},{default:n(()=>[K]),_:1})])]),Q,e("table",null,[W,e("tbody",null,[e("tr",null,[X,e("td",Y,[s(o,{to:"/api/modules/purista_core.html#logger"},{default:n(()=>[Z]),_:1})])]),e("tr",null,[$,e("td",ee,[s(o,{to:"/api/modules/purista_core.html#serviceinfotype"},{default:n(()=>[te]),_:1})])]),e("tr",null,[se,e("td",oe,[s(o,{to:"/api/interfaces/purista_core.EventBridge.html"},{default:n(()=>[ne]),_:1})])]),e("tr",null,[ie,e("td",re,[s(o,{to:"/api/modules/purista_core.html#commanddefinition"},{default:n(()=>[de]),_:1}),ce,ae,le,he,_e,ue,pe,s(o,{to:"/api/classes/purista_core.Service.html"},{default:n(()=>[fe]),_:1}),me,ge,be,ve,xe,Se,ye,ke,we,Ce,Pe])]),e("tr",null,[Ie,e("td",Le,[s(o,{to:"/api/modules/purista_core.html#subscriptiondefinition"},{default:n(()=>[De]),_:1}),Te,s(o,{to:"/api/modules/purista_core.html#ebmessage"},{default:n(()=>[Re]),_:1}),Be])])])]),Me,e("p",null,[s(o,{to:"/api/classes/purista_core.ServiceClass.html"},{default:n(()=>[Ee]),_:1}),Ne,s(o,{to:"/api/classes/purista_core.ServiceClass.html#constructor"},{default:n(()=>[qe]),_:1})]),Oe,e("p",null,[e("a",ze,[He,s(i)])]),Ae,Fe,e("p",null,[Ve,Ge,Ue,je,Je,Ke,Qe,We,Xe,s(o,{to:"/api/modules/purista_core.html#commanddefinition"},{default:n(()=>[Ye]),_:1}),Ze,$e,et,tt,st,ot,nt,s(o,{to:"/api/classes/purista_core.Service.html"},{default:n(()=>[it]),_:1}),rt,dt,ct,at,lt,ht,_t,ut,pt,ft,mt]),gt,e("p",null,[e("a",bt,[vt,s(i)])]),xt,St,e("p",null,[yt,kt,wt,Ct,Pt,s(o,{to:"/api/interfaces/purista_core.EventBridge.html"},{default:n(()=>[It]),_:1})]),Lt,Dt,e("p",null,[s(o,{to:"/api/classes/purista_core.ServiceClass.html"},{default:n(()=>[Tt]),_:1}),Rt,s(o,{to:"/api/classes/purista_core.ServiceClass.html#eventbridge"},{default:n(()=>[Bt]),_:1})]),Mt,e("p",null,[e("a",Et,[Nt,s(i)])]),qt,Ot,e("p",null,[zt,Ht,At,s(o,{to:"/api/modules/purista_core.html#serviceinfotype"},{default:n(()=>[Ft]),_:1})]),Vt,Gt,e("p",null,[s(o,{to:"/api/classes/purista_core.ServiceClass.html"},{default:n(()=>[Ut]),_:1}),jt,s(o,{to:"/api/classes/purista_core.ServiceClass.html#info"},{default:n(()=>[Jt]),_:1})]),Kt,e("p",null,[e("a",Qt,[Wt,s(i)])]),Xt,e("p",null,[e("a",Yt,[Zt,s(i)])]),$t,es,e("p",null,[ts,ss,os,ns,is,rs,ds,cs,as,s(o,{to:"/api/modules/purista_core.internal.html#pendiginvocation"},{default:n(()=>[ls]),_:1}),hs]),_s,e("p",null,[e("a",us,[ps,s(i)])]),fs,ms,e("p",null,[gs,bs,vs,xs,Ss,s(o,{to:"/api/modules/purista_core.html#logger"},{default:n(()=>[ys]),_:1})]),ks,e("p",null,[e("a",ws,[Cs,s(i)])]),Ps,Is,e("p",null,[Ls,Ds,Ts,Rs,Bs,Ms,Es,Ns,qs,s(o,{to:"/api/modules/purista_core.html#subscriptiondefinition"},{default:n(()=>[Os]),_:1}),zs,s(o,{to:"/api/modules/purista_core.html#ebmessage"},{default:n(()=>[Hs]),_:1}),As]),Fs,e("p",null,[e("a",Vs,[Gs,s(i)])]),Us,js,e("p",null,[Js,Ks,Qs,Ws,Xs,s(o,{to:"/api/modules/purista_core.html#serviceinfotype"},{default:n(()=>[Ys]),_:1})]),Zs,$s,e("p",null,[s(o,{to:"/api/modules/purista_core.html#serviceinfotype"},{default:n(()=>[eo]),_:1})]),to,so,oo,e("p",null,[e("a",no,[io,s(i)])]),ro,e("table",null,[co,e("tbody",null,[ao,e("tr",null,[lo,e("td",ho,[s(o,{to:"/api/modules/purista_core.html#ebmessage"},{default:n(()=>[_o]),_:1})]),uo])])]),po,fo,mo,e("p",null,[e("a",go,[bo,s(i)])]),vo,e("p",null,[s(o,{to:"/api/classes/purista_core.ServiceClass.html"},{default:n(()=>[xo]),_:1}),So,s(o,{to:"/api/classes/purista_core.ServiceClass.html#destroy"},{default:n(()=>[yo]),_:1})]),ko,e("p",null,[e("a",wo,[Co,s(i)])]),Po,e("table",null,[Io,e("tbody",null,[Lo,e("tr",null,[Do,e("td",To,[s(o,{to:"/api/modules/purista_core.html#command"},{default:n(()=>[Ro]),_:1}),Bo,Mo,Eo,No,qo,Oo,zo,Ho,Ao])])])]),Fo,Vo,Go,e("p",null,[e("a",Uo,[jo,s(i)])]),Jo,e("table",null,[Ko,e("tbody",null,[Qo,e("tr",null,[Wo,e("td",Xo,[s(o,{to:"/api/modules/purista_core.html#ebmessage"},{default:n(()=>[Yo]),_:1})])])])]),Zo,$o,en,e("p",null,[e("a",tn,[sn,s(i)])]),on,e("table",null,[nn,e("tbody",null,[e("tr",null,[rn,e("td",dn,[s(o,{to:"/api/modules/purista_core.html#commanddefinition"},{default:n(()=>[cn]),_:1}),an,ln,hn,_n,un,pn,fn,s(o,{to:"/api/classes/purista_core.Service.html"},{default:n(()=>[mn]),_:1}),gn,bn,vn,xn,Sn,yn,kn,wn,Cn,Pn,In])]),e("tr",null,[Ln,e("td",Dn,[s(o,{to:"/api/modules/purista_core.html#subscriptiondefinition"},{default:n(()=>[Tn]),_:1}),Rn,s(o,{to:"/api/modules/purista_core.html#ebmessage"},{default:n(()=>[Bn]),_:1}),Mn])])])]),En,Nn,qn,e("p",null,[e("a",On,[zn,s(i)])]),Hn,e("table",null,[An,e("tbody",null,[e("tr",null,[Fn,e("td",Vn,[Gn,Un,s(o,{to:"/api/modules/purista_core.html#command"},{default:n(()=>[jn]),_:1}),Jn])]),Kn,e("tr",null,[Qn,e("td",Wn,[Xn,Yn,s(o,{to:"/api/modules/purista_core.html#command"},{default:n(()=>[Zn]),_:1}),$n,ei,ti,si,oi,ni,ii,ri,di])])])]),ci,ai,li,e("p",null,[s(o,{to:"/api/classes/purista_core.ServiceClass.html"},{default:n(()=>[hi]),_:1}),_i,s(o,{to:"/api/classes/purista_core.ServiceClass.html#invoke"},{default:n(()=>[ui]),_:1})]),pi,e("p",null,[e("a",fi,[mi,s(i)])]),gi,e("table",null,[bi,e("tbody",null,[e("tr",null,[vi,e("td",xi,[s(o,{to:"/api/modules/purista_core.html#commanddefinition"},{default:n(()=>[Si]),_:1}),yi,ki,wi,Ci,Pi,Ii,Li,s(o,{to:"/api/classes/purista_core.Service.html"},{default:n(()=>[Di]),_:1}),Ti,Ri,Bi,Mi,Ei,Ni,qi,Oi,zi,Hi,Ai])])])]),Fi,Vi,Gi,e("p",null,[s(o,{to:"/api/classes/purista_core.ServiceClass.html"},{default:n(()=>[Ui]),_:1}),ji,s(o,{to:"/api/classes/purista_core.ServiceClass.html#registercommand"},{default:n(()=>[Ji]),_:1})]),Ki,e("p",null,[e("a",Qi,[Wi,s(i)])]),Xi,e("table",null,[Yi,e("tbody",null,[e("tr",null,[Zi,e("td",$i,[s(o,{to:"/api/modules/purista_core.html#infomessagetype"},{default:n(()=>[er]),_:1})]),tr]),sr,or])]),nr,ir,rr,e("p",null,[e("a",dr,[cr,s(i)])]),ar,e("p",null,[e("a",lr,[hr,s(i)])]),_r,e("table",null,[ur,e("tbody",null,[e("tr",null,[pr,e("td",fr,[s(o,{to:"/api/modules/purista_core.html#subscriptiondefinition"},{default:n(()=>[mr]),_:1}),gr,s(o,{to:"/api/modules/purista_core.html#ebmessage"},{default:n(()=>[br]),_:1}),vr])])])]),xr,Sr,yr,e("p",null,[s(o,{to:"/api/classes/purista_core.ServiceClass.html"},{default:n(()=>[kr]),_:1}),wr,s(o,{to:"/api/classes/purista_core.ServiceClass.html#subscribe"},{default:n(()=>[Cr]),_:1})]),Pr,e("p",null,[e("a",Ir,[Lr,s(i)])])])}var Er=c(h,[["render",Dr],["__file","purista_core.Service.html.vue"]]);export{Er as default};