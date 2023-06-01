import{_ as a}from"./plugin-vue_export-helper-c27b6911.js";import{r,o as l,c as i,b as n,d as e,e as t,a as s}from"./app-ccf1f840.js";const c="/graphic/signoz_screenshot.png",d={},u=n("p",null,[n("img",{src:c,alt:"SigNoz"})],-1),p={href:"https://signoz.io",target:"_blank",rel:"noopener noreferrer"},h=n("br",null,null,-1),_=n("br",null,null,-1),m={href:"https://github.com/sebastianwessel/purista",target:"_blank",rel:"noopener noreferrer"},g=n("code",null,"examples/fullexample",-1),b=s(`<p>Start the required docker containers:</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">npm</span> run signoz:up
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div>`,2),f={href:"http://localhost:3301",target:"_blank",rel:"noopener noreferrer"},v=n("br",null,null,-1),k=n("code",null,"admin@example.com",-1),x=n("code",null,"PURISTA4love",-1),w=s(`<p>Start the example:</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">npm</span> run signoz:start
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div>`,2),z={href:"http://localhost:8080/",target:"_blank",rel:"noopener noreferrer"},S=n("br",null,null,-1),I=s(`<div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">npm</span> run signoz:down
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div>`,1),N={href:"https://twitter.com/purista_js",target:"_blank",rel:"noopener noreferrer"},T={href:"https://discord.gg/9feaUm3H2v",target:"_blank",rel:"noopener noreferrer"};function y(A,U){const o=r("ExternalLinkIcon");return l(),i("div",null,[u,n("p",null,[n("strong",null,[e("Official website: "),n("a",p,[e("SignNoz"),t(o)])])]),n("p",null,[e("See it in action and try out!"),h,e(" You will need docker and docker-compose installed at your machine."),_,e(" At the "),n("a",m,[e("PURISTA repository"),t(o)]),e(" in "),g,e(" you will find a running example:")]),b,n("p",null,[e("Open the SigNoz in your browser: "),n("a",f,[e("http://localhost:3301"),t(o)]),e("."),v,e(" You should be able to login with the test user account: username: "),k,e(" / password:"),x]),w,n("p",null,[e("To generate some traces, go to the OpenAPI UI at "),n("a",z,[e("http://localhost:8080/"),t(o)]),e(" and call some commands."),S,e(" To stop and cleanup and stop all docker containers:")]),I,n("p",null,[n("strong",null,[e("You can follow updated on Twitter "),n("a",N,[e("@purista_js"),t(o)]),e(" or join the "),n("a",T,[e("Discord server"),t(o)]),e(" to get in touch with PURISTA maintainers and other developers.")])])])}const j=a(d,[["render",y],["__file","signoz.html.vue"]]);export{j as default};