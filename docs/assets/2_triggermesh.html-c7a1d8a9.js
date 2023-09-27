import{_ as t}from"./plugin-vue_export-helper-c27b6911.js";import{r as o,o as p,c as i,b as s,d as n,e as a,a as r}from"./app-84f9f5da.js";const c={},l={href:"https://www.triggermesh.com",target:"_blank",rel:"noopener noreferrer"},u=s("br",null,null,-1),d=r(`<p>So, why is TRIGGER__MESH__ interesting?<br> It allows integrating third party solutions or to connect different sources. The transform function allows a simple mapping of events to PURISTA message format. This means there is no need to develop the own adapters, which are running as 24/7 instance, with the need to administrate and maintain.</p><p>Connecting to different sources or targets can be moved to the infrastructure layer and custom code is reduced to simple transform functions.</p><p>As an example, here the AWS Event Bridge event is transformed to have a PURISTA message compatible payload:</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token keyword">async</span> <span class="token punctuation">(</span>event<span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> timestamp <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Date</span><span class="token punctuation">(</span>event<span class="token punctuation">.</span>time<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getTime</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span>

  <span class="token keyword">const</span> message <span class="token operator">=</span> <span class="token punctuation">{</span>
    id<span class="token operator">:</span> event<span class="token punctuation">.</span>id<span class="token punctuation">,</span>
    instanceId<span class="token operator">:</span> <span class="token string">&#39;&#39;</span><span class="token punctuation">,</span>
    timestamp<span class="token punctuation">,</span>
    contentType<span class="token operator">:</span> <span class="token string">&#39;application/json&#39;</span><span class="token punctuation">,</span>
    contentEncoding<span class="token operator">:</span> <span class="token string">&#39;utf-8&#39;</span><span class="token punctuation">,</span>
    messageType<span class="token operator">:</span> <span class="token string">&#39;customMessage&#39;</span><span class="token punctuation">,</span>
    eventName<span class="token operator">:</span> <span class="token string">&#39;custom-event-name&#39;</span><span class="token punctuation">,</span>
    principalId<span class="token operator">:</span> account<span class="token punctuation">,</span>
    sender<span class="token operator">:</span> <span class="token punctuation">{</span>
      serviceName<span class="token operator">:</span> event<span class="token punctuation">.</span>source<span class="token punctuation">.</span>source<span class="token punctuation">,</span>
      serviceVersion<span class="token operator">:</span> event<span class="token punctuation">.</span>version<span class="token punctuation">,</span>
      serviceTarget<span class="token operator">:</span> event<span class="token punctuation">.</span>detail<span class="token operator">-</span>type
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    payload<span class="token operator">:</span> event<span class="token punctuation">.</span>detail
  <span class="token punctuation">}</span>

  event<span class="token punctuation">.</span>detail <span class="token operator">=</span> message

  <span class="token keyword">return</span> event<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,4),v={href:"https://www.triggermesh.com",target:"_blank",rel:"noopener noreferrer"},m={href:"https://twitter.com/purista_js",target:"_blank",rel:"noopener noreferrer"},k={href:"https://discord.gg/9feaUm3H2v",target:"_blank",rel:"noopener noreferrer"};function g(_,h){const e=o("ExternalLinkIcon");return p(),i("div",null,[s("p",null,[s("a",l,[n("TRIGGER__MESH__"),a(e)]),n(" is a very interesting project."),u,n(" Currently, no software SDK's are provided to directly connect to TRIGGER__MESH__ from a typescript program. Because of this, there is currently no direct PURISTA integration planned.")]),d,s("p",null,[s("strong",null,[n("see "),s("a",v,[n("TRIGGERMESH"),a(e)])])]),s("p",null,[s("strong",null,[n("You can follow updated on Twitter "),s("a",m,[n("@purista_js"),a(e)]),n(" or join the "),s("a",k,[n("Discord server"),a(e)]),n(" to get in touch with PURISTA maintainers and other developers.")])])])}const w=t(c,[["render",g],["__file","2_triggermesh.html.vue"]]);export{w as default};