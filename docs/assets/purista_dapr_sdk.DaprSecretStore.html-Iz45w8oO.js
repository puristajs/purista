import{_ as o}from"./plugin-vue_export-helper-x3n3nnut.js";import{r as n,o as i,c,b as e,e as r,w as l,d as t,a as s}from"./app-aQ4vLSXI.js";const h={},p=e("h1",{id:"class-daprsecretstore",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#class-daprsecretstore","aria-hidden":"true"},"#"),t(" Class: DaprSecretStore")],-1),u=e("p",null,"DaprSecretStore is an adapter which connects to the secret store provided by the underlaying Dapr infrastructure.",-1),f=e("p",null,"Dapr currently provides only the possibility to fetch a secret. Creating a new secret, changing an existing secret or removal of secrets is not supported.",-1),g=e("h2",{id:"hierarchy",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#hierarchy","aria-hidden":"true"},"#"),t(" Hierarchy")],-1),_=e("code",null,"SecretStoreBaseClass",-1),m=e("code",null,"DaprSecretStoreConfig",-1),S=e("p",null,[t("↳ "),e("strong",null,[e("code",null,"DaprSecretStore")])],-1),x=e("h2",{id:"table-of-contents",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#table-of-contents","aria-hidden":"true"},"#"),t(" Table of contents")],-1),b=e("h3",{id:"constructors",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#constructors","aria-hidden":"true"},"#"),t(" Constructors")],-1),y=e("h3",{id:"properties",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#properties","aria-hidden":"true"},"#"),t(" Properties")],-1),D=e("h3",{id:"methods",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#methods","aria-hidden":"true"},"#"),t(" Methods")],-1),k=e("h2",{id:"constructors-1",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#constructors-1","aria-hidden":"true"},"#"),t(" Constructors")],-1),v=e("h3",{id:"constructor",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#constructor","aria-hidden":"true"},"#"),t(" constructor")],-1),C=e("strong",null,"new DaprSecretStore",-1),N=e("code",null,"config?",-1),B=e("code",null,"DaprSecretStore",-1),L=e("h4",{id:"parameters",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#parameters","aria-hidden":"true"},"#"),t(" Parameters")],-1),P=e("thead",null,[e("tr",null,[e("th",{style:{"text-align":"left"}},"Name"),e("th",{style:{"text-align":"left"}},"Type"),e("th",{style:{"text-align":"left"}},"Description")])],-1),T=e("tr",null,[e("td",{style:{"text-align":"left"}},[e("code",null,"config?")]),e("td",{style:{"text-align":"left"}},[e("code",null,"Object")]),e("td",{style:{"text-align":"left"}},"-")],-1),w=e("tr",null,[e("td",{style:{"text-align":"left"}},[e("code",null,"config.cacheTtl?")]),e("td",{style:{"text-align":"left"}},[e("code",null,"number")]),e("td",{style:{"text-align":"left"}},"Cache time to live in ms")],-1),R=e("td",{style:{"text-align":"left"}},[e("code",null,"config.clientConfig?")],-1),E={style:{"text-align":"left"}},I=e("code",null,"DaprClientConfig",-1),O=e("td",{style:{"text-align":"left"}},"The Dapr client config to interact with Dapr sidecar",-1),A=e("tr",null,[e("td",{style:{"text-align":"left"}},[e("code",null,"config.enableCache?")]),e("td",{style:{"text-align":"left"}},[e("code",null,"boolean")]),e("td",{style:{"text-align":"left"}},"Enable cache")],-1),M=e("tr",null,[e("td",{style:{"text-align":"left"}},[e("code",null,"config.enableGet?")]),e("td",{style:{"text-align":"left"}},[e("code",null,"boolean")]),e("td",{style:{"text-align":"left"}},"Enable generally get method")],-1),V=e("tr",null,[e("td",{style:{"text-align":"left"}},[e("code",null,"config.enableRemove?")]),e("td",{style:{"text-align":"left"}},[e("code",null,"boolean")]),e("td",{style:{"text-align":"left"}},"Enable generally remove method")],-1),j=e("tr",null,[e("td",{style:{"text-align":"left"}},[e("code",null,"config.enableSet?")]),e("td",{style:{"text-align":"left"}},[e("code",null,"boolean")]),e("td",{style:{"text-align":"left"}},"Enable generally set method")],-1),G=e("tr",null,[e("td",{style:{"text-align":"left"}},[e("code",null,"config.logLevel?")]),e("td",{style:{"text-align":"left"}},[e("code",null,"LogLevelName")]),e("td",{style:{"text-align":"left"}},"A log level for new logger if logger is not set")],-1),H=e("tr",null,[e("td",{style:{"text-align":"left"}},[e("code",null,"config.logger?")]),e("td",{style:{"text-align":"left"}},[e("code",null,"Logger")]),e("td",{style:{"text-align":"left"}},"A logger instance")],-1),U=e("tr",null,[e("td",{style:{"text-align":"left"}},[e("code",null,"config.metadata?")]),e("td",{style:{"text-align":"left"}},[e("code",null,"Object")]),e("td",{style:{"text-align":"left"}},"Dapr secret store metadata")],-1),q=e("tr",null,[e("td",{style:{"text-align":"left"}},[e("code",null,"config.metadata.namespace?")]),e("td",{style:{"text-align":"left"}},[e("code",null,"string")]),e("td",{style:{"text-align":"left"}},"In case of deploying into namespace other than default, the namespace (e.g. production) must be set")],-1),z=e("tr",null,[e("td",{style:{"text-align":"left"}},[e("code",null,"config.secretStoreName?")]),e("td",{style:{"text-align":"left"}},[e("code",null,"string")]),e("td",{style:{"text-align":"left"}},"The name of the secret store")],-1),F=e("h4",{id:"returns",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#returns","aria-hidden":"true"},"#"),t(" Returns")],-1),J=e("code",null,"DaprSecretStore",-1),K=e("h4",{id:"overrides",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#overrides","aria-hidden":"true"},"#"),t(" Overrides")],-1),Q=e("p",null,"SecretStoreBaseClass&lt;DaprSecretStoreConfig&gt;.constructor",-1),W=e("h4",{id:"defined-in",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#defined-in","aria-hidden":"true"},"#"),t(" Defined in")],-1),X={href:"https://github.com/sebastianwessel/purista/blob/master/packages/dapr-sdk/src/DaprSecretStore/DaprSecretStore.impl.ts#L19",target:"_blank",rel:"noopener noreferrer"},Y=s('<h2 id="properties-1" tabindex="-1"><a class="header-anchor" href="#properties-1" aria-hidden="true">#</a> Properties</h2><h3 id="cache" tabindex="-1"><a class="header-anchor" href="#cache" aria-hidden="true">#</a> cache</h3><p>• <strong>cache</strong>: <code>SecretStoreCacheMap</code></p><h4 id="inherited-from" tabindex="-1"><a class="header-anchor" href="#inherited-from" aria-hidden="true">#</a> Inherited from</h4><p>SecretStoreBaseClass.cache</p><h4 id="defined-in-1" tabindex="-1"><a class="header-anchor" href="#defined-in-1" aria-hidden="true">#</a> Defined in</h4><p>core/lib/types/core/SecretStore/SecretStoreBaseClass.impl.d.ts:12</p><hr><h3 id="client" tabindex="-1"><a class="header-anchor" href="#client" aria-hidden="true">#</a> client</h3>',9),Z=e("code",null,"Private",-1),$=e("strong",null,"client",-1),ee=e("code",null,"HttpClient",-1),te=e("code",null,"DaprClientConfig",-1),re=e("h4",{id:"defined-in-2",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#defined-in-2","aria-hidden":"true"},"#"),t(" Defined in")],-1),ae={href:"https://github.com/sebastianwessel/purista/blob/master/packages/dapr-sdk/src/DaprSecretStore/DaprSecretStore.impl.ts#L17",target:"_blank",rel:"noopener noreferrer"},le=e("hr",null,null,-1),de=e("h3",{id:"config",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#config","aria-hidden":"true"},"#"),t(" config")],-1),se=e("p",null,[t("• "),e("strong",null,"config"),t(": "),e("code",null,"Object")],-1),ne=e("h4",{id:"type-declaration",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#type-declaration","aria-hidden":"true"},"#"),t(" Type declaration")],-1),oe=e("thead",null,[e("tr",null,[e("th",{style:{"text-align":"left"}},"Name"),e("th",{style:{"text-align":"left"}},"Type"),e("th",{style:{"text-align":"left"}},"Description")])],-1),ie=e("tr",null,[e("td",{style:{"text-align":"left"}},[e("code",null,"cacheTtl?")]),e("td",{style:{"text-align":"left"}},[e("code",null,"number")]),e("td",{style:{"text-align":"left"}},"Cache time to live in ms")],-1),ce=e("td",{style:{"text-align":"left"}},[e("code",null,"clientConfig?")],-1),he={style:{"text-align":"left"}},pe=e("code",null,"DaprClientConfig",-1),ue=e("td",{style:{"text-align":"left"}},"The Dapr client config to interact with Dapr sidecar",-1),fe=e("tr",null,[e("td",{style:{"text-align":"left"}},[e("code",null,"enableCache?")]),e("td",{style:{"text-align":"left"}},[e("code",null,"boolean")]),e("td",{style:{"text-align":"left"}},"Enable cache")],-1),ge=e("tr",null,[e("td",{style:{"text-align":"left"}},[e("code",null,"enableGet?")]),e("td",{style:{"text-align":"left"}},[e("code",null,"boolean")]),e("td",{style:{"text-align":"left"}},"Enable generally get method")],-1),_e=e("tr",null,[e("td",{style:{"text-align":"left"}},[e("code",null,"enableRemove?")]),e("td",{style:{"text-align":"left"}},[e("code",null,"boolean")]),e("td",{style:{"text-align":"left"}},"Enable generally remove method")],-1),me=e("tr",null,[e("td",{style:{"text-align":"left"}},[e("code",null,"enableSet?")]),e("td",{style:{"text-align":"left"}},[e("code",null,"boolean")]),e("td",{style:{"text-align":"left"}},"Enable generally set method")],-1),Se=e("tr",null,[e("td",{style:{"text-align":"left"}},[e("code",null,"logLevel?")]),e("td",{style:{"text-align":"left"}},[e("code",null,"LogLevelName")]),e("td",{style:{"text-align":"left"}},"A log level for new logger if logger is not set")],-1),xe=e("tr",null,[e("td",{style:{"text-align":"left"}},[e("code",null,"logger?")]),e("td",{style:{"text-align":"left"}},[e("code",null,"Logger")]),e("td",{style:{"text-align":"left"}},"A logger instance")],-1),be=e("tr",null,[e("td",{style:{"text-align":"left"}},[e("code",null,"metadata?")]),e("td",{style:{"text-align":"left"}},[t("{ "),e("code",null,"namespace?"),t(": "),e("code",null,"string"),t(" }")]),e("td",{style:{"text-align":"left"}},"Dapr secret store metadata")],-1),ye=e("tr",null,[e("td",{style:{"text-align":"left"}},[e("code",null,"metadata.namespace?")]),e("td",{style:{"text-align":"left"}},[e("code",null,"string")]),e("td",{style:{"text-align":"left"}},"In case of deploying into namespace other than default, the namespace (e.g. production) must be set")],-1),De=e("tr",null,[e("td",{style:{"text-align":"left"}},[e("code",null,"secretStoreName?")]),e("td",{style:{"text-align":"left"}},[e("code",null,"string")]),e("td",{style:{"text-align":"left"}},"The name of the secret store")],-1),ke=s('<h4 id="inherited-from-1" tabindex="-1"><a class="header-anchor" href="#inherited-from-1" aria-hidden="true">#</a> Inherited from</h4><p>SecretStoreBaseClass.config</p><h4 id="defined-in-3" tabindex="-1"><a class="header-anchor" href="#defined-in-3" aria-hidden="true">#</a> Defined in</h4><p>core/lib/types/core/SecretStore/SecretStoreBaseClass.impl.d.ts:10</p><hr><h3 id="logger" tabindex="-1"><a class="header-anchor" href="#logger" aria-hidden="true">#</a> logger</h3><p>• <strong>logger</strong>: <code>Logger</code></p><h4 id="inherited-from-2" tabindex="-1"><a class="header-anchor" href="#inherited-from-2" aria-hidden="true">#</a> Inherited from</h4><p>SecretStoreBaseClass.logger</p><h4 id="defined-in-4" tabindex="-1"><a class="header-anchor" href="#defined-in-4" aria-hidden="true">#</a> Defined in</h4><p>core/lib/types/core/SecretStore/SecretStoreBaseClass.impl.d.ts:9</p><hr><h3 id="name" tabindex="-1"><a class="header-anchor" href="#name" aria-hidden="true">#</a> name</h3><p>• <strong>name</strong>: <code>string</code></p><h4 id="inherited-from-3" tabindex="-1"><a class="header-anchor" href="#inherited-from-3" aria-hidden="true">#</a> Inherited from</h4><p>SecretStoreBaseClass.name</p><h4 id="defined-in-5" tabindex="-1"><a class="header-anchor" href="#defined-in-5" aria-hidden="true">#</a> Defined in</h4><p>core/lib/types/core/SecretStore/SecretStoreBaseClass.impl.d.ts:11</p><h2 id="methods-1" tabindex="-1"><a class="header-anchor" href="#methods-1" aria-hidden="true">#</a> Methods</h2><h3 id="destroy" tabindex="-1"><a class="header-anchor" href="#destroy" aria-hidden="true">#</a> destroy</h3><p>▸ <strong>destroy</strong>(): <code>Promise</code>&lt;<code>void</code>&gt;</p><h4 id="returns-1" tabindex="-1"><a class="header-anchor" href="#returns-1" aria-hidden="true">#</a> Returns</h4><p><code>Promise</code>&lt;<code>void</code>&gt;</p><h4 id="inherited-from-4" tabindex="-1"><a class="header-anchor" href="#inherited-from-4" aria-hidden="true">#</a> Inherited from</h4><p>SecretStoreBaseClass.destroy</p><h4 id="defined-in-6" tabindex="-1"><a class="header-anchor" href="#defined-in-6" aria-hidden="true">#</a> Defined in</h4><p>core/lib/types/core/SecretStore/SecretStoreBaseClass.impl.d.ts:17</p><hr><h3 id="getsecret" tabindex="-1"><a class="header-anchor" href="#getsecret" aria-hidden="true">#</a> getSecret</h3><p>▸ <strong>getSecret</strong>(<code>...secretNames</code>): <code>Promise</code>&lt;<code>Record</code>&lt;<code>string</code>, <code>string</code>&gt;&gt;</p><h4 id="parameters-1" tabindex="-1"><a class="header-anchor" href="#parameters-1" aria-hidden="true">#</a> Parameters</h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th></tr></thead><tbody><tr><td style="text-align:left;"><code>...secretNames</code></td><td style="text-align:left;"><code>string</code>[]</td></tr></tbody></table><h4 id="returns-2" tabindex="-1"><a class="header-anchor" href="#returns-2" aria-hidden="true">#</a> Returns</h4><p><code>Promise</code>&lt;<code>Record</code>&lt;<code>string</code>, <code>string</code>&gt;&gt;</p><h4 id="overrides-1" tabindex="-1"><a class="header-anchor" href="#overrides-1" aria-hidden="true">#</a> Overrides</h4><p>SecretStoreBaseClass.getSecret</p><h4 id="defined-in-7" tabindex="-1"><a class="header-anchor" href="#defined-in-7" aria-hidden="true">#</a> Defined in</h4>',37),ve={href:"https://github.com/sebastianwessel/purista/blob/master/packages/dapr-sdk/src/DaprSecretStore/DaprSecretStore.impl.ts#L54",target:"_blank",rel:"noopener noreferrer"},Ce=s('<hr><h3 id="removesecret" tabindex="-1"><a class="header-anchor" href="#removesecret" aria-hidden="true">#</a> removeSecret</h3><p>▸ <strong>removeSecret</strong>(<code>_secretName</code>): <code>Promise</code>&lt;<code>void</code>&gt;</p><h4 id="parameters-2" tabindex="-1"><a class="header-anchor" href="#parameters-2" aria-hidden="true">#</a> Parameters</h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th></tr></thead><tbody><tr><td style="text-align:left;"><code>_secretName</code></td><td style="text-align:left;"><code>string</code></td></tr></tbody></table><h4 id="returns-3" tabindex="-1"><a class="header-anchor" href="#returns-3" aria-hidden="true">#</a> Returns</h4><p><code>Promise</code>&lt;<code>void</code>&gt;</p><h4 id="overrides-2" tabindex="-1"><a class="header-anchor" href="#overrides-2" aria-hidden="true">#</a> Overrides</h4><p>SecretStoreBaseClass.removeSecret</p><h4 id="defined-in-8" tabindex="-1"><a class="header-anchor" href="#defined-in-8" aria-hidden="true">#</a> Defined in</h4>',10),Ne={href:"https://github.com/sebastianwessel/purista/blob/master/packages/dapr-sdk/src/DaprSecretStore/DaprSecretStore.impl.ts#L98",target:"_blank",rel:"noopener noreferrer"},Be=s('<hr><h3 id="setsecret" tabindex="-1"><a class="header-anchor" href="#setsecret" aria-hidden="true">#</a> setSecret</h3><p>▸ <strong>setSecret</strong>(<code>_secretName</code>): <code>Promise</code>&lt;<code>void</code>&gt;</p><h4 id="parameters-3" tabindex="-1"><a class="header-anchor" href="#parameters-3" aria-hidden="true">#</a> Parameters</h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th></tr></thead><tbody><tr><td style="text-align:left;"><code>_secretName</code></td><td style="text-align:left;"><code>string</code></td></tr></tbody></table><h4 id="returns-4" tabindex="-1"><a class="header-anchor" href="#returns-4" aria-hidden="true">#</a> Returns</h4><p><code>Promise</code>&lt;<code>void</code>&gt;</p><h4 id="overrides-3" tabindex="-1"><a class="header-anchor" href="#overrides-3" aria-hidden="true">#</a> Overrides</h4><p>SecretStoreBaseClass.setSecret</p><h4 id="defined-in-9" tabindex="-1"><a class="header-anchor" href="#defined-in-9" aria-hidden="true">#</a> Defined in</h4>',10),Le={href:"https://github.com/sebastianwessel/purista/blob/master/packages/dapr-sdk/src/DaprSecretStore/DaprSecretStore.impl.ts#L90",target:"_blank",rel:"noopener noreferrer"};function Pe(Te,we){const a=n("RouterLink"),d=n("ExternalLinkIcon");return i(),c("div",null,[e("p",null,[r(a,{to:"/api/"},{default:l(()=>[t("PURISTA API")]),_:1}),t(" / "),r(a,{to:"/api/modules.html"},{default:l(()=>[t("Modules")]),_:1}),t(" / "),r(a,{to:"/api/modules/purista_dapr_sdk.html"},{default:l(()=>[t("@purista/dapr-sdk")]),_:1}),t(" / DaprSecretStore")]),p,e("p",null,[r(a,{to:"/api/modules/purista_dapr_sdk.html"},{default:l(()=>[t("@purista/dapr-sdk")]),_:1}),t(".DaprSecretStore")]),u,f,g,e("ul",null,[e("li",null,[e("p",null,[_,t("<"),r(a,{to:"/api/modules/purista_dapr_sdk.html#daprsecretstoreconfig"},{default:l(()=>[m]),_:1}),t(">")]),S])]),x,b,e("ul",null,[e("li",null,[r(a,{to:"/api/classes/purista_dapr_sdk.DaprSecretStore.html#constructor"},{default:l(()=>[t("constructor")]),_:1})])]),y,e("ul",null,[e("li",null,[r(a,{to:"/api/classes/purista_dapr_sdk.DaprSecretStore.html#cache"},{default:l(()=>[t("cache")]),_:1})]),e("li",null,[r(a,{to:"/api/classes/purista_dapr_sdk.DaprSecretStore.html#client"},{default:l(()=>[t("client")]),_:1})]),e("li",null,[r(a,{to:"/api/classes/purista_dapr_sdk.DaprSecretStore.html#config"},{default:l(()=>[t("config")]),_:1})]),e("li",null,[r(a,{to:"/api/classes/purista_dapr_sdk.DaprSecretStore.html#logger"},{default:l(()=>[t("logger")]),_:1})]),e("li",null,[r(a,{to:"/api/classes/purista_dapr_sdk.DaprSecretStore.html#name"},{default:l(()=>[t("name")]),_:1})])]),D,e("ul",null,[e("li",null,[r(a,{to:"/api/classes/purista_dapr_sdk.DaprSecretStore.html#destroy"},{default:l(()=>[t("destroy")]),_:1})]),e("li",null,[r(a,{to:"/api/classes/purista_dapr_sdk.DaprSecretStore.html#getsecret"},{default:l(()=>[t("getSecret")]),_:1})]),e("li",null,[r(a,{to:"/api/classes/purista_dapr_sdk.DaprSecretStore.html#removesecret"},{default:l(()=>[t("removeSecret")]),_:1})]),e("li",null,[r(a,{to:"/api/classes/purista_dapr_sdk.DaprSecretStore.html#setsecret"},{default:l(()=>[t("setSecret")]),_:1})])]),k,v,e("p",null,[t("• "),C,t("("),N,t("): "),r(a,{to:"/api/classes/purista_dapr_sdk.DaprSecretStore.html"},{default:l(()=>[B]),_:1})]),L,e("table",null,[P,e("tbody",null,[T,w,e("tr",null,[R,e("td",E,[r(a,{to:"/api/modules/purista_dapr_sdk.html#daprclientconfig"},{default:l(()=>[I]),_:1})]),O]),A,M,V,j,G,H,U,q,z])]),F,e("p",null,[r(a,{to:"/api/classes/purista_dapr_sdk.DaprSecretStore.html"},{default:l(()=>[J]),_:1})]),K,Q,W,e("p",null,[e("a",X,[t("dapr-sdk/src/DaprSecretStore/DaprSecretStore.impl.ts:19"),r(d)])]),Y,e("p",null,[t("• "),Z,t(),$,t(": "),ee,t("<"),r(a,{to:"/api/modules/purista_dapr_sdk.html#daprclientconfig"},{default:l(()=>[te]),_:1}),t(">")]),re,e("p",null,[e("a",ae,[t("dapr-sdk/src/DaprSecretStore/DaprSecretStore.impl.ts:17"),r(d)])]),le,de,se,ne,e("table",null,[oe,e("tbody",null,[ie,e("tr",null,[ce,e("td",he,[r(a,{to:"/api/modules/purista_dapr_sdk.html#daprclientconfig"},{default:l(()=>[pe]),_:1})]),ue]),fe,ge,_e,me,Se,xe,be,ye,De])]),ke,e("p",null,[e("a",ve,[t("dapr-sdk/src/DaprSecretStore/DaprSecretStore.impl.ts:54"),r(d)])]),Ce,e("p",null,[e("a",Ne,[t("dapr-sdk/src/DaprSecretStore/DaprSecretStore.impl.ts:98"),r(d)])]),Be,e("p",null,[e("a",Le,[t("dapr-sdk/src/DaprSecretStore/DaprSecretStore.impl.ts:90"),r(d)])])])}const Ie=o(h,[["render",Pe],["__file","purista_dapr_sdk.DaprSecretStore.html.vue"]]);export{Ie as default};