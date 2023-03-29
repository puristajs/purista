import{_ as s,W as r,X as o,Z as e,a0 as d,a1 as i,$ as t,Y as n,D as l}from"./framework-d89ed822.js";const c={},h=e("h1",{id:"interface-eventbridge",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#interface-eventbridge","aria-hidden":"true"},"#"),t(" Interface: EventBridge")],-1),u=e("p",null,"Event bridge interface The event bridge must implement this interface.",-1),m=e("h2",{id:"implemented-by",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#implemented-by","aria-hidden":"true"},"#"),t(" Implemented by")],-1),p=e("code",null,"AmqpBridge",-1),_=e("h2",{id:"table-of-contents",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#table-of-contents","aria-hidden":"true"},"#"),t(" Table of contents")],-1),g=e("h3",{id:"properties",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#properties","aria-hidden":"true"},"#"),t(" Properties")],-1),f=e("h3",{id:"methods",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#methods","aria-hidden":"true"},"#"),t(" Methods")],-1),b=n('<h2 id="properties-1" tabindex="-1"><a class="header-anchor" href="#properties-1" aria-hidden="true">#</a> Properties</h2><h3 id="defaultcommandtimeout" tabindex="-1"><a class="header-anchor" href="#defaultcommandtimeout" aria-hidden="true">#</a> defaultCommandTimeout</h3><p>• <code>Readonly</code> <strong>defaultCommandTimeout</strong>: <code>number</code></p><p>The default time until when a command invocation automatically returns a time out error</p><h4 id="defined-in" tabindex="-1"><a class="header-anchor" href="#defined-in" aria-hidden="true">#</a> Defined in</h4><p>packages/core/lib/core/EventBridge/types/EventBridge.d.ts:13</p><hr><h3 id="name" tabindex="-1"><a class="header-anchor" href="#name" aria-hidden="true">#</a> name</h3><p>• <code>Readonly</code> <strong>name</strong>: <code>string</code></p><h4 id="defined-in-1" tabindex="-1"><a class="header-anchor" href="#defined-in-1" aria-hidden="true">#</a> Defined in</h4><p>packages/core/lib/core/EventBridge/types/EventBridge.d.ts:9</p><h2 id="methods-1" tabindex="-1"><a class="header-anchor" href="#methods-1" aria-hidden="true">#</a> Methods</h2><h3 id="destroy" tabindex="-1"><a class="header-anchor" href="#destroy" aria-hidden="true">#</a> destroy</h3><p>▸ <strong>destroy</strong>(): <code>Promise</code>&lt;<code>void</code>&gt;</p><p>Shut down event bridge as gracefully as possible</p><h4 id="returns" tabindex="-1"><a class="header-anchor" href="#returns" aria-hidden="true">#</a> Returns</h4><p><code>Promise</code>&lt;<code>void</code>&gt;</p><h4 id="defined-in-2" tabindex="-1"><a class="header-anchor" href="#defined-in-2" aria-hidden="true">#</a> Defined in</h4><p>packages/core/lib/core/EventBridge/types/EventBridge.d.ts:64</p><hr><h3 id="emitmessage" tabindex="-1"><a class="header-anchor" href="#emitmessage" aria-hidden="true">#</a> emitMessage</h3>',21),y=e("strong",null,"emitMessage",-1),x=e("code",null,"message",-1),v=e("code",null,"Promise",-1),B=e("code",null,"Readonly",-1),E=e("code",null,"EBMessage",-1),q=e("p",null,"Emit a message to the eventbridge without awaiting a result",-1),P=e("h4",{id:"parameters",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#parameters","aria-hidden":"true"},"#"),t(" Parameters")],-1),k=e("thead",null,[e("tr",null,[e("th",{style:{"text-align":"left"}},"Name"),e("th",{style:{"text-align":"left"}},"Type"),e("th",{style:{"text-align":"left"}},"Description")])],-1),R=e("td",{style:{"text-align":"left"}},[e("code",null,"message")],-1),C={style:{"text-align":"left"}},T=e("code",null,"Omit",-1),D=e("code",null,"EBMessage",-1),M=e("code",null,'"id"',-1),I=e("code",null,'"timestamp"',-1),S=e("code",null,'"instanceId"',-1),N=e("code",null,'"correlationId"',-1),w=e("td",{style:{"text-align":"left"}},"the message",-1),A=e("h4",{id:"returns-1",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#returns-1","aria-hidden":"true"},"#"),t(" Returns")],-1),O=e("code",null,"Promise",-1),V=e("code",null,"Readonly",-1),H=e("code",null,"EBMessage",-1),L=n('<h4 id="defined-in-3" tabindex="-1"><a class="header-anchor" href="#defined-in-3" aria-hidden="true">#</a> Defined in</h4><p>packages/core/lib/core/EventBridge/types/EventBridge.d.ts:22</p><hr><h3 id="invoke" tabindex="-1"><a class="header-anchor" href="#invoke" aria-hidden="true">#</a> invoke</h3><p>▸ <strong>invoke</strong>&lt;<code>T</code>&gt;(<code>input</code>, <code>ttl?</code>): <code>Promise</code>&lt;<code>T</code>&gt;</p><p>Call a command of a service and return the result of this command</p><h4 id="type-parameters" tabindex="-1"><a class="header-anchor" href="#type-parameters" aria-hidden="true">#</a> Type parameters</h4><table><thead><tr><th style="text-align:left;">Name</th></tr></thead><tbody><tr><td style="text-align:left;"><code>T</code></td></tr></tbody></table><h4 id="parameters-1" tabindex="-1"><a class="header-anchor" href="#parameters-1" aria-hidden="true">#</a> Parameters</h4>',9),U=e("thead",null,[e("tr",null,[e("th",{style:{"text-align":"left"}},"Name"),e("th",{style:{"text-align":"left"}},"Type"),e("th",{style:{"text-align":"left"}},"Description")])],-1),W=e("td",{style:{"text-align":"left"}},[e("code",null,"input")],-1),X={style:{"text-align":"left"}},Y=e("code",null,"Omit",-1),Z=e("code",null,"Command",-1),$=e("code",null,'"id"',-1),j=e("code",null,'"messageType"',-1),z=e("code",null,'"timestamp"',-1),F=e("code",null,'"instanceId"',-1),G=e("code",null,'"correlationId"',-1),J=e("td",{style:{"text-align":"left"}},"a partial command message",-1),K=e("tr",null,[e("td",{style:{"text-align":"left"}},[e("code",null,"ttl?")]),e("td",{style:{"text-align":"left"}},[e("code",null,"number")]),e("td",{style:{"text-align":"left"}},"the time to live (timeout) of the invocation")],-1),Q=n('<h4 id="returns-2" tabindex="-1"><a class="header-anchor" href="#returns-2" aria-hidden="true">#</a> Returns</h4><p><code>Promise</code>&lt;<code>T</code>&gt;</p><h4 id="defined-in-4" tabindex="-1"><a class="header-anchor" href="#defined-in-4" aria-hidden="true">#</a> Defined in</h4><p>packages/core/lib/core/EventBridge/types/EventBridge.d.ts:30</p><hr><h3 id="ishealthy" tabindex="-1"><a class="header-anchor" href="#ishealthy" aria-hidden="true">#</a> isHealthy</h3><p>▸ <strong>isHealthy</strong>(): <code>Promise</code>&lt;<code>boolean</code>&gt;</p><p>Indicates if the eventbridge is running and works correctly</p><h4 id="returns-3" tabindex="-1"><a class="header-anchor" href="#returns-3" aria-hidden="true">#</a> Returns</h4><p><code>Promise</code>&lt;<code>boolean</code>&gt;</p><h4 id="defined-in-5" tabindex="-1"><a class="header-anchor" href="#defined-in-5" aria-hidden="true">#</a> Defined in</h4><p>packages/core/lib/core/EventBridge/types/EventBridge.d.ts:60</p><hr><h3 id="isready" tabindex="-1"><a class="header-anchor" href="#isready" aria-hidden="true">#</a> isReady</h3><p>▸ <strong>isReady</strong>(): <code>Promise</code>&lt;<code>boolean</code>&gt;</p><p>Indicates if the eventbridge has been started and is connected to underlaying message broker</p><h4 id="returns-4" tabindex="-1"><a class="header-anchor" href="#returns-4" aria-hidden="true">#</a> Returns</h4><p><code>Promise</code>&lt;<code>boolean</code>&gt;</p><h4 id="defined-in-6" tabindex="-1"><a class="header-anchor" href="#defined-in-6" aria-hidden="true">#</a> Defined in</h4><p>packages/core/lib/core/EventBridge/types/EventBridge.d.ts:56</p><hr><h3 id="registercommand" tabindex="-1"><a class="header-anchor" href="#registercommand" aria-hidden="true">#</a> registerCommand</h3><p>▸ <strong>registerCommand</strong>(<code>address</code>, <code>cb</code>, <code>metadata</code>, <code>eventBridgeConfig</code>): <code>Promise</code>&lt;<code>string</code>&gt;</p><h4 id="parameters-2" tabindex="-1"><a class="header-anchor" href="#parameters-2" aria-hidden="true">#</a> Parameters</h4>',24),ee=e("thead",null,[e("tr",null,[e("th",{style:{"text-align":"left"}},"Name"),e("th",{style:{"text-align":"left"}},"Type"),e("th",{style:{"text-align":"left"}},"Description")])],-1),te=e("td",{style:{"text-align":"left"}},[e("code",null,"address")],-1),ae={style:{"text-align":"left"}},de=e("code",null,"EBMessageAddress",-1),ie=e("td",{style:{"text-align":"left"}},"the address of the service command (service name, version and command name)",-1),ne=e("td",{style:{"text-align":"left"}},[e("code",null,"cb")],-1),se={style:{"text-align":"left"}},re=e("code",null,"message",-1),oe=e("code",null,"Command",-1),le=e("code",null,"Promise",-1),ce=e("code",null,"Readonly",-1),he=e("code",null,"Omit",-1),ue=e("code",null,"CommandSuccessResponse",-1),me=e("code",null,'"instanceId"',-1),pe=e("code",null,"Readonly",-1),_e=e("code",null,"Omit",-1),ge=e("code",null,"CommandErrorResponse",-1),fe=e("code",null,'"instanceId"',-1),be=e("td",{style:{"text-align":"left"}},"the function to be called if a matching command arrives",-1),ye=e("td",{style:{"text-align":"left"}},[e("code",null,"metadata")],-1),xe={style:{"text-align":"left"}},ve=e("code",null,"CommandDefinitionMetadataBase",-1),Be=e("td",{style:{"text-align":"left"}},"-",-1),Ee=e("td",{style:{"text-align":"left"}},[e("code",null,"eventBridgeConfig")],-1),qe={style:{"text-align":"left"}},Pe=e("code",null,"DefinitionEventBridgeConfig",-1),ke=e("td",{style:{"text-align":"left"}},"-",-1),Re=n('<h4 id="returns-5" tabindex="-1"><a class="header-anchor" href="#returns-5" aria-hidden="true">#</a> Returns</h4><p><code>Promise</code>&lt;<code>string</code>&gt;</p><h4 id="defined-in-7" tabindex="-1"><a class="header-anchor" href="#defined-in-7" aria-hidden="true">#</a> Defined in</h4><p>packages/core/lib/core/EventBridge/types/EventBridge.d.ts:36</p><hr><h3 id="registersubscription" tabindex="-1"><a class="header-anchor" href="#registersubscription" aria-hidden="true">#</a> registerSubscription</h3><p>▸ <strong>registerSubscription</strong>(<code>subscription</code>, <code>cb</code>): <code>Promise</code>&lt;<code>string</code>&gt;</p><p>Register a new subscription</p><h4 id="parameters-3" tabindex="-1"><a class="header-anchor" href="#parameters-3" aria-hidden="true">#</a> Parameters</h4>',9),Ce=e("thead",null,[e("tr",null,[e("th",{style:{"text-align":"left"}},"Name"),e("th",{style:{"text-align":"left"}},"Type"),e("th",{style:{"text-align":"left"}},"Description")])],-1),Te=e("td",{style:{"text-align":"left"}},[e("code",null,"subscription")],-1),De={style:{"text-align":"left"}},Me=e("code",null,"Subscription",-1),Ie=e("td",{style:{"text-align":"left"}},"the subscription definition",-1),Se=e("td",{style:{"text-align":"left"}},[e("code",null,"cb")],-1),Ne={style:{"text-align":"left"}},we=e("code",null,"message",-1),Ae=e("code",null,"EBMessage",-1),Oe=e("code",null,"Promise",-1),Ve=e("code",null,"undefined",-1),He=e("code",null,"Omit",-1),Le=e("code",null,"CustomMessage",-1),Ue=e("code",null,'"id"',-1),We=e("code",null,'"timestamp"',-1),Xe=e("code",null,'"instanceId"',-1),Ye=e("td",{style:{"text-align":"left"}},"the function to be called if a matching message arrives",-1),Ze=n('<h4 id="returns-6" tabindex="-1"><a class="header-anchor" href="#returns-6" aria-hidden="true">#</a> Returns</h4><p><code>Promise</code>&lt;<code>string</code>&gt;</p><h4 id="defined-in-8" tabindex="-1"><a class="header-anchor" href="#defined-in-8" aria-hidden="true">#</a> Defined in</h4><p>packages/core/lib/core/EventBridge/types/EventBridge.d.ts:47</p><hr><h3 id="start" tabindex="-1"><a class="header-anchor" href="#start" aria-hidden="true">#</a> start</h3><p>▸ <strong>start</strong>(): <code>Promise</code>&lt;<code>void</code>&gt;</p><p>Start the eventbridge and connect to the underlaying message broker</p><h4 id="returns-7" tabindex="-1"><a class="header-anchor" href="#returns-7" aria-hidden="true">#</a> Returns</h4><p><code>Promise</code>&lt;<code>void</code>&gt;</p><h4 id="defined-in-9" tabindex="-1"><a class="header-anchor" href="#defined-in-9" aria-hidden="true">#</a> Defined in</h4><p>packages/core/lib/core/EventBridge/types/EventBridge.d.ts:17</p><hr><h3 id="unregistercommand" tabindex="-1"><a class="header-anchor" href="#unregistercommand" aria-hidden="true">#</a> unregisterCommand</h3><p>▸ <strong>unregisterCommand</strong>(<code>address</code>): <code>Promise</code>&lt;<code>void</code>&gt;</p><p>Unregister a service command</p><h4 id="parameters-4" tabindex="-1"><a class="header-anchor" href="#parameters-4" aria-hidden="true">#</a> Parameters</h4>',17),$e=e("thead",null,[e("tr",null,[e("th",{style:{"text-align":"left"}},"Name"),e("th",{style:{"text-align":"left"}},"Type"),e("th",{style:{"text-align":"left"}},"Description")])],-1),je=e("td",{style:{"text-align":"left"}},[e("code",null,"address")],-1),ze={style:{"text-align":"left"}},Fe=e("code",null,"EBMessageAddress",-1),Ge=e("td",{style:{"text-align":"left"}},"The address (service name, version and command name) of the command to be de-registered",-1),Je=n('<h4 id="returns-8" tabindex="-1"><a class="header-anchor" href="#returns-8" aria-hidden="true">#</a> Returns</h4><p><code>Promise</code>&lt;<code>void</code>&gt;</p><h4 id="defined-in-10" tabindex="-1"><a class="header-anchor" href="#defined-in-10" aria-hidden="true">#</a> Defined in</h4><p>packages/core/lib/core/EventBridge/types/EventBridge.d.ts:41</p><hr><h3 id="unregistersubscription" tabindex="-1"><a class="header-anchor" href="#unregistersubscription" aria-hidden="true">#</a> unregisterSubscription</h3><p>▸ <strong>unregisterSubscription</strong>(<code>address</code>): <code>Promise</code>&lt;<code>void</code>&gt;</p><h4 id="parameters-5" tabindex="-1"><a class="header-anchor" href="#parameters-5" aria-hidden="true">#</a> Parameters</h4>',8),Ke=e("thead",null,[e("tr",null,[e("th",{style:{"text-align":"left"}},"Name"),e("th",{style:{"text-align":"left"}},"Type")])],-1),Qe=e("td",{style:{"text-align":"left"}},[e("code",null,"address")],-1),et={style:{"text-align":"left"}},tt=e("code",null,"EBMessageAddress",-1),at=e("h4",{id:"returns-9",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#returns-9","aria-hidden":"true"},"#"),t(" Returns")],-1),dt=e("p",null,[e("code",null,"Promise"),t("<"),e("code",null,"void"),t(">")],-1),it=e("h4",{id:"defined-in-11",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#defined-in-11","aria-hidden":"true"},"#"),t(" Defined in")],-1),nt=e("p",null,"packages/core/lib/core/EventBridge/types/EventBridge.d.ts:52",-1);function st(rt,ot){const a=l("RouterLink");return r(),o("div",null,[e("p",null,[d(a,{to:"/api/"},{default:i(()=>[t("PURISTA API - v1.4.9")]),_:1}),t(" / "),d(a,{to:"/api/modules.html"},{default:i(()=>[t("Modules")]),_:1}),t(" / "),d(a,{to:"/api/modules/purista_amqpbridge.html"},{default:i(()=>[t("@purista/amqpbridge")]),_:1}),t(" / "),d(a,{to:"/api/modules/purista_amqpbridge.internal.html"},{default:i(()=>[t("internal")]),_:1}),t(" / EventBridge")]),h,e("p",null,[d(a,{to:"/api/modules/purista_amqpbridge.html"},{default:i(()=>[t("@purista/amqpbridge")]),_:1}),t("."),d(a,{to:"/api/modules/purista_amqpbridge.internal.html"},{default:i(()=>[t("internal")]),_:1}),t(".EventBridge")]),u,m,e("ul",null,[e("li",null,[d(a,{to:"/api/classes/purista_amqpbridge.AmqpBridge.html"},{default:i(()=>[p]),_:1})])]),_,g,e("ul",null,[e("li",null,[d(a,{to:"/api/interfaces/purista_amqpbridge.internal.EventBridge.html#defaultcommandtimeout"},{default:i(()=>[t("defaultCommandTimeout")]),_:1})]),e("li",null,[d(a,{to:"/api/interfaces/purista_amqpbridge.internal.EventBridge.html#name"},{default:i(()=>[t("name")]),_:1})])]),f,e("ul",null,[e("li",null,[d(a,{to:"/api/interfaces/purista_amqpbridge.internal.EventBridge.html#destroy"},{default:i(()=>[t("destroy")]),_:1})]),e("li",null,[d(a,{to:"/api/interfaces/purista_amqpbridge.internal.EventBridge.html#emitmessage"},{default:i(()=>[t("emitMessage")]),_:1})]),e("li",null,[d(a,{to:"/api/interfaces/purista_amqpbridge.internal.EventBridge.html#invoke"},{default:i(()=>[t("invoke")]),_:1})]),e("li",null,[d(a,{to:"/api/interfaces/purista_amqpbridge.internal.EventBridge.html#ishealthy"},{default:i(()=>[t("isHealthy")]),_:1})]),e("li",null,[d(a,{to:"/api/interfaces/purista_amqpbridge.internal.EventBridge.html#isready"},{default:i(()=>[t("isReady")]),_:1})]),e("li",null,[d(a,{to:"/api/interfaces/purista_amqpbridge.internal.EventBridge.html#registercommand"},{default:i(()=>[t("registerCommand")]),_:1})]),e("li",null,[d(a,{to:"/api/interfaces/purista_amqpbridge.internal.EventBridge.html#registersubscription"},{default:i(()=>[t("registerSubscription")]),_:1})]),e("li",null,[d(a,{to:"/api/interfaces/purista_amqpbridge.internal.EventBridge.html#start"},{default:i(()=>[t("start")]),_:1})]),e("li",null,[d(a,{to:"/api/interfaces/purista_amqpbridge.internal.EventBridge.html#unregistercommand"},{default:i(()=>[t("unregisterCommand")]),_:1})]),e("li",null,[d(a,{to:"/api/interfaces/purista_amqpbridge.internal.EventBridge.html#unregistersubscription"},{default:i(()=>[t("unregisterSubscription")]),_:1})])]),b,e("p",null,[t("▸ "),y,t("("),x,t("): "),v,t("<"),B,t("<"),d(a,{to:"/api/modules/purista_amqpbridge.internal.html#ebmessage"},{default:i(()=>[E]),_:1}),t(">>")]),q,P,e("table",null,[k,e("tbody",null,[e("tr",null,[R,e("td",C,[T,t("<"),d(a,{to:"/api/modules/purista_amqpbridge.internal.html#ebmessage"},{default:i(()=>[D]),_:1}),t(", "),M,t(" | "),I,t(" | "),S,t(" | "),N,t(">")]),w])])]),A,e("p",null,[O,t("<"),V,t("<"),d(a,{to:"/api/modules/purista_amqpbridge.internal.html#ebmessage"},{default:i(()=>[H]),_:1}),t(">>")]),L,e("table",null,[U,e("tbody",null,[e("tr",null,[W,e("td",X,[Y,t("<"),d(a,{to:"/api/modules/purista_amqpbridge.internal.html#command-1"},{default:i(()=>[Z]),_:1}),t(", "),$,t(" | "),j,t(" | "),z,t(" | "),F,t(" | "),G,t(">")]),J]),K])]),Q,e("table",null,[ee,e("tbody",null,[e("tr",null,[te,e("td",ae,[d(a,{to:"/api/modules/purista_amqpbridge.internal.html#ebmessageaddress"},{default:i(()=>[de]),_:1})]),ie]),e("tr",null,[ne,e("td",se,[t("("),re,t(": "),d(a,{to:"/api/modules/purista_amqpbridge.internal.html#command-1"},{default:i(()=>[oe]),_:1}),t(") => "),le,t("<"),ce,t("<"),he,t("<"),d(a,{to:"/api/modules/purista_amqpbridge.internal.html#commandsuccessresponse-1"},{default:i(()=>[ue]),_:1}),t(", "),me,t(">> | "),pe,t("<"),_e,t("<"),d(a,{to:"/api/modules/purista_amqpbridge.internal.html#commanderrorresponse-1"},{default:i(()=>[ge]),_:1}),t(", "),fe,t(">>>")]),be]),e("tr",null,[ye,e("td",xe,[d(a,{to:"/api/modules/purista_amqpbridge.internal.html#commanddefinitionmetadatabase"},{default:i(()=>[ve]),_:1})]),Be]),e("tr",null,[Ee,e("td",qe,[d(a,{to:"/api/modules/purista_amqpbridge.internal.html#definitioneventbridgeconfig"},{default:i(()=>[Pe]),_:1})]),ke])])]),Re,e("table",null,[Ce,e("tbody",null,[e("tr",null,[Te,e("td",De,[d(a,{to:"/api/modules/purista_amqpbridge.internal.html#subscription"},{default:i(()=>[Me]),_:1})]),Ie]),e("tr",null,[Se,e("td",Ne,[t("("),we,t(": "),d(a,{to:"/api/modules/purista_amqpbridge.internal.html#ebmessage"},{default:i(()=>[Ae]),_:1}),t(") => "),Oe,t("<"),Ve,t(" | "),He,t("<"),d(a,{to:"/api/modules/purista_amqpbridge.internal.html#custommessage-1"},{default:i(()=>[Le]),_:1}),t(", "),Ue,t(" | "),We,t(" | "),Xe,t(">>")]),Ye])])]),Ze,e("table",null,[$e,e("tbody",null,[e("tr",null,[je,e("td",ze,[d(a,{to:"/api/modules/purista_amqpbridge.internal.html#ebmessageaddress"},{default:i(()=>[Fe]),_:1})]),Ge])])]),Je,e("table",null,[Ke,e("tbody",null,[e("tr",null,[Qe,e("td",et,[d(a,{to:"/api/modules/purista_amqpbridge.internal.html#ebmessageaddress"},{default:i(()=>[tt]),_:1})])])])]),at,dt,it,nt])}const ct=s(c,[["render",st],["__file","purista_amqpbridge.internal.EventBridge.html.vue"]]);export{ct as default};