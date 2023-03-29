import{_ as s,W as t,X as o,Z as n,a0 as r,a1 as i,$ as e,Y as d,D as c}from"./framework-d89ed822.js";const h={},p=n("h1",{id:"enumeration-ebmessagetype",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#enumeration-ebmessagetype","aria-hidden":"true"},"#"),e(" Enumeration: EBMessageType")],-1),u=n("p",null,"Type of event bridge message",-1),l=n("h2",{id:"table-of-contents",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#table-of-contents","aria-hidden":"true"},"#"),e(" Table of contents")],-1),f=n("h3",{id:"enumeration-members",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#enumeration-members","aria-hidden":"true"},"#"),e(" Enumeration Members")],-1),m=d('<h2 id="enumeration-members-1" tabindex="-1"><a class="header-anchor" href="#enumeration-members-1" aria-hidden="true">#</a> Enumeration Members</h2><h3 id="command" tabindex="-1"><a class="header-anchor" href="#command" aria-hidden="true">#</a> Command</h3><p>• <strong>Command</strong> = <code>&quot;command&quot;</code></p><p>Command message type: Message which is sent from a single sender to exactly one single receiver. The sender expects a answer response from receiver within a specific time frame (ttl). If the sender does not receive a answer within this time frame, the command will be rejected with timeout error.</p><h4 id="defined-in" tabindex="-1"><a class="header-anchor" href="#defined-in" aria-hidden="true">#</a> Defined in</h4><p>packages/core/lib/core/types/EBMessageType.enum.d.ts:11</p><hr><h3 id="commanderrorresponse" tabindex="-1"><a class="header-anchor" href="#commanderrorresponse" aria-hidden="true">#</a> CommandErrorResponse</h3><p>• <strong>CommandErrorResponse</strong> = <code>&quot;commandErrorResponse&quot;</code></p><p>a error response from receiver of a command message</p><h4 id="defined-in-1" tabindex="-1"><a class="header-anchor" href="#defined-in-1" aria-hidden="true">#</a> Defined in</h4><p>packages/core/lib/core/types/EBMessageType.enum.d.ts:15</p><hr><h3 id="commandsuccessresponse" tabindex="-1"><a class="header-anchor" href="#commandsuccessresponse" aria-hidden="true">#</a> CommandSuccessResponse</h3><p>• <strong>CommandSuccessResponse</strong> = <code>&quot;commandSuccessResponse&quot;</code></p><p>a success response from receiver of a command message</p><h4 id="defined-in-2" tabindex="-1"><a class="header-anchor" href="#defined-in-2" aria-hidden="true">#</a> Defined in</h4><p>packages/core/lib/core/types/EBMessageType.enum.d.ts:13</p><hr><h3 id="custommessage" tabindex="-1"><a class="header-anchor" href="#custommessage" aria-hidden="true">#</a> CustomMessage</h3><p>• <strong>CustomMessage</strong> = <code>&quot;customMessage&quot;</code></p><p>a custom message / custom event</p><h4 id="defined-in-3" tabindex="-1"><a class="header-anchor" href="#defined-in-3" aria-hidden="true">#</a> Defined in</h4><p>packages/core/lib/core/types/EBMessageType.enum.d.ts:39</p><hr><h3 id="infoinvoketimeout" tabindex="-1"><a class="header-anchor" href="#infoinvoketimeout" aria-hidden="true">#</a> InfoInvokeTimeout</h3><p>• <strong>InfoInvokeTimeout</strong> = <code>&quot;infoInvokeTimeout&quot;</code></p><p>a service invoked a other function and did not get a answer within given ttl</p><h4 id="defined-in-4" tabindex="-1"><a class="header-anchor" href="#defined-in-4" aria-hidden="true">#</a> Defined in</h4><p>packages/core/lib/core/types/EBMessageType.enum.d.ts:35</p><hr><h3 id="infoservicedrain" tabindex="-1"><a class="header-anchor" href="#infoservicedrain" aria-hidden="true">#</a> InfoServiceDrain</h3><p>• <strong>InfoServiceDrain</strong> = <code>&quot;infoServiceDrain&quot;</code></p><p>indicates that a service is going to shut down and does no longer accept new requests</p><h4 id="defined-in-5" tabindex="-1"><a class="header-anchor" href="#defined-in-5" aria-hidden="true">#</a> Defined in</h4><p>packages/core/lib/core/types/EBMessageType.enum.d.ts:31</p><hr><h3 id="infoservicefunctionadded" tabindex="-1"><a class="header-anchor" href="#infoservicefunctionadded" aria-hidden="true">#</a> InfoServiceFunctionAdded</h3><p>• <strong>InfoServiceFunctionAdded</strong> = <code>&quot;infoServiceFunctionAdded&quot;</code></p><p>send when a service provides a new function</p><h4 id="defined-in-6" tabindex="-1"><a class="header-anchor" href="#defined-in-6" aria-hidden="true">#</a> Defined in</h4><p>packages/core/lib/core/types/EBMessageType.enum.d.ts:29</p><hr><h3 id="infoserviceinit" tabindex="-1"><a class="header-anchor" href="#infoserviceinit" aria-hidden="true">#</a> InfoServiceInit</h3><p>• <strong>InfoServiceInit</strong> = <code>&quot;infoServiceInit&quot;</code></p><p>indicates that a service is booting</p><h4 id="defined-in-7" tabindex="-1"><a class="header-anchor" href="#defined-in-7" aria-hidden="true">#</a> Defined in</h4><p>packages/core/lib/core/types/EBMessageType.enum.d.ts:23</p><hr><h3 id="infoservicenotready" tabindex="-1"><a class="header-anchor" href="#infoservicenotready" aria-hidden="true">#</a> InfoServiceNotReady</h3><p>• <strong>InfoServiceNotReady</strong> = <code>&quot;infoServiceNotReady&quot;</code></p><p>indicates that a service is not able to process requests (e.g. db not available)</p><h4 id="defined-in-8" tabindex="-1"><a class="header-anchor" href="#defined-in-8" aria-hidden="true">#</a> Defined in</h4><p>packages/core/lib/core/types/EBMessageType.enum.d.ts:27</p><hr><h3 id="infoserviceready" tabindex="-1"><a class="header-anchor" href="#infoserviceready" aria-hidden="true">#</a> InfoServiceReady</h3><p>• <strong>InfoServiceReady</strong> = <code>&quot;infoServiceReady&quot;</code></p><p>indicates that a service is ready</p><h4 id="defined-in-9" tabindex="-1"><a class="header-anchor" href="#defined-in-9" aria-hidden="true">#</a> Defined in</h4><p>packages/core/lib/core/types/EBMessageType.enum.d.ts:25</p><hr><h3 id="infoserviceshutdown" tabindex="-1"><a class="header-anchor" href="#infoserviceshutdown" aria-hidden="true">#</a> InfoServiceShutdown</h3><p>• <strong>InfoServiceShutdown</strong> = <code>&quot;infoServiceShutdown&quot;</code></p><p>last event from service before service is destroyed</p><h4 id="defined-in-10" tabindex="-1"><a class="header-anchor" href="#defined-in-10" aria-hidden="true">#</a> Defined in</h4><p>packages/core/lib/core/types/EBMessageType.enum.d.ts:33</p><hr><h3 id="infosubscriptionerror" tabindex="-1"><a class="header-anchor" href="#infosubscriptionerror" aria-hidden="true">#</a> InfoSubscriptionError</h3><p>• <strong>InfoSubscriptionError</strong> = <code>&quot;infoSubscriptionError&quot;</code></p><p>a subscription function is throwing</p><h4 id="defined-in-11" tabindex="-1"><a class="header-anchor" href="#defined-in-11" aria-hidden="true">#</a> Defined in</h4><p>packages/core/lib/core/types/EBMessageType.enum.d.ts:37</p>',72);function v(g,b){const a=c("RouterLink");return t(),o("div",null,[n("p",null,[r(a,{to:"/api/"},{default:i(()=>[e("PURISTA API - v1.4.9")]),_:1}),e(" / "),r(a,{to:"/api/modules.html"},{default:i(()=>[e("Modules")]),_:1}),e(" / "),r(a,{to:"/api/modules/purista_httpserver.html"},{default:i(()=>[e("@purista/httpserver")]),_:1}),e(" / "),r(a,{to:"/api/modules/purista_httpserver.internal.html"},{default:i(()=>[e("internal")]),_:1}),e(" / EBMessageType")]),p,n("p",null,[r(a,{to:"/api/modules/purista_httpserver.html"},{default:i(()=>[e("@purista/httpserver")]),_:1}),e("."),r(a,{to:"/api/modules/purista_httpserver.internal.html"},{default:i(()=>[e("internal")]),_:1}),e(".EBMessageType")]),u,l,f,n("ul",null,[n("li",null,[r(a,{to:"/api/enums/purista_httpserver.internal.EBMessageType.html#command"},{default:i(()=>[e("Command")]),_:1})]),n("li",null,[r(a,{to:"/api/enums/purista_httpserver.internal.EBMessageType.html#commanderrorresponse"},{default:i(()=>[e("CommandErrorResponse")]),_:1})]),n("li",null,[r(a,{to:"/api/enums/purista_httpserver.internal.EBMessageType.html#commandsuccessresponse"},{default:i(()=>[e("CommandSuccessResponse")]),_:1})]),n("li",null,[r(a,{to:"/api/enums/purista_httpserver.internal.EBMessageType.html#custommessage"},{default:i(()=>[e("CustomMessage")]),_:1})]),n("li",null,[r(a,{to:"/api/enums/purista_httpserver.internal.EBMessageType.html#infoinvoketimeout"},{default:i(()=>[e("InfoInvokeTimeout")]),_:1})]),n("li",null,[r(a,{to:"/api/enums/purista_httpserver.internal.EBMessageType.html#infoservicedrain"},{default:i(()=>[e("InfoServiceDrain")]),_:1})]),n("li",null,[r(a,{to:"/api/enums/purista_httpserver.internal.EBMessageType.html#infoservicefunctionadded"},{default:i(()=>[e("InfoServiceFunctionAdded")]),_:1})]),n("li",null,[r(a,{to:"/api/enums/purista_httpserver.internal.EBMessageType.html#infoserviceinit"},{default:i(()=>[e("InfoServiceInit")]),_:1})]),n("li",null,[r(a,{to:"/api/enums/purista_httpserver.internal.EBMessageType.html#infoservicenotready"},{default:i(()=>[e("InfoServiceNotReady")]),_:1})]),n("li",null,[r(a,{to:"/api/enums/purista_httpserver.internal.EBMessageType.html#infoserviceready"},{default:i(()=>[e("InfoServiceReady")]),_:1})]),n("li",null,[r(a,{to:"/api/enums/purista_httpserver.internal.EBMessageType.html#infoserviceshutdown"},{default:i(()=>[e("InfoServiceShutdown")]),_:1})]),n("li",null,[r(a,{to:"/api/enums/purista_httpserver.internal.EBMessageType.html#infosubscriptionerror"},{default:i(()=>[e("InfoSubscriptionError")]),_:1})])]),m])}const _=s(h,[["render",v],["__file","purista_httpserver.internal.EBMessageType.html.vue"]]);export{_ as default};