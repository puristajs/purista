import{_ as i}from"./plugin-vue_export-helper-c27b6911.js";import{r as l,o as c,c as d,b as e,e as a,w as r,d as t,a as n}from"./app-c21e84c1.js";const h={},u=e("h1",{id:"class-defaultsecretstore",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#class-defaultsecretstore","aria-hidden":"true"},"#"),t(" Class: DefaultSecretStore")],-1),p=n(`<p>The DefaultSecretStore is a placeholder which offers all needed methods. Getters and setters will throw a UnhandledError with status <code>Unauthorized</code>, when a disabled operation is called.</p><p>For development and testing purpose, you can initiate the store with values.</p><p><strong><code>Example</code></strong></p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token keyword">const</span> store <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">DefaultSecretStore</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
 config<span class="token operator">:</span> <span class="token punctuation">{</span>
   secretOne<span class="token operator">:</span> <span class="token string">&#39;my_secret_one_value&#39;</span><span class="token punctuation">,</span>
   secretTwo<span class="token operator">:</span> <span class="token string">&#39;my_secret_two_value&#39;</span><span class="token punctuation">,</span>
 <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token keyword">await</span> store<span class="token punctuation">.</span><span class="token function">getSecret</span><span class="token punctuation">(</span><span class="token string">&#39;secretOne&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;secretTwo) // outputs: { secretOne: my_secret_one_value, secretTwo: &#39;</span>my_secret_two_value&#39; <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Per default, setting/changing and removal of values are disabled. You can enable it on instance creation:</p><p><strong><code>Example</code></strong></p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token keyword">const</span> store <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">DefaultSecretStore</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
 enableGet<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
 enableRemove<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
 enableSet<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="hierarchy" tabindex="-1"><a class="header-anchor" href="#hierarchy" aria-hidden="true">#</a> Hierarchy</h2>`,8),f=e("code",null,"SecretStoreBaseClass",-1),_=e("code",null,"DefaultSecretStoreConfig",-1),m=e("p",null,[t("↳ "),e("strong",null,[e("code",null,"DefaultSecretStore")])],-1),g=e("h2",{id:"implements",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#implements","aria-hidden":"true"},"#"),t(" Implements")],-1),S=e("code",null,"SecretStore",-1),b=e("h2",{id:"table-of-contents",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#table-of-contents","aria-hidden":"true"},"#"),t(" Table of contents")],-1),x=e("h3",{id:"constructors",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#constructors","aria-hidden":"true"},"#"),t(" Constructors")],-1),y=e("h3",{id:"properties",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#properties","aria-hidden":"true"},"#"),t(" Properties")],-1),v=e("h3",{id:"methods",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#methods","aria-hidden":"true"},"#"),t(" Methods")],-1),k=n('<h2 id="constructors-1" tabindex="-1"><a class="header-anchor" href="#constructors-1" aria-hidden="true">#</a> Constructors</h2><h3 id="constructor" tabindex="-1"><a class="header-anchor" href="#constructor" aria-hidden="true">#</a> constructor</h3><p>• <strong>new DefaultSecretStore</strong>(<code>config?</code>)</p><h4 id="parameters" tabindex="-1"><a class="header-anchor" href="#parameters" aria-hidden="true">#</a> Parameters</h4>',4),D=e("thead",null,[e("tr",null,[e("th",{style:{"text-align":"left"}},"Name"),e("th",{style:{"text-align":"left"}},"Type"),e("th",{style:{"text-align":"left"}},"Description")])],-1),C=e("tr",null,[e("td",{style:{"text-align":"left"}},[e("code",null,"config?")]),e("td",{style:{"text-align":"left"}},[e("code",null,"Object")]),e("td",{style:{"text-align":"left"}},"-")],-1),B=e("tr",null,[e("td",{style:{"text-align":"left"}},[e("code",null,"config.enableGet?")]),e("td",{style:{"text-align":"left"}},[e("code",null,"boolean")]),e("td",{style:{"text-align":"left"}},"Enable generally get method")],-1),w=e("tr",null,[e("td",{style:{"text-align":"left"}},[e("code",null,"config.enableRemove?")]),e("td",{style:{"text-align":"left"}},[e("code",null,"boolean")]),e("td",{style:{"text-align":"left"}},"Enable generally remove method")],-1),L=e("tr",null,[e("td",{style:{"text-align":"left"}},[e("code",null,"config.enableSet?")]),e("td",{style:{"text-align":"left"}},[e("code",null,"boolean")]),e("td",{style:{"text-align":"left"}},"Enable generally set method")],-1),P=e("td",{style:{"text-align":"left"}},[e("code",null,"config.logLevel?")],-1),N={style:{"text-align":"left"}},I=e("code",null,"LogLevelName",-1),T=e("td",{style:{"text-align":"left"}},"A log level for new logger if logger is not set",-1),E=e("td",{style:{"text-align":"left"}},[e("code",null,"config.logger?")],-1),R={style:{"text-align":"left"}},O=e("code",null,"Logger",-1),A=e("td",{style:{"text-align":"left"}},"A logger instance",-1),V=e("h4",{id:"overrides",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#overrides","aria-hidden":"true"},"#"),t(" Overrides")],-1),G=e("h4",{id:"defined-in",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#defined-in","aria-hidden":"true"},"#"),t(" Defined in")],-1),M={href:"https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultSecretStore/DefaultSecretStore.impl.ts#L35",target:"_blank",rel:"noopener noreferrer"},U=n('<h2 id="properties-1" tabindex="-1"><a class="header-anchor" href="#properties-1" aria-hidden="true">#</a> Properties</h2><h3 id="config" tabindex="-1"><a class="header-anchor" href="#config" aria-hidden="true">#</a> config</h3><p>• <strong>config</strong>: <code>Object</code></p><h4 id="type-declaration" tabindex="-1"><a class="header-anchor" href="#type-declaration" aria-hidden="true">#</a> Type declaration</h4>',4),j=e("thead",null,[e("tr",null,[e("th",{style:{"text-align":"left"}},"Name"),e("th",{style:{"text-align":"left"}},"Type"),e("th",{style:{"text-align":"left"}},"Description")])],-1),z=e("tr",null,[e("td",{style:{"text-align":"left"}},[e("code",null,"enableGet?")]),e("td",{style:{"text-align":"left"}},[e("code",null,"boolean")]),e("td",{style:{"text-align":"left"}},"Enable generally get method")],-1),F=e("tr",null,[e("td",{style:{"text-align":"left"}},[e("code",null,"enableRemove?")]),e("td",{style:{"text-align":"left"}},[e("code",null,"boolean")]),e("td",{style:{"text-align":"left"}},"Enable generally remove method")],-1),H=e("tr",null,[e("td",{style:{"text-align":"left"}},[e("code",null,"enableSet?")]),e("td",{style:{"text-align":"left"}},[e("code",null,"boolean")]),e("td",{style:{"text-align":"left"}},"Enable generally set method")],-1),Y=e("td",{style:{"text-align":"left"}},[e("code",null,"logLevel?")],-1),q={style:{"text-align":"left"}},J=e("code",null,"LogLevelName",-1),K=e("td",{style:{"text-align":"left"}},"A log level for new logger if logger is not set",-1),Q=e("td",{style:{"text-align":"left"}},[e("code",null,"logger?")],-1),W={style:{"text-align":"left"}},X=e("code",null,"Logger",-1),Z=e("td",{style:{"text-align":"left"}},"A logger instance",-1),$=e("h4",{id:"inherited-from",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#inherited-from","aria-hidden":"true"},"#"),t(" Inherited from")],-1),ee=e("h4",{id:"defined-in-1",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#defined-in-1","aria-hidden":"true"},"#"),t(" Defined in")],-1),te={href:"https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts#L13",target:"_blank",rel:"noopener noreferrer"},ae=e("hr",null,null,-1),se=e("h3",{id:"logger",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#logger","aria-hidden":"true"},"#"),t(" logger")],-1),re=e("strong",null,"logger",-1),oe=e("code",null,"Logger",-1),ne=e("h4",{id:"inherited-from-1",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#inherited-from-1","aria-hidden":"true"},"#"),t(" Inherited from")],-1),le=e("h4",{id:"defined-in-2",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#defined-in-2","aria-hidden":"true"},"#"),t(" Defined in")],-1),ie={href:"https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts#L12",target:"_blank",rel:"noopener noreferrer"},ce=n('<hr><h3 id="map" tabindex="-1"><a class="header-anchor" href="#map" aria-hidden="true">#</a> map</h3><p>• <code>Private</code> <strong>map</strong>: <code>Map</code>&lt;<code>string</code>, <code>string</code>&gt;</p><h4 id="defined-in-3" tabindex="-1"><a class="header-anchor" href="#defined-in-3" aria-hidden="true">#</a> Defined in</h4>',4),de={href:"https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultSecretStore/DefaultSecretStore.impl.ts#L34",target:"_blank",rel:"noopener noreferrer"},he=e("hr",null,null,-1),ue=e("h3",{id:"name",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#name","aria-hidden":"true"},"#"),t(" name")],-1),pe=e("p",null,[t("• "),e("strong",null,"name"),t(": "),e("code",null,"string")],-1),fe=e("p",null,"name of store",-1),_e=e("h4",{id:"implementation-of",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#implementation-of","aria-hidden":"true"},"#"),t(" Implementation of")],-1),me=e("h4",{id:"inherited-from-2",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#inherited-from-2","aria-hidden":"true"},"#"),t(" Inherited from")],-1),ge=e("h4",{id:"defined-in-4",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#defined-in-4","aria-hidden":"true"},"#"),t(" Defined in")],-1),Se={href:"https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts#L15",target:"_blank",rel:"noopener noreferrer"},be=n('<h2 id="methods-1" tabindex="-1"><a class="header-anchor" href="#methods-1" aria-hidden="true">#</a> Methods</h2><h3 id="destroy" tabindex="-1"><a class="header-anchor" href="#destroy" aria-hidden="true">#</a> destroy</h3><p>▸ <strong>destroy</strong>(): <code>Promise</code>&lt;<code>void</code>&gt;</p><p>disconnects and shuts down the secret store</p><h4 id="returns" tabindex="-1"><a class="header-anchor" href="#returns" aria-hidden="true">#</a> Returns</h4><p><code>Promise</code>&lt;<code>void</code>&gt;</p><h4 id="implementation-of-1" tabindex="-1"><a class="header-anchor" href="#implementation-of-1" aria-hidden="true">#</a> Implementation of</h4>',7),xe=e("h4",{id:"inherited-from-3",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#inherited-from-3","aria-hidden":"true"},"#"),t(" Inherited from")],-1),ye=e("h4",{id:"defined-in-5",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#defined-in-5","aria-hidden":"true"},"#"),t(" Defined in")],-1),ve={href:"https://github.com/sebastianwessel/purista/blob/master/packages/core/src/core/SecretStore/SecretStoreBaseClass.impl.ts#L67",target:"_blank",rel:"noopener noreferrer"},ke=n('<hr><h3 id="getsecret" tabindex="-1"><a class="header-anchor" href="#getsecret" aria-hidden="true">#</a> getSecret</h3><p>▸ <strong>getSecret</strong>(<code>...secretNames</code>): <code>Promise</code>&lt;<code>Record</code>&lt;<code>string</code>, <code>undefined</code> | <code>string</code>&gt;&gt;</p><h4 id="parameters-1" tabindex="-1"><a class="header-anchor" href="#parameters-1" aria-hidden="true">#</a> Parameters</h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th></tr></thead><tbody><tr><td style="text-align:left;"><code>...secretNames</code></td><td style="text-align:left;"><code>string</code>[]</td></tr></tbody></table><h4 id="returns-1" tabindex="-1"><a class="header-anchor" href="#returns-1" aria-hidden="true">#</a> Returns</h4><p><code>Promise</code>&lt;<code>Record</code>&lt;<code>string</code>, <code>undefined</code> | <code>string</code>&gt;&gt;</p><h4 id="implementation-of-2" tabindex="-1"><a class="header-anchor" href="#implementation-of-2" aria-hidden="true">#</a> Implementation of</h4><p>SecretStore.getSecret</p><h4 id="overrides-1" tabindex="-1"><a class="header-anchor" href="#overrides-1" aria-hidden="true">#</a> Overrides</h4>',10),De=e("h4",{id:"defined-in-6",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#defined-in-6","aria-hidden":"true"},"#"),t(" Defined in")],-1),Ce={href:"https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultSecretStore/DefaultSecretStore.impl.ts#L45",target:"_blank",rel:"noopener noreferrer"},Be=n('<hr><h3 id="removesecret" tabindex="-1"><a class="header-anchor" href="#removesecret" aria-hidden="true">#</a> removeSecret</h3><p>▸ <strong>removeSecret</strong>(<code>secretName</code>): <code>Promise</code>&lt;<code>void</code>&gt;</p><h4 id="parameters-2" tabindex="-1"><a class="header-anchor" href="#parameters-2" aria-hidden="true">#</a> Parameters</h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th></tr></thead><tbody><tr><td style="text-align:left;"><code>secretName</code></td><td style="text-align:left;"><code>string</code></td></tr></tbody></table><h4 id="returns-2" tabindex="-1"><a class="header-anchor" href="#returns-2" aria-hidden="true">#</a> Returns</h4><p><code>Promise</code>&lt;<code>void</code>&gt;</p><h4 id="implementation-of-3" tabindex="-1"><a class="header-anchor" href="#implementation-of-3" aria-hidden="true">#</a> Implementation of</h4><p>SecretStore.removeSecret</p><h4 id="overrides-2" tabindex="-1"><a class="header-anchor" href="#overrides-2" aria-hidden="true">#</a> Overrides</h4>',10),we=e("h4",{id:"defined-in-7",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#defined-in-7","aria-hidden":"true"},"#"),t(" Defined in")],-1),Le={href:"https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultSecretStore/DefaultSecretStore.impl.ts#L65",target:"_blank",rel:"noopener noreferrer"},Pe=n('<hr><h3 id="setsecret" tabindex="-1"><a class="header-anchor" href="#setsecret" aria-hidden="true">#</a> setSecret</h3><p>▸ <strong>setSecret</strong>(<code>secretName</code>, <code>secretValue</code>): <code>Promise</code>&lt;<code>void</code>&gt;</p><h4 id="parameters-3" tabindex="-1"><a class="header-anchor" href="#parameters-3" aria-hidden="true">#</a> Parameters</h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th></tr></thead><tbody><tr><td style="text-align:left;"><code>secretName</code></td><td style="text-align:left;"><code>string</code></td></tr><tr><td style="text-align:left;"><code>secretValue</code></td><td style="text-align:left;"><code>string</code></td></tr></tbody></table><h4 id="returns-3" tabindex="-1"><a class="header-anchor" href="#returns-3" aria-hidden="true">#</a> Returns</h4><p><code>Promise</code>&lt;<code>void</code>&gt;</p><h4 id="implementation-of-4" tabindex="-1"><a class="header-anchor" href="#implementation-of-4" aria-hidden="true">#</a> Implementation of</h4><p>SecretStore.setSecret</p><h4 id="overrides-3" tabindex="-1"><a class="header-anchor" href="#overrides-3" aria-hidden="true">#</a> Overrides</h4>',10),Ne=e("h4",{id:"defined-in-8",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#defined-in-8","aria-hidden":"true"},"#"),t(" Defined in")],-1),Ie={href:"https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultSecretStore/DefaultSecretStore.impl.ts#L57",target:"_blank",rel:"noopener noreferrer"};function Te(Ee,Re){const s=l("RouterLink"),o=l("ExternalLinkIcon");return c(),d("div",null,[e("p",null,[a(s,{to:"/api/"},{default:r(()=>[t("PURISTA API")]),_:1}),t(" / "),a(s,{to:"/api/modules.html"},{default:r(()=>[t("Modules")]),_:1}),t(" / "),a(s,{to:"/api/modules/purista_core.html"},{default:r(()=>[t("@purista/core")]),_:1}),t(" / DefaultSecretStore")]),u,e("p",null,[a(s,{to:"/api/modules/purista_core.html"},{default:r(()=>[t("@purista/core")]),_:1}),t(".DefaultSecretStore")]),p,e("ul",null,[e("li",null,[e("p",null,[a(s,{to:"/api/classes/purista_core.SecretStoreBaseClass.html"},{default:r(()=>[f]),_:1}),t("<"),a(s,{to:"/api/modules/purista_core.html#defaultsecretstoreconfig"},{default:r(()=>[_]),_:1}),t(">")]),m])]),g,e("ul",null,[e("li",null,[a(s,{to:"/api/interfaces/purista_core.SecretStore.html"},{default:r(()=>[S]),_:1})])]),b,x,e("ul",null,[e("li",null,[a(s,{to:"/api/classes/purista_core.DefaultSecretStore.html#constructor"},{default:r(()=>[t("constructor")]),_:1})])]),y,e("ul",null,[e("li",null,[a(s,{to:"/api/classes/purista_core.DefaultSecretStore.html#config"},{default:r(()=>[t("config")]),_:1})]),e("li",null,[a(s,{to:"/api/classes/purista_core.DefaultSecretStore.html#logger"},{default:r(()=>[t("logger")]),_:1})]),e("li",null,[a(s,{to:"/api/classes/purista_core.DefaultSecretStore.html#map"},{default:r(()=>[t("map")]),_:1})]),e("li",null,[a(s,{to:"/api/classes/purista_core.DefaultSecretStore.html#name"},{default:r(()=>[t("name")]),_:1})])]),v,e("ul",null,[e("li",null,[a(s,{to:"/api/classes/purista_core.DefaultSecretStore.html#destroy"},{default:r(()=>[t("destroy")]),_:1})]),e("li",null,[a(s,{to:"/api/classes/purista_core.DefaultSecretStore.html#getsecret"},{default:r(()=>[t("getSecret")]),_:1})]),e("li",null,[a(s,{to:"/api/classes/purista_core.DefaultSecretStore.html#removesecret"},{default:r(()=>[t("removeSecret")]),_:1})]),e("li",null,[a(s,{to:"/api/classes/purista_core.DefaultSecretStore.html#setsecret"},{default:r(()=>[t("setSecret")]),_:1})])]),k,e("table",null,[D,e("tbody",null,[C,B,w,L,e("tr",null,[P,e("td",N,[a(s,{to:"/api/modules/purista_core.html#loglevelname"},{default:r(()=>[I]),_:1})]),T]),e("tr",null,[E,e("td",R,[a(s,{to:"/api/classes/purista_core.Logger.html"},{default:r(()=>[O]),_:1})]),A])])]),V,e("p",null,[a(s,{to:"/api/classes/purista_core.SecretStoreBaseClass.html"},{default:r(()=>[t("SecretStoreBaseClass")]),_:1}),t("."),a(s,{to:"/api/classes/purista_core.SecretStoreBaseClass.html#constructor"},{default:r(()=>[t("constructor")]),_:1})]),G,e("p",null,[e("a",M,[t("DefaultSecretStore/DefaultSecretStore.impl.ts:35"),a(o)])]),U,e("table",null,[j,e("tbody",null,[z,F,H,e("tr",null,[Y,e("td",q,[a(s,{to:"/api/modules/purista_core.html#loglevelname"},{default:r(()=>[J]),_:1})]),K]),e("tr",null,[Q,e("td",W,[a(s,{to:"/api/classes/purista_core.Logger.html"},{default:r(()=>[X]),_:1})]),Z])])]),$,e("p",null,[a(s,{to:"/api/classes/purista_core.SecretStoreBaseClass.html"},{default:r(()=>[t("SecretStoreBaseClass")]),_:1}),t("."),a(s,{to:"/api/classes/purista_core.SecretStoreBaseClass.html#config"},{default:r(()=>[t("config")]),_:1})]),ee,e("p",null,[e("a",te,[t("core/SecretStore/SecretStoreBaseClass.impl.ts:13"),a(o)])]),ae,se,e("p",null,[t("• "),re,t(": "),a(s,{to:"/api/classes/purista_core.Logger.html"},{default:r(()=>[oe]),_:1})]),ne,e("p",null,[a(s,{to:"/api/classes/purista_core.SecretStoreBaseClass.html"},{default:r(()=>[t("SecretStoreBaseClass")]),_:1}),t("."),a(s,{to:"/api/classes/purista_core.SecretStoreBaseClass.html#logger"},{default:r(()=>[t("logger")]),_:1})]),le,e("p",null,[e("a",ie,[t("core/SecretStore/SecretStoreBaseClass.impl.ts:12"),a(o)])]),ce,e("p",null,[e("a",de,[t("DefaultSecretStore/DefaultSecretStore.impl.ts:34"),a(o)])]),he,ue,pe,fe,_e,e("p",null,[a(s,{to:"/api/interfaces/purista_core.SecretStore.html"},{default:r(()=>[t("SecretStore")]),_:1}),t("."),a(s,{to:"/api/interfaces/purista_core.SecretStore.html#name"},{default:r(()=>[t("name")]),_:1})]),me,e("p",null,[a(s,{to:"/api/classes/purista_core.SecretStoreBaseClass.html"},{default:r(()=>[t("SecretStoreBaseClass")]),_:1}),t("."),a(s,{to:"/api/classes/purista_core.SecretStoreBaseClass.html#name"},{default:r(()=>[t("name")]),_:1})]),ge,e("p",null,[e("a",Se,[t("core/SecretStore/SecretStoreBaseClass.impl.ts:15"),a(o)])]),be,e("p",null,[a(s,{to:"/api/interfaces/purista_core.SecretStore.html"},{default:r(()=>[t("SecretStore")]),_:1}),t("."),a(s,{to:"/api/interfaces/purista_core.SecretStore.html#destroy"},{default:r(()=>[t("destroy")]),_:1})]),xe,e("p",null,[a(s,{to:"/api/classes/purista_core.SecretStoreBaseClass.html"},{default:r(()=>[t("SecretStoreBaseClass")]),_:1}),t("."),a(s,{to:"/api/classes/purista_core.SecretStoreBaseClass.html#destroy"},{default:r(()=>[t("destroy")]),_:1})]),ye,e("p",null,[e("a",ve,[t("core/SecretStore/SecretStoreBaseClass.impl.ts:67"),a(o)])]),ke,e("p",null,[a(s,{to:"/api/classes/purista_core.SecretStoreBaseClass.html"},{default:r(()=>[t("SecretStoreBaseClass")]),_:1}),t("."),a(s,{to:"/api/classes/purista_core.SecretStoreBaseClass.html#getsecret"},{default:r(()=>[t("getSecret")]),_:1})]),De,e("p",null,[e("a",Ce,[t("DefaultSecretStore/DefaultSecretStore.impl.ts:45"),a(o)])]),Be,e("p",null,[a(s,{to:"/api/classes/purista_core.SecretStoreBaseClass.html"},{default:r(()=>[t("SecretStoreBaseClass")]),_:1}),t("."),a(s,{to:"/api/classes/purista_core.SecretStoreBaseClass.html#removesecret"},{default:r(()=>[t("removeSecret")]),_:1})]),we,e("p",null,[e("a",Le,[t("DefaultSecretStore/DefaultSecretStore.impl.ts:65"),a(o)])]),Pe,e("p",null,[a(s,{to:"/api/classes/purista_core.SecretStoreBaseClass.html"},{default:r(()=>[t("SecretStoreBaseClass")]),_:1}),t("."),a(s,{to:"/api/classes/purista_core.SecretStoreBaseClass.html#setsecret"},{default:r(()=>[t("setSecret")]),_:1})]),Ne,e("p",null,[e("a",Ie,[t("DefaultSecretStore/DefaultSecretStore.impl.ts:57"),a(o)])])])}const Ve=i(h,[["render",Te],["__file","purista_core.DefaultSecretStore.html.vue"]]);export{Ve as default};