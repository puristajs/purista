import{_ as s,c as t,o as e,V as i}from"./chunks/framework.ITQiifkM.js";const g=JSON.parse('{"title":"Add a Service Configuration","description":"How to add a custom service config to your PURISTA service","frontmatter":{"title":"Add a Service Configuration","description":"How to add a custom service config to your PURISTA service","order":201020},"headers":[],"relativePath":"handbook/2_building_business-logic/service/add-a-service-config.md","filePath":"handbook/2_building_business-logic/service/add-a-service-config.md","lastUpdated":1706444636000}'),a={name:"handbook/2_building_business-logic/service/add-a-service-config.md"},n=i(`<h1 id="custom-service-configuration" tabindex="-1">Custom service configuration <a class="header-anchor" href="#custom-service-configuration" aria-label="Permalink to &quot;Custom service configuration&quot;">​</a></h1><p>A custom configuration relates to your business logic and your requirements. It is not used by PURISTA itself. The custom service config will be available in all commands and subscriptions of this service via <code>this.config</code>. Custom service configurations are one option to pass configuration values to commands and subscriptions. But, you can also use stores.</p><p>Service configuration and stores addressing different data. Here is a table, that will help you to understand the differences.</p><table><thead><tr><th></th><th>custom config</th><th><a href="./../stores/config-stores.html">Config Store</a></th><th><a href="./../stores/secret-stores.html">Secret store</a></th></tr></thead><tbody><tr><td>provided/managed by</td><td>infrastructure &amp; deployment</td><td>database or vendor solution</td><td>vendor solution</td></tr><tr><td>addresses</td><td>technical configuration</td><td>business configuration</td><td>secrets &amp; confidential data</td></tr><tr><td>value</td><td>is set once, during instance creation</td><td>fetched per usage</td><td>fetched per usage</td></tr><tr><td>change effects</td><td>instance restart/next deployment</td><td>on next usage</td><td>on next usage</td></tr><tr><td>value type</td><td>object (nested)</td><td>object, string, number, boolean (key-value)</td><td>string (key-value)</td></tr><tr><td>can be set <em>(</em>)*</td><td>🛑 no</td><td>✅ yes</td><td>✅ yes</td></tr><tr><td>can be deleted <em>(</em>)*</td><td>🛑 no</td><td>✅ yes</td><td>✅ yes</td></tr><tr><td>use for confidential data</td><td>🙏🏻 please no, technically possible</td><td>🙏🏻 please no, technically possible</td><td>✅ yes</td></tr><tr><td>use cases</td><td>third-party url, ports, timeout settings</td><td>feature flag, business data like currency exchange values</td><td>passwords, auth tokens, certificates</td></tr></tbody></table><p><em>(*)</em> by commands and subscriptions</p><p>For a custom configuration, you must define a <a href="https://zod.dev" target="_blank" rel="noreferrer">zod schema</a>. Example:</p><div class="language-typescript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">typescript</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">export</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> userServiceV1ConfigSchema</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> z.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">object</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">({</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  myOption: z.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">string</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">().</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">optional</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">})</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">export</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> type</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> UserServiceV1Config</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> z</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">input</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">typeof</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> userServiceV1ConfigSchema&gt;</span></span></code></pre></div><p>As you can see, in the example a string option entry <code>myOption</code> is added. This field is marked as optional. Because of this, in the generated type <code>UserServiceV1Config</code>, the <code>myOption</code> is also optional.</p><p>Now, in the builder file <code>userV1ServiceBuilder.ts</code> in the same directory, typescript will complain on <code>.setDefaultConfig({})</code>. Setting the default configuration, requires to set all root fields of the default configuration. The optional flag, only relates to the input, when you create a service instance and provide a service configuration.</p><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>PURISTA follows the pattern, to always have default values, which can be overwritten, but only when there is a actual need for it.</p></div><p>Because of this, you need to change it in the builder file <code>userV1ServiceBuilder.ts</code>.</p><div class="language-typescript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">typescript</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">export</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> userV1ServiceBuilder</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> new</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> ServiceBuilder</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(userServiceInfo)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  .</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">setConfigSchema</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(userServiceV1ConfigSchema)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  .</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">setDefaultConfig</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">({</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    myOption: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;something&#39;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  })</span></span></code></pre></div><div class="warning custom-block"><p class="custom-block-title">Be aware</p><p>PURISTA does not deep merge configurations! If you have nested configurations, you should be aware of.</p></div>`,13),o=[n];function d(r,l,p,c,h,k){return e(),t("div",null,o)}const y=s(a,[["render",d]]);export{g as __pageData,y as default};