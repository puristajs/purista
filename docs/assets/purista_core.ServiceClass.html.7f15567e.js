import{_ as d}from"./_plugin-vue_export-helper.cdc0426e.js";import{o as l,c,b as e,e as s,w as a,d as t,a as o,r as i}from"./app.520110ff.js";const h={},u=e("h1",{id:"class-serviceclass-configtype",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#class-serviceclass-configtype","aria-hidden":"true"},"#"),t(" Class: ServiceClass<ConfigType>")],-1),_=o(`<p>Abstract base service class which should be extended by the base service class. The base class should provide basic functions to use the event bridge.</p><p>Every service should extends the base class and only implement logic used in this service.</p><div class="language-typescript ext-ts line-numbers-mode"><pre class="language-typescript"><code><span class="token keyword">class</span> <span class="token class-name">MyBaseService</span> <span class="token keyword">extends</span> <span class="token class-name">Service</span> <span class="token punctuation">{</span>

  <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">super</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span>
  <span class="token operator">...</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="type-parameters" tabindex="-1"><a class="header-anchor" href="#type-parameters" aria-hidden="true">#</a> Type parameters</h2><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th></tr></thead><tbody><tr><td style="text-align:left;"><code>ConfigType</code></td><td style="text-align:left;"><code>unknown</code> | <code>undefined</code></td></tr></tbody></table><h2 id="hierarchy" tabindex="-1"><a class="header-anchor" href="#hierarchy" aria-hidden="true">#</a> Hierarchy</h2>`,6),p=e("code",null,"GenericEventEmitter",-1),f=e("code",null,"ServiceEvents",-1),m=e("p",null,[t("\u21B3 "),e("strong",null,[e("code",null,"ServiceClass")])],-1),v=e("code",null,"Service",-1),b=e("h2",{id:"table-of-contents",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#table-of-contents","aria-hidden":"true"},"#"),t(" Table of contents")],-1),g=e("h3",{id:"constructors",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#constructors","aria-hidden":"true"},"#"),t(" Constructors")],-1),y=e("h3",{id:"properties",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#properties","aria-hidden":"true"},"#"),t(" Properties")],-1),x=e("h3",{id:"methods",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#methods","aria-hidden":"true"},"#"),t(" Methods")],-1),E=o('<h2 id="constructors-1" tabindex="-1"><a class="header-anchor" href="#constructors-1" aria-hidden="true">#</a> Constructors</h2><h3 id="constructor" tabindex="-1"><a class="header-anchor" href="#constructor" aria-hidden="true">#</a> constructor</h3><p>\u2022 <strong>new ServiceClass</strong>&lt;<code>ConfigType</code>&gt;()</p><h4 id="type-parameters-1" tabindex="-1"><a class="header-anchor" href="#type-parameters-1" aria-hidden="true">#</a> Type parameters</h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th></tr></thead><tbody><tr><td style="text-align:left;"><code>ConfigType</code></td><td style="text-align:left;"><code>unknown</code></td></tr></tbody></table><h4 id="inherited-from" tabindex="-1"><a class="header-anchor" href="#inherited-from" aria-hidden="true">#</a> Inherited from</h4>',6),k=o('<h2 id="properties-1" tabindex="-1"><a class="header-anchor" href="#properties-1" aria-hidden="true">#</a> Properties</h2><h3 id="config" tabindex="-1"><a class="header-anchor" href="#config" aria-hidden="true">#</a> config</h3><p>\u2022 <code>Abstract</code> <strong>config</strong>: <code>ConfigType</code></p><h4 id="defined-in" tabindex="-1"><a class="header-anchor" href="#defined-in" aria-hidden="true">#</a> Defined in</h4>',4),S={href:"https://github.com/sebastianwessel/purista/blob/dc1cd23/packages/core/src/core/types/ServiceClass.ts#L31",target:"_blank",rel:"noopener noreferrer"},C=e("hr",null,null,-1),w=e("h3",{id:"eventbridge",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#eventbridge","aria-hidden":"true"},"#"),t(" eventBridge")],-1),T=e("code",null,"Protected",-1),G=e("code",null,"Abstract",-1),N=e("strong",null,"eventBridge",-1),K=e("code",null,"EventBridge",-1),P=e("p",null,"The event bridge instance",-1),R=e("h4",{id:"defined-in-1",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#defined-in-1","aria-hidden":"true"},"#"),t(" Defined in")],-1),L={href:"https://github.com/sebastianwessel/purista/blob/dc1cd23/packages/core/src/core/types/ServiceClass.ts#L36",target:"_blank",rel:"noopener noreferrer"},D=e("hr",null,null,-1),A=e("h3",{id:"info",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#info","aria-hidden":"true"},"#"),t(" info")],-1),B=e("code",null,"Protected",-1),I=e("code",null,"Readonly",-1),V=e("code",null,"Abstract",-1),M=e("strong",null,"info",-1),H=e("code",null,"ServiceInfoType",-1),U=e("p",null,"General service info Service name, service version and some human readable description",-1),j=e("h4",{id:"defined-in-2",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#defined-in-2","aria-hidden":"true"},"#"),t(" Defined in")],-1),q={href:"https://github.com/sebastianwessel/purista/blob/dc1cd23/packages/core/src/core/types/ServiceClass.ts#L29",target:"_blank",rel:"noopener noreferrer"},z=o('<h2 id="methods-1" tabindex="-1"><a class="header-anchor" href="#methods-1" aria-hidden="true">#</a> Methods</h2><h3 id="destroy" tabindex="-1"><a class="header-anchor" href="#destroy" aria-hidden="true">#</a> destroy</h3><p>\u25B8 <code>Abstract</code> <strong>destroy</strong>(): <code>Promise</code>&lt;<code>void</code>&gt;</p><p>Shut down the service</p><h4 id="returns" tabindex="-1"><a class="header-anchor" href="#returns" aria-hidden="true">#</a> Returns</h4><p><code>Promise</code>&lt;<code>void</code>&gt;</p><h4 id="defined-in-3" tabindex="-1"><a class="header-anchor" href="#defined-in-3" aria-hidden="true">#</a> Defined in</h4>',7),F={href:"https://github.com/sebastianwessel/purista/blob/dc1cd23/packages/core/src/core/types/ServiceClass.ts#L50",target:"_blank",rel:"noopener noreferrer"},J=o('<hr><h3 id="emit" tabindex="-1"><a class="header-anchor" href="#emit" aria-hidden="true">#</a> emit</h3><p>\u25B8 <strong>emit</strong>&lt;<code>K</code>&gt;(<code>eventName</code>, <code>params</code>): <code>void</code></p><h4 id="type-parameters-2" tabindex="-1"><a class="header-anchor" href="#type-parameters-2" aria-hidden="true">#</a> Type parameters</h4>',4),O=e("thead",null,[e("tr",null,[e("th",{style:{"text-align":"left"}},"Name"),e("th",{style:{"text-align":"left"}},"Type")])],-1),Q=e("td",{style:{"text-align":"left"}},[e("code",null,"K")],-1),W={style:{"text-align":"left"}},X=e("code",null,"EventKey",-1),Y=e("code",null,"ServiceEvents",-1),Z=e("h4",{id:"parameters",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#parameters","aria-hidden":"true"},"#"),t(" Parameters")],-1),$=e("thead",null,[e("tr",null,[e("th",{style:{"text-align":"left"}},"Name"),e("th",{style:{"text-align":"left"}},"Type")])],-1),ee=e("tr",null,[e("td",{style:{"text-align":"left"}},[e("code",null,"eventName")]),e("td",{style:{"text-align":"left"}},[e("code",null,"K")])],-1),te=e("td",{style:{"text-align":"left"}},[e("code",null,"params")],-1),se={style:{"text-align":"left"}},ne=e("code",null,"ServiceEvents",-1),ae=e("code",null,"K",-1),re=e("h4",{id:"returns-1",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#returns-1","aria-hidden":"true"},"#"),t(" Returns")],-1),oe=e("p",null,[e("code",null,"void")],-1),ie=e("h4",{id:"inherited-from-1",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#inherited-from-1","aria-hidden":"true"},"#"),t(" Inherited from")],-1),de=e("h4",{id:"defined-in-4",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#defined-in-4","aria-hidden":"true"},"#"),t(" Defined in")],-1),le={href:"https://github.com/sebastianwessel/purista/blob/dc1cd23/packages/core/src/core/types/GenericEventEmitter.ts#L24",target:"_blank",rel:"noopener noreferrer"},ce=o('<hr><h3 id="off" tabindex="-1"><a class="header-anchor" href="#off" aria-hidden="true">#</a> off</h3><p>\u25B8 <strong>off</strong>&lt;<code>K</code>&gt;(<code>eventName</code>, <code>fn</code>): <code>void</code></p><h4 id="type-parameters-3" tabindex="-1"><a class="header-anchor" href="#type-parameters-3" aria-hidden="true">#</a> Type parameters</h4>',4),he=e("thead",null,[e("tr",null,[e("th",{style:{"text-align":"left"}},"Name"),e("th",{style:{"text-align":"left"}},"Type")])],-1),ue=e("td",{style:{"text-align":"left"}},[e("code",null,"K")],-1),_e={style:{"text-align":"left"}},pe=e("code",null,"EventKey",-1),fe=e("code",null,"ServiceEvents",-1),me=e("h4",{id:"parameters-1",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#parameters-1","aria-hidden":"true"},"#"),t(" Parameters")],-1),ve=e("thead",null,[e("tr",null,[e("th",{style:{"text-align":"left"}},"Name"),e("th",{style:{"text-align":"left"}},"Type")])],-1),be=e("tr",null,[e("td",{style:{"text-align":"left"}},[e("code",null,"eventName")]),e("td",{style:{"text-align":"left"}},[e("code",null,"K")])],-1),ge=e("td",{style:{"text-align":"left"}},[e("code",null,"fn")],-1),ye={style:{"text-align":"left"}},xe=e("code",null,"EventReceiver",-1),Ee=e("code",null,"ServiceEvents",-1),ke=e("code",null,"K",-1),Se=e("h4",{id:"returns-2",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#returns-2","aria-hidden":"true"},"#"),t(" Returns")],-1),Ce=e("p",null,[e("code",null,"void")],-1),we=e("h4",{id:"inherited-from-2",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#inherited-from-2","aria-hidden":"true"},"#"),t(" Inherited from")],-1),Te=e("h4",{id:"defined-in-5",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#defined-in-5","aria-hidden":"true"},"#"),t(" Defined in")],-1),Ge={href:"https://github.com/sebastianwessel/purista/blob/dc1cd23/packages/core/src/core/types/GenericEventEmitter.ts#L20",target:"_blank",rel:"noopener noreferrer"},Ne=o('<hr><h3 id="on" tabindex="-1"><a class="header-anchor" href="#on" aria-hidden="true">#</a> on</h3><p>\u25B8 <strong>on</strong>&lt;<code>K</code>&gt;(<code>eventName</code>, <code>fn</code>): <code>void</code></p><h4 id="type-parameters-4" tabindex="-1"><a class="header-anchor" href="#type-parameters-4" aria-hidden="true">#</a> Type parameters</h4>',4),Ke=e("thead",null,[e("tr",null,[e("th",{style:{"text-align":"left"}},"Name"),e("th",{style:{"text-align":"left"}},"Type")])],-1),Pe=e("td",{style:{"text-align":"left"}},[e("code",null,"K")],-1),Re={style:{"text-align":"left"}},Le=e("code",null,"EventKey",-1),De=e("code",null,"ServiceEvents",-1),Ae=e("h4",{id:"parameters-2",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#parameters-2","aria-hidden":"true"},"#"),t(" Parameters")],-1),Be=e("thead",null,[e("tr",null,[e("th",{style:{"text-align":"left"}},"Name"),e("th",{style:{"text-align":"left"}},"Type")])],-1),Ie=e("tr",null,[e("td",{style:{"text-align":"left"}},[e("code",null,"eventName")]),e("td",{style:{"text-align":"left"}},[e("code",null,"K")])],-1),Ve=e("td",{style:{"text-align":"left"}},[e("code",null,"fn")],-1),Me={style:{"text-align":"left"}},He=e("code",null,"EventReceiver",-1),Ue=e("code",null,"ServiceEvents",-1),je=e("code",null,"K",-1),qe=e("h4",{id:"returns-3",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#returns-3","aria-hidden":"true"},"#"),t(" Returns")],-1),ze=e("p",null,[e("code",null,"void")],-1),Fe=e("h4",{id:"inherited-from-3",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#inherited-from-3","aria-hidden":"true"},"#"),t(" Inherited from")],-1),Je=e("h4",{id:"defined-in-6",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#defined-in-6","aria-hidden":"true"},"#"),t(" Defined in")],-1),Oe={href:"https://github.com/sebastianwessel/purista/blob/dc1cd23/packages/core/src/core/types/GenericEventEmitter.ts#L16",target:"_blank",rel:"noopener noreferrer"},Qe=o('<hr><h3 id="registercommand" tabindex="-1"><a class="header-anchor" href="#registercommand" aria-hidden="true">#</a> registerCommand</h3><p>\u25B8 <code>Protected</code> <code>Abstract</code> <strong>registerCommand</strong>(<code>command</code>): <code>void</code></p><p>Register a new command (function) for this service</p><h4 id="parameters-3" tabindex="-1"><a class="header-anchor" href="#parameters-3" aria-hidden="true">#</a> Parameters</h4>',5),We=e("thead",null,[e("tr",null,[e("th",{style:{"text-align":"left"}},"Name"),e("th",{style:{"text-align":"left"}},"Type")])],-1),Xe=e("td",{style:{"text-align":"left"}},[e("code",null,"command")],-1),Ye={style:{"text-align":"left"}},Ze=e("code",null,"CommandDefinition",-1),$e=e("code",null,"ServiceClass",-1),et=e("code",null,"unknown",-1),tt=e("code",null,"Record",-1),st=e("code",null,"string",-1),nt=e("code",null,"unknown",-1),at=e("code",null,"unknown",-1),rt=e("code",null,"unknown",-1),ot=e("code",null,"unknown",-1),it=e("code",null,"unknown",-1),dt=e("code",null,"unknown",-1),lt=e("h4",{id:"returns-4",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#returns-4","aria-hidden":"true"},"#"),t(" Returns")],-1),ct=e("p",null,[e("code",null,"void")],-1),ht=e("h4",{id:"defined-in-7",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#defined-in-7","aria-hidden":"true"},"#"),t(" Defined in")],-1),ut={href:"https://github.com/sebastianwessel/purista/blob/dc1cd23/packages/core/src/core/types/ServiceClass.ts#L45",target:"_blank",rel:"noopener noreferrer"},_t=o('<hr><h3 id="start" tabindex="-1"><a class="header-anchor" href="#start" aria-hidden="true">#</a> start</h3><p>\u25B8 <code>Abstract</code> <strong>start</strong>(): <code>Promise</code>&lt;<code>void</code>&gt;</p><h4 id="returns-5" tabindex="-1"><a class="header-anchor" href="#returns-5" aria-hidden="true">#</a> Returns</h4><p><code>Promise</code>&lt;<code>void</code>&gt;</p><h4 id="defined-in-8" tabindex="-1"><a class="header-anchor" href="#defined-in-8" aria-hidden="true">#</a> Defined in</h4>',6),pt={href:"https://github.com/sebastianwessel/purista/blob/dc1cd23/packages/core/src/core/types/ServiceClass.ts#L38",target:"_blank",rel:"noopener noreferrer"};function ft(mt,vt){const n=i("RouterLink"),r=i("ExternalLinkIcon");return l(),c("div",null,[e("p",null,[s(n,{to:"/api/"},{default:a(()=>[t("PURISTA API - v1.4.3")]),_:1}),t(" / "),s(n,{to:"/api/modules/purista_core.html"},{default:a(()=>[t("@purista/core")]),_:1}),t(" / ServiceClass")]),u,e("p",null,[s(n,{to:"/api/modules/purista_core.html"},{default:a(()=>[t("@purista/core")]),_:1}),t(".ServiceClass")]),_,e("ul",null,[e("li",null,[e("p",null,[s(n,{to:"/api/classes/purista_core.GenericEventEmitter.html"},{default:a(()=>[p]),_:1}),t("<"),s(n,{to:"/api/modules/purista_core.html#serviceevents"},{default:a(()=>[f]),_:1}),t(">")]),m,e("p",null,[t("\u21B3\u21B3 "),s(n,{to:"/api/classes/purista_core.Service.html"},{default:a(()=>[v]),_:1})])])]),b,g,e("ul",null,[e("li",null,[s(n,{to:"/api/classes/purista_core.ServiceClass.html#constructor"},{default:a(()=>[t("constructor")]),_:1})])]),y,e("ul",null,[e("li",null,[s(n,{to:"/api/classes/purista_core.ServiceClass.html#config"},{default:a(()=>[t("config")]),_:1})]),e("li",null,[s(n,{to:"/api/classes/purista_core.ServiceClass.html#eventbridge"},{default:a(()=>[t("eventBridge")]),_:1})]),e("li",null,[s(n,{to:"/api/classes/purista_core.ServiceClass.html#info"},{default:a(()=>[t("info")]),_:1})])]),x,e("ul",null,[e("li",null,[s(n,{to:"/api/classes/purista_core.ServiceClass.html#destroy"},{default:a(()=>[t("destroy")]),_:1})]),e("li",null,[s(n,{to:"/api/classes/purista_core.ServiceClass.html#emit"},{default:a(()=>[t("emit")]),_:1})]),e("li",null,[s(n,{to:"/api/classes/purista_core.ServiceClass.html#off"},{default:a(()=>[t("off")]),_:1})]),e("li",null,[s(n,{to:"/api/classes/purista_core.ServiceClass.html#on"},{default:a(()=>[t("on")]),_:1})]),e("li",null,[s(n,{to:"/api/classes/purista_core.ServiceClass.html#registercommand"},{default:a(()=>[t("registerCommand")]),_:1})]),e("li",null,[s(n,{to:"/api/classes/purista_core.ServiceClass.html#start"},{default:a(()=>[t("start")]),_:1})])]),E,e("p",null,[s(n,{to:"/api/classes/purista_core.GenericEventEmitter.html"},{default:a(()=>[t("GenericEventEmitter")]),_:1}),t("."),s(n,{to:"/api/classes/purista_core.GenericEventEmitter.html#constructor"},{default:a(()=>[t("constructor")]),_:1})]),k,e("p",null,[e("a",S,[t("core/src/core/types/ServiceClass.ts:31"),s(r)])]),C,w,e("p",null,[t("\u2022 "),T,t(),G,t(),N,t(": "),s(n,{to:"/api/classes/purista_core.EventBridge.html"},{default:a(()=>[K]),_:1})]),P,R,e("p",null,[e("a",L,[t("core/src/core/types/ServiceClass.ts:36"),s(r)])]),D,A,e("p",null,[t("\u2022 "),B,t(),I,t(),V,t(),M,t(": "),s(n,{to:"/api/modules/purista_core.html#serviceinfotype"},{default:a(()=>[H]),_:1})]),U,j,e("p",null,[e("a",q,[t("core/src/core/types/ServiceClass.ts:29"),s(r)])]),z,e("p",null,[e("a",F,[t("core/src/core/types/ServiceClass.ts:50"),s(r)])]),J,e("table",null,[O,e("tbody",null,[e("tr",null,[Q,e("td",W,[t("extends "),s(n,{to:"/api/modules/purista_core.html#eventkey"},{default:a(()=>[X]),_:1}),t("<"),s(n,{to:"/api/modules/purista_core.html#serviceevents"},{default:a(()=>[Y]),_:1}),t(">")])])])]),Z,e("table",null,[$,e("tbody",null,[ee,e("tr",null,[te,e("td",se,[s(n,{to:"/api/modules/purista_core.html#serviceevents"},{default:a(()=>[ne]),_:1}),t("["),ae,t("]")])])])]),re,oe,ie,e("p",null,[s(n,{to:"/api/classes/purista_core.GenericEventEmitter.html"},{default:a(()=>[t("GenericEventEmitter")]),_:1}),t("."),s(n,{to:"/api/classes/purista_core.GenericEventEmitter.html#emit"},{default:a(()=>[t("emit")]),_:1})]),de,e("p",null,[e("a",le,[t("core/src/core/types/GenericEventEmitter.ts:24"),s(r)])]),ce,e("table",null,[he,e("tbody",null,[e("tr",null,[ue,e("td",_e,[t("extends "),s(n,{to:"/api/modules/purista_core.html#eventkey"},{default:a(()=>[pe]),_:1}),t("<"),s(n,{to:"/api/modules/purista_core.html#serviceevents"},{default:a(()=>[fe]),_:1}),t(">")])])])]),me,e("table",null,[ve,e("tbody",null,[be,e("tr",null,[ge,e("td",ye,[s(n,{to:"/api/modules/purista_core.internal.html#eventreceiver"},{default:a(()=>[xe]),_:1}),t("<"),s(n,{to:"/api/modules/purista_core.html#serviceevents"},{default:a(()=>[Ee]),_:1}),t("["),ke,t("]>")])])])]),Se,Ce,we,e("p",null,[s(n,{to:"/api/classes/purista_core.GenericEventEmitter.html"},{default:a(()=>[t("GenericEventEmitter")]),_:1}),t("."),s(n,{to:"/api/classes/purista_core.GenericEventEmitter.html#off"},{default:a(()=>[t("off")]),_:1})]),Te,e("p",null,[e("a",Ge,[t("core/src/core/types/GenericEventEmitter.ts:20"),s(r)])]),Ne,e("table",null,[Ke,e("tbody",null,[e("tr",null,[Pe,e("td",Re,[t("extends "),s(n,{to:"/api/modules/purista_core.html#eventkey"},{default:a(()=>[Le]),_:1}),t("<"),s(n,{to:"/api/modules/purista_core.html#serviceevents"},{default:a(()=>[De]),_:1}),t(">")])])])]),Ae,e("table",null,[Be,e("tbody",null,[Ie,e("tr",null,[Ve,e("td",Me,[s(n,{to:"/api/modules/purista_core.internal.html#eventreceiver"},{default:a(()=>[He]),_:1}),t("<"),s(n,{to:"/api/modules/purista_core.html#serviceevents"},{default:a(()=>[Ue]),_:1}),t("["),je,t("]>")])])])]),qe,ze,Fe,e("p",null,[s(n,{to:"/api/classes/purista_core.GenericEventEmitter.html"},{default:a(()=>[t("GenericEventEmitter")]),_:1}),t("."),s(n,{to:"/api/classes/purista_core.GenericEventEmitter.html#on"},{default:a(()=>[t("on")]),_:1})]),Je,e("p",null,[e("a",Oe,[t("core/src/core/types/GenericEventEmitter.ts:16"),s(r)])]),Qe,e("table",null,[We,e("tbody",null,[e("tr",null,[Xe,e("td",Ye,[s(n,{to:"/api/modules/purista_core.html#commanddefinition"},{default:a(()=>[Ze]),_:1}),t("<"),s(n,{to:"/api/classes/purista_core.ServiceClass.html"},{default:a(()=>[$e]),_:1}),t("<"),et,t(">, "),tt,t("<"),st,t(", "),nt,t(">, "),at,t(", "),rt,t(", "),ot,t(", "),it,t(", "),dt,t(">")])])])]),lt,ct,ht,e("p",null,[e("a",ut,[t("core/src/core/types/ServiceClass.ts:45"),s(r)])]),_t,e("p",null,[e("a",pt,[t("core/src/core/types/ServiceClass.ts:38"),s(r)])])])}const yt=d(h,[["render",ft],["__file","purista_core.ServiceClass.html.vue"]]);export{yt as default};