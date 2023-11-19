import{_ as c}from"./plugin-vue_export-helper-x3n3nnut.js";import{r as o,o as d,c as r,b as t,e as n,w as l,d as e,a as i}from"./app-aQ4vLSXI.js";const p={},u=t("h1",{id:"module-purista-infisical-secret-store",tabindex:"-1"},[t("a",{class:"header-anchor",href:"#module-purista-infisical-secret-store","aria-hidden":"true"},"#"),e(" Module: @purista/infisical-secret-store")],-1),h={href:"https://infisical.com/",target:"_blank",rel:"noopener noreferrer"},f=i(`<p>For performance reasons, and to reduce costs, the secret values are cached in memory after first fetch.</p><p>You can disable the whole caching via config by setting enableCache to false.<br> If the cache is enabled, you can set the ttl for cached secret values via config cacheTtl (in ms).</p><p>This will return the cached secret if available and if ttl is not exceeded.<br> If a secret value exceeds the ttl, it does not automatically get removed from cache.<br> It will be removed/overwritten on next get request.</p><p><strong><code>Example</code></strong></p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token keyword">const</span> config <span class="token operator">=</span> <span class="token punctuation">{</span>
  bearerToken<span class="token operator">:</span> <span class="token string">&#39;YOUR_INFISICAL_TOKEN&#39;</span><span class="token punctuation">,</span>
  baseUrl<span class="token operator">:</span> <span class="token string">&#39;https://app.infisical.com&#39;</span>
<span class="token punctuation">}</span>

<span class="token keyword">const</span> store <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">InfisicalSecretStore</span><span class="token punctuation">(</span><span class="token punctuation">{</span> config <span class="token punctuation">}</span><span class="token punctuation">)</span>

<span class="token keyword">await</span> store<span class="token punctuation">.</span><span class="token function">setSecret</span><span class="token punctuation">(</span><span class="token string">&#39;mySecret&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;value&#39;</span><span class="token punctuation">)</span>

<span class="token keyword">let</span> value <span class="token operator">=</span> <span class="token keyword">await</span> store<span class="token punctuation">.</span><span class="token function">getSecret</span><span class="token punctuation">(</span><span class="token string">&#39;mySecret&#39;</span><span class="token punctuation">)</span>
<span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span> <span class="token comment">// outputs: { mySecret: &#39;value&#39; }</span>

<span class="token keyword">await</span> store<span class="token punctuation">.</span><span class="token function">removeSecret</span><span class="token punctuation">(</span><span class="token string">&#39;mySecret&#39;</span><span class="token punctuation">)</span>

value <span class="token operator">=</span> <span class="token keyword">await</span> store<span class="token punctuation">.</span><span class="token function">getSecret</span><span class="token punctuation">(</span><span class="token string">&#39;mySecret&#39;</span><span class="token punctuation">)</span>
<span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span> <span class="token comment">// outputs: undefined</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="table-of-contents" tabindex="-1"><a class="header-anchor" href="#table-of-contents" aria-hidden="true">#</a> Table of contents</h2><h3 id="classes" tabindex="-1"><a class="header-anchor" href="#classes" aria-hidden="true">#</a> Classes</h3>`,7),g=t("h3",{id:"type-aliases",tabindex:"-1"},[t("a",{class:"header-anchor",href:"#type-aliases","aria-hidden":"true"},"#"),e(" Type Aliases")],-1),_=t("h2",{id:"type-aliases-1",tabindex:"-1"},[t("a",{class:"header-anchor",href:"#type-aliases-1","aria-hidden":"true"},"#"),e(" Type Aliases")],-1),y=t("h3",{id:"clientconfig",tabindex:"-1"},[t("a",{class:"header-anchor",href:"#clientconfig","aria-hidden":"true"},"#"),e(" ClientConfig")],-1),x=t("strong",null,"ClientConfig",-1),m=t("code",null,"Prettify",-1),b=t("code",null,"Required",-1),k=t("code",null,"Pick",-1),C=t("code",null,"HttpClientConfig",-1),v=t("code",null,"HttpClientConfigCustom",-1),I=t("code",null,'"bearerToken"',-1),S=t("code",null,"Omit",-1),w=t("code",null,"HttpClientConfig",-1),T=t("code",null,"HttpClientConfigCustom",-1),D=t("code",null,'"bearerToken"',-1),N=t("h4",{id:"defined-in",tabindex:"-1"},[t("a",{class:"header-anchor",href:"#defined-in","aria-hidden":"true"},"#"),e(" Defined in")],-1),L={href:"https://github.com/sebastianwessel/purista/blob/master/packages/infisical-secret-store/src/InfisicalClient/types/ClientConfig.ts#L5",target:"_blank",rel:"noopener noreferrer"},A=i('<hr><h3 id="decryptinput" tabindex="-1"><a class="header-anchor" href="#decryptinput" aria-hidden="true">#</a> DecryptInput</h3><p>Ƭ <strong>DecryptInput</strong>: <code>Object</code></p><h4 id="type-declaration" tabindex="-1"><a class="header-anchor" href="#type-declaration" aria-hidden="true">#</a> Type declaration</h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th></tr></thead><tbody><tr><td style="text-align:left;"><code>ciphertext</code></td><td style="text-align:left;"><code>string</code></td></tr><tr><td style="text-align:left;"><code>iv</code></td><td style="text-align:left;"><code>string</code></td></tr><tr><td style="text-align:left;"><code>secret</code></td><td style="text-align:left;"><code>string</code></td></tr><tr><td style="text-align:left;"><code>tag</code></td><td style="text-align:left;"><code>string</code></td></tr></tbody></table><h4 id="defined-in-1" tabindex="-1"><a class="header-anchor" href="#defined-in-1" aria-hidden="true">#</a> Defined in</h4>',6),E={href:"https://github.com/sebastianwessel/purista/blob/master/packages/infisical-secret-store/src/InfisicalClient/types/DecryptInput.ts#L1",target:"_blank",rel:"noopener noreferrer"},V=i('<hr><h3 id="encryptinput" tabindex="-1"><a class="header-anchor" href="#encryptinput" aria-hidden="true">#</a> EncryptInput</h3><p>Ƭ <strong>EncryptInput</strong>: <code>Object</code></p><h4 id="type-declaration-1" tabindex="-1"><a class="header-anchor" href="#type-declaration-1" aria-hidden="true">#</a> Type declaration</h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th></tr></thead><tbody><tr><td style="text-align:left;"><code>secret</code></td><td style="text-align:left;"><code>string</code></td></tr><tr><td style="text-align:left;"><code>text</code></td><td style="text-align:left;"><code>string</code></td></tr></tbody></table><h4 id="defined-in-2" tabindex="-1"><a class="header-anchor" href="#defined-in-2" aria-hidden="true">#</a> Defined in</h4>',6),O={href:"https://github.com/sebastianwessel/purista/blob/master/packages/infisical-secret-store/src/InfisicalClient/types/EncryptInput.ts#L1",target:"_blank",rel:"noopener noreferrer"},H=t("hr",null,null,-1),j=t("h3",{id:"httpclientconfigcustom",tabindex:"-1"},[t("a",{class:"header-anchor",href:"#httpclientconfigcustom","aria-hidden":"true"},"#"),e(" HttpClientConfigCustom")],-1),q=t("p",null,[e("Ƭ "),t("strong",null,"HttpClientConfigCustom"),e(": "),t("code",null,"Object")],-1),K=t("h4",{id:"defined-in-3",tabindex:"-1"},[t("a",{class:"header-anchor",href:"#defined-in-3","aria-hidden":"true"},"#"),e(" Defined in")],-1),P={href:"https://github.com/sebastianwessel/purista/blob/master/packages/infisical-secret-store/src/InfisicalClient/types/ClientConfig.ts#L3",target:"_blank",rel:"noopener noreferrer"},R=t("hr",null,null,-1),M=t("h3",{id:"infisicalsecretconfig",tabindex:"-1"},[t("a",{class:"header-anchor",href:"#infisicalsecretconfig","aria-hidden":"true"},"#"),e(" InfisicalSecretConfig")],-1),U=t("strong",null,"InfisicalSecretConfig",-1),B=t("code",null,"ClientConfig",-1),F=t("h4",{id:"defined-in-4",tabindex:"-1"},[t("a",{class:"header-anchor",href:"#defined-in-4","aria-hidden":"true"},"#"),e(" Defined in")],-1),Y={href:"https://github.com/sebastianwessel/purista/blob/master/packages/infisical-secret-store/src/types.ts#L3",target:"_blank",rel:"noopener noreferrer"},z=i('<hr><h3 id="scope" tabindex="-1"><a class="header-anchor" href="#scope" aria-hidden="true">#</a> Scope</h3><p>Ƭ <strong>Scope</strong>: <code>Object</code></p><h4 id="type-declaration-2" tabindex="-1"><a class="header-anchor" href="#type-declaration-2" aria-hidden="true">#</a> Type declaration</h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th></tr></thead><tbody><tr><td style="text-align:left;"><code>_id</code></td><td style="text-align:left;"><code>string</code></td></tr><tr><td style="text-align:left;"><code>environment</code></td><td style="text-align:left;"><code>string</code></td></tr><tr><td style="text-align:left;"><code>secretPath</code></td><td style="text-align:left;"><code>string</code></td></tr></tbody></table><h4 id="defined-in-5" tabindex="-1"><a class="header-anchor" href="#defined-in-5" aria-hidden="true">#</a> Defined in</h4>',6),G={href:"https://github.com/sebastianwessel/purista/blob/master/packages/infisical-secret-store/src/InfisicalClient/types/Scope.ts#L1",target:"_blank",rel:"noopener noreferrer"},J=i('<hr><h3 id="secret" tabindex="-1"><a class="header-anchor" href="#secret" aria-hidden="true">#</a> Secret</h3><p>Ƭ <strong>Secret</strong>: <code>Object</code></p><h4 id="type-declaration-3" tabindex="-1"><a class="header-anchor" href="#type-declaration-3" aria-hidden="true">#</a> Type declaration</h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th></tr></thead><tbody><tr><td style="text-align:left;"><code>_id</code></td><td style="text-align:left;"><code>string</code></td></tr><tr><td style="text-align:left;"><code>createdAt</code></td><td style="text-align:left;"><code>string</code></td></tr><tr><td style="text-align:left;"><code>environment</code></td><td style="text-align:left;"><code>string</code></td></tr><tr><td style="text-align:left;"><code>secretCommentCiphertext?</code></td><td style="text-align:left;"><code>string</code></td></tr><tr><td style="text-align:left;"><code>secretCommentIV?</code></td><td style="text-align:left;"><code>string</code></td></tr><tr><td style="text-align:left;"><code>secretCommentTag?</code></td><td style="text-align:left;"><code>string</code></td></tr><tr><td style="text-align:left;"><code>secretKeyCiphertext</code></td><td style="text-align:left;"><code>string</code></td></tr><tr><td style="text-align:left;"><code>secretKeyIV</code></td><td style="text-align:left;"><code>string</code></td></tr><tr><td style="text-align:left;"><code>secretKeyTag</code></td><td style="text-align:left;"><code>string</code></td></tr><tr><td style="text-align:left;"><code>secretValueCiphertext</code></td><td style="text-align:left;"><code>string</code></td></tr><tr><td style="text-align:left;"><code>secretValueIV</code></td><td style="text-align:left;"><code>string</code></td></tr><tr><td style="text-align:left;"><code>secretValueTag</code></td><td style="text-align:left;"><code>string</code></td></tr><tr><td style="text-align:left;"><code>type</code></td><td style="text-align:left;"><code>&quot;shared&quot;</code> | <code>&quot;personal&quot;</code></td></tr><tr><td style="text-align:left;"><code>updatedAt</code></td><td style="text-align:left;"><code>string</code></td></tr><tr><td style="text-align:left;"><code>user?</code></td><td style="text-align:left;"><code>string</code></td></tr><tr><td style="text-align:left;"><code>version</code></td><td style="text-align:left;"><code>number</code></td></tr><tr><td style="text-align:left;"><code>workspace</code></td><td style="text-align:left;"><code>string</code></td></tr></tbody></table><h4 id="defined-in-6" tabindex="-1"><a class="header-anchor" href="#defined-in-6" aria-hidden="true">#</a> Defined in</h4>',6),Q={href:"https://github.com/sebastianwessel/purista/blob/master/packages/infisical-secret-store/src/InfisicalClient/types/Secret.ts#L1",target:"_blank",rel:"noopener noreferrer"},W=t("hr",null,null,-1),X=t("h3",{id:"tokendata",tabindex:"-1"},[t("a",{class:"header-anchor",href:"#tokendata","aria-hidden":"true"},"#"),e(" TokenData")],-1),Z=t("p",null,[e("Ƭ "),t("strong",null,"TokenData"),e(": "),t("code",null,"Object")],-1),$=t("h4",{id:"type-declaration-4",tabindex:"-1"},[t("a",{class:"header-anchor",href:"#type-declaration-4","aria-hidden":"true"},"#"),e(" Type declaration")],-1),tt=t("thead",null,[t("tr",null,[t("th",{style:{"text-align":"left"}},"Name"),t("th",{style:{"text-align":"left"}},"Type")])],-1),et=t("tr",null,[t("td",{style:{"text-align":"left"}},[t("code",null,"_id")]),t("td",{style:{"text-align":"left"}},[t("code",null,"string")])],-1),nt=t("tr",null,[t("td",{style:{"text-align":"left"}},[t("code",null,"createdAt")]),t("td",{style:{"text-align":"left"}},[t("code",null,"string")])],-1),st=t("tr",null,[t("td",{style:{"text-align":"left"}},[t("code",null,"encryptedKey")]),t("td",{style:{"text-align":"left"}},[t("code",null,"string")])],-1),lt=t("tr",null,[t("td",{style:{"text-align":"left"}},[t("code",null,"expiresAt")]),t("td",{style:{"text-align":"left"}},[t("code",null,"Date")])],-1),at=t("tr",null,[t("td",{style:{"text-align":"left"}},[t("code",null,"iv")]),t("td",{style:{"text-align":"left"}},[t("code",null,"string")])],-1),it=t("tr",null,[t("td",{style:{"text-align":"left"}},[t("code",null,"lastUsed")]),t("td",{style:{"text-align":"left"}},[t("code",null,"Date")])],-1),ot=t("tr",null,[t("td",{style:{"text-align":"left"}},[t("code",null,"name")]),t("td",{style:{"text-align":"left"}},[t("code",null,"string")])],-1),ct=t("tr",null,[t("td",{style:{"text-align":"left"}},[t("code",null,"permissions")]),t("td",{style:{"text-align":"left"}},[t("code",null,"string"),e("[]")])],-1),dt=t("td",{style:{"text-align":"left"}},[t("code",null,"scopes")],-1),rt={style:{"text-align":"left"}},pt=t("code",null,"Scope",-1),ut=t("tr",null,[t("td",{style:{"text-align":"left"}},[t("code",null,"serviceAccount")]),t("td",{style:{"text-align":"left"}},[t("code",null,"string")])],-1),ht=t("tr",null,[t("td",{style:{"text-align":"left"}},[t("code",null,"tag")]),t("td",{style:{"text-align":"left"}},[t("code",null,"string")])],-1),ft=t("tr",null,[t("td",{style:{"text-align":"left"}},[t("code",null,"updatedAt")]),t("td",{style:{"text-align":"left"}},[t("code",null,"string")])],-1),gt=t("tr",null,[t("td",{style:{"text-align":"left"}},[t("code",null,"user")]),t("td",{style:{"text-align":"left"}},[e("{ "),t("code",null,"_id"),e(": "),t("code",null,"string"),e(" ; "),t("code",null,"authMethods"),e(": "),t("code",null,"string"),e("[] ; "),t("code",null,"email"),e(": "),t("code",null,"string"),e(" ; "),t("code",null,"firstName"),e(": "),t("code",null,"string"),e(" ; "),t("code",null,"lastName"),e(": "),t("code",null,"string"),e(" }")])],-1),_t=t("tr",null,[t("td",{style:{"text-align":"left"}},[t("code",null,"user._id")]),t("td",{style:{"text-align":"left"}},[t("code",null,"string")])],-1),yt=t("tr",null,[t("td",{style:{"text-align":"left"}},[t("code",null,"user.authMethods")]),t("td",{style:{"text-align":"left"}},[t("code",null,"string"),e("[]")])],-1),xt=t("tr",null,[t("td",{style:{"text-align":"left"}},[t("code",null,"user.email")]),t("td",{style:{"text-align":"left"}},[t("code",null,"string")])],-1),mt=t("tr",null,[t("td",{style:{"text-align":"left"}},[t("code",null,"user.firstName")]),t("td",{style:{"text-align":"left"}},[t("code",null,"string")])],-1),bt=t("tr",null,[t("td",{style:{"text-align":"left"}},[t("code",null,"user.lastName")]),t("td",{style:{"text-align":"left"}},[t("code",null,"string")])],-1),kt=t("tr",null,[t("td",{style:{"text-align":"left"}},[t("code",null,"workspace")]),t("td",{style:{"text-align":"left"}},[t("code",null,"string")])],-1),Ct=t("h4",{id:"defined-in-7",tabindex:"-1"},[t("a",{class:"header-anchor",href:"#defined-in-7","aria-hidden":"true"},"#"),e(" Defined in")],-1),vt={href:"https://github.com/sebastianwessel/purista/blob/master/packages/infisical-secret-store/src/InfisicalClient/types/TokenData.ts#L3",target:"_blank",rel:"noopener noreferrer"};function It(St,wt){const s=o("RouterLink"),a=o("ExternalLinkIcon");return d(),r("div",null,[t("p",null,[n(s,{to:"/api/"},{default:l(()=>[e("PURISTA API")]),_:1}),e(" / "),n(s,{to:"/api/modules.html"},{default:l(()=>[e("Modules")]),_:1}),e(" / @purista/infisical-secret-store")]),u,t("p",null,[e("A secret store for using "),t("a",h,[e("Infisical"),n(a)]),e(" as storage.")]),f,t("ul",null,[t("li",null,[n(s,{to:"/api/classes/purista_infisical_secret_store.InfisicalClient.html"},{default:l(()=>[e("InfisicalClient")]),_:1})]),t("li",null,[n(s,{to:"/api/classes/purista_infisical_secret_store.InfisicalSecretStore.html"},{default:l(()=>[e("InfisicalSecretStore")]),_:1})])]),g,t("ul",null,[t("li",null,[n(s,{to:"/api/modules/purista_infisical_secret_store.html#clientconfig"},{default:l(()=>[e("ClientConfig")]),_:1})]),t("li",null,[n(s,{to:"/api/modules/purista_infisical_secret_store.html#decryptinput"},{default:l(()=>[e("DecryptInput")]),_:1})]),t("li",null,[n(s,{to:"/api/modules/purista_infisical_secret_store.html#encryptinput"},{default:l(()=>[e("EncryptInput")]),_:1})]),t("li",null,[n(s,{to:"/api/modules/purista_infisical_secret_store.html#httpclientconfigcustom"},{default:l(()=>[e("HttpClientConfigCustom")]),_:1})]),t("li",null,[n(s,{to:"/api/modules/purista_infisical_secret_store.html#infisicalsecretconfig"},{default:l(()=>[e("InfisicalSecretConfig")]),_:1})]),t("li",null,[n(s,{to:"/api/modules/purista_infisical_secret_store.html#scope"},{default:l(()=>[e("Scope")]),_:1})]),t("li",null,[n(s,{to:"/api/modules/purista_infisical_secret_store.html#secret"},{default:l(()=>[e("Secret")]),_:1})]),t("li",null,[n(s,{to:"/api/modules/purista_infisical_secret_store.html#tokendata"},{default:l(()=>[e("TokenData")]),_:1})])]),_,y,t("p",null,[e("Ƭ "),x,e(": "),m,e("<"),b,e("<"),k,e("<"),C,e("<"),n(s,{to:"/api/modules/purista_infisical_secret_store.html#httpclientconfigcustom"},{default:l(()=>[v]),_:1}),e(">, "),I,e(">> & "),S,e("<"),w,e("<"),n(s,{to:"/api/modules/purista_infisical_secret_store.html#httpclientconfigcustom"},{default:l(()=>[T]),_:1}),e(">, "),D,e(">>")]),N,t("p",null,[t("a",L,[e("infisical-secret-store/src/InfisicalClient/types/ClientConfig.ts:5"),n(a)])]),A,t("p",null,[t("a",E,[e("infisical-secret-store/src/InfisicalClient/types/DecryptInput.ts:1"),n(a)])]),V,t("p",null,[t("a",O,[e("infisical-secret-store/src/InfisicalClient/types/EncryptInput.ts:1"),n(a)])]),H,j,q,K,t("p",null,[t("a",P,[e("infisical-secret-store/src/InfisicalClient/types/ClientConfig.ts:3"),n(a)])]),R,M,t("p",null,[e("Ƭ "),U,e(": "),n(s,{to:"/api/modules/purista_infisical_secret_store.html#clientconfig"},{default:l(()=>[B]),_:1})]),F,t("p",null,[t("a",Y,[e("infisical-secret-store/src/types.ts:3"),n(a)])]),z,t("p",null,[t("a",G,[e("infisical-secret-store/src/InfisicalClient/types/Scope.ts:1"),n(a)])]),J,t("p",null,[t("a",Q,[e("infisical-secret-store/src/InfisicalClient/types/Secret.ts:1"),n(a)])]),W,X,Z,$,t("table",null,[tt,t("tbody",null,[et,nt,st,lt,at,it,ot,ct,t("tr",null,[dt,t("td",rt,[n(s,{to:"/api/modules/purista_infisical_secret_store.html#scope"},{default:l(()=>[pt]),_:1}),e("[]")])]),ut,ht,ft,gt,_t,yt,xt,mt,bt,kt])]),Ct,t("p",null,[t("a",vt,[e("infisical-secret-store/src/InfisicalClient/types/TokenData.ts:3"),n(a)])])])}const Nt=c(p,[["render",It],["__file","purista_infisical_secret_store.html.vue"]]);export{Nt as default};