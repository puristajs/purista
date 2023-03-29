import{_ as l,W as i,X as c,Z as e,a0 as t,a1 as a,$ as r,Y as n,D as d}from"./framework-d89ed822.js";const h={},u=e("h1",{id:"class-handlederror",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#class-handlederror","aria-hidden":"true"},"#"),r(" Class: HandledError")],-1),_=n('<p>A handled error is an error which is handled or thrown by business logic. It is wanted to expose it the outside world. Scenarios are input validation failures or &quot;404 Not Found&quot; errors which should be returned to the caller.</p><h2 id="hierarchy" tabindex="-1"><a class="header-anchor" href="#hierarchy" aria-hidden="true">#</a> Hierarchy</h2><ul><li><p><code>Error</code></p><p>↳ <strong><code>HandledError</code></strong></p></li></ul><h2 id="table-of-contents" tabindex="-1"><a class="header-anchor" href="#table-of-contents" aria-hidden="true">#</a> Table of contents</h2><h3 id="constructors" tabindex="-1"><a class="header-anchor" href="#constructors" aria-hidden="true">#</a> Constructors</h3>',5),p=e("h3",{id:"properties",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#properties","aria-hidden":"true"},"#"),r(" Properties")],-1),f=e("h3",{id:"methods",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#methods","aria-hidden":"true"},"#"),r(" Methods")],-1),g=n('<h2 id="constructors-1" tabindex="-1"><a class="header-anchor" href="#constructors-1" aria-hidden="true">#</a> Constructors</h2><h3 id="constructor" tabindex="-1"><a class="header-anchor" href="#constructor" aria-hidden="true">#</a> constructor</h3><p>• <strong>new HandledError</strong>(<code>errorCode</code>, <code>message?</code>, <code>data?</code>, <code>traceId?</code>)</p><h4 id="parameters" tabindex="-1"><a class="header-anchor" href="#parameters" aria-hidden="true">#</a> Parameters</h4>',4),m=e("thead",null,[e("tr",null,[e("th",{style:{"text-align":"left"}},"Name"),e("th",{style:{"text-align":"left"}},"Type")])],-1),b=e("td",{style:{"text-align":"left"}},[e("code",null,"errorCode")],-1),x={style:{"text-align":"left"}},E=e("code",null,"StatusCode",-1),y=e("tr",null,[e("td",{style:{"text-align":"left"}},[e("code",null,"message?")]),e("td",{style:{"text-align":"left"}},[e("code",null,"string")])],-1),H=e("tr",null,[e("td",{style:{"text-align":"left"}},[e("code",null,"data?")]),e("td",{style:{"text-align":"left"}},[e("code",null,"unknown")])],-1),k=e("tr",null,[e("td",{style:{"text-align":"left"}},[e("code",null,"traceId?")]),e("td",{style:{"text-align":"left"}},[e("code",null,"string")])],-1),C=e("h4",{id:"overrides",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#overrides","aria-hidden":"true"},"#"),r(" Overrides")],-1),R=e("p",null,"Error.constructor",-1),w=e("h4",{id:"defined-in",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#defined-in","aria-hidden":"true"},"#"),r(" Defined in")],-1),I={href:"https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/core/Error/HandledError.impl.ts#L10",target:"_blank",rel:"noopener noreferrer"},S=n('<h2 id="properties-1" tabindex="-1"><a class="header-anchor" href="#properties-1" aria-hidden="true">#</a> Properties</h2><h3 id="data" tabindex="-1"><a class="header-anchor" href="#data" aria-hidden="true">#</a> data</h3><p>• <code>Optional</code> <strong>data</strong>: <code>unknown</code></p><h4 id="defined-in-1" tabindex="-1"><a class="header-anchor" href="#defined-in-1" aria-hidden="true">#</a> Defined in</h4>',4),L={href:"https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/core/Error/HandledError.impl.ts#L10",target:"_blank",rel:"noopener noreferrer"},D=e("hr",null,null,-1),P=e("h3",{id:"errorcode",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#errorcode","aria-hidden":"true"},"#"),r(" errorCode")],-1),N=e("strong",null,"errorCode",-1),v=e("code",null,"StatusCode",-1),M=e("h4",{id:"defined-in-2",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#defined-in-2","aria-hidden":"true"},"#"),r(" Defined in")],-1),T={href:"https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/core/Error/HandledError.impl.ts#L10",target:"_blank",rel:"noopener noreferrer"},B=e("hr",null,null,-1),V=e("h3",{id:"traceid",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#traceid","aria-hidden":"true"},"#"),r(" traceId")],-1),j=e("p",null,[r("• "),e("code",null,"Optional"),r(),e("strong",null,"traceId"),r(": "),e("code",null,"string")],-1),A=e("h4",{id:"defined-in-3",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#defined-in-3","aria-hidden":"true"},"#"),r(" Defined in")],-1),O={href:"https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/core/Error/HandledError.impl.ts#L10",target:"_blank",rel:"noopener noreferrer"},q=e("h2",{id:"methods-1",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#methods-1","aria-hidden":"true"},"#"),r(" Methods")],-1),F=e("h3",{id:"geterrorresponse",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#geterrorresponse","aria-hidden":"true"},"#"),r(" getErrorResponse")],-1),U=e("strong",null,"getErrorResponse",-1),W=e("code",null,"traceId?",-1),X=e("code",null,"Readonly",-1),Y=e("code",null,"ErrorResponsePayload",-1),Z=n('<p>Returns error response object</p><h4 id="parameters-1" tabindex="-1"><a class="header-anchor" href="#parameters-1" aria-hidden="true">#</a> Parameters</h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th></tr></thead><tbody><tr><td style="text-align:left;"><code>traceId?</code></td><td style="text-align:left;"><code>string</code></td></tr></tbody></table><h4 id="returns" tabindex="-1"><a class="header-anchor" href="#returns" aria-hidden="true">#</a> Returns</h4>',4),$=e("code",null,"Readonly",-1),z=e("code",null,"ErrorResponsePayload",-1),G=e("p",null,"ErrorResponsePayload",-1),J=e("h4",{id:"defined-in-4",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#defined-in-4","aria-hidden":"true"},"#"),r(" Defined in")],-1),K={href:"https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/core/Error/HandledError.impl.ts#L45",target:"_blank",rel:"noopener noreferrer"},Q=n('<hr><h3 id="tostring" tabindex="-1"><a class="header-anchor" href="#tostring" aria-hidden="true">#</a> toString</h3><p>▸ <strong>toString</strong>(): <code>string</code></p><p>Returns stringified error response object</p><h4 id="returns-1" tabindex="-1"><a class="header-anchor" href="#returns-1" aria-hidden="true">#</a> Returns</h4><p><code>string</code></p><p>ErrorResponse as string</p><h4 id="defined-in-5" tabindex="-1"><a class="header-anchor" href="#defined-in-5" aria-hidden="true">#</a> Defined in</h4>',8),ee={href:"https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/core/Error/HandledError.impl.ts#L60",target:"_blank",rel:"noopener noreferrer"},re=e("hr",null,null,-1),te=e("h3",{id:"fromerror",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#fromerror","aria-hidden":"true"},"#"),r(" fromError")],-1),oe=e("code",null,"Static",-1),ae=e("strong",null,"fromError",-1),se=e("code",null,"err",-1),ne=e("code",null,"errorCode?",-1),de=e("code",null,"data?",-1),le=e("code",null,"traceId?",-1),ie=e("code",null,"HandledError",-1),ce=e("p",null,"Creates a HandledError from an input",-1),he=e("h4",{id:"parameters-2",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#parameters-2","aria-hidden":"true"},"#"),r(" Parameters")],-1),ue=e("thead",null,[e("tr",null,[e("th",{style:{"text-align":"left"}},"Name"),e("th",{style:{"text-align":"left"}},"Type"),e("th",{style:{"text-align":"left"}},"Description")])],-1),_e=e("tr",null,[e("td",{style:{"text-align":"left"}},[e("code",null,"err")]),e("td",{style:{"text-align":"left"}},[e("code",null,"any")]),e("td",{style:{"text-align":"left"}},"the input")],-1),pe=e("td",{style:{"text-align":"left"}},[e("code",null,"errorCode?")],-1),fe={style:{"text-align":"left"}},ge=e("code",null,"StatusCode",-1),me=e("td",{style:{"text-align":"left"}},"the error code",-1),be=e("tr",null,[e("td",{style:{"text-align":"left"}},[e("code",null,"data?")]),e("td",{style:{"text-align":"left"}},[e("code",null,"unknown")]),e("td",{style:{"text-align":"left"}},"optional data")],-1),xe=e("tr",null,[e("td",{style:{"text-align":"left"}},[e("code",null,"traceId?")]),e("td",{style:{"text-align":"left"}},[e("code",null,"string")]),e("td",{style:{"text-align":"left"}},"optional trace id")],-1),Ee=e("h4",{id:"returns-2",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#returns-2","aria-hidden":"true"},"#"),r(" Returns")],-1),ye=e("code",null,"HandledError",-1),He=e("p",null,"HandledError",-1),ke=e("h4",{id:"defined-in-6",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#defined-in-6","aria-hidden":"true"},"#"),r(" Defined in")],-1),Ce={href:"https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/core/Error/HandledError.impl.ts#L34",target:"_blank",rel:"noopener noreferrer"},Re=e("hr",null,null,-1),we=e("h3",{id:"frommessage",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#frommessage","aria-hidden":"true"},"#"),r(" fromMessage")],-1),Ie=e("code",null,"Static",-1),Se=e("strong",null,"fromMessage",-1),Le=e("code",null,"message",-1),De=e("code",null,"HandledError",-1),Pe=e("p",null,"Create a error object from EBMessage error message",-1),Ne=e("h4",{id:"parameters-3",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#parameters-3","aria-hidden":"true"},"#"),r(" Parameters")],-1),ve=e("thead",null,[e("tr",null,[e("th",{style:{"text-align":"left"}},"Name"),e("th",{style:{"text-align":"left"}},"Type"),e("th",{style:{"text-align":"left"}},"Description")])],-1),Me=e("td",{style:{"text-align":"left"}},[e("code",null,"message")],-1),Te={style:{"text-align":"left"}},Be=e("code",null,"Readonly",-1),Ve=e("code",null,"CommandErrorResponse",-1),je=e("td",{style:{"text-align":"left"}},"CommandErrorResponse",-1),Ae=e("h4",{id:"returns-3",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#returns-3","aria-hidden":"true"},"#"),r(" Returns")],-1),Oe=e("code",null,"HandledError",-1),qe=e("p",null,"HandledError",-1),Fe=e("h4",{id:"defined-in-7",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#defined-in-7","aria-hidden":"true"},"#"),r(" Defined in")],-1),Ue={href:"https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/core/Error/HandledError.impl.ts#L21",target:"_blank",rel:"noopener noreferrer"};function We(Xe,Ye){const o=d("RouterLink"),s=d("ExternalLinkIcon");return i(),c("div",null,[e("p",null,[t(o,{to:"/api/"},{default:a(()=>[r("PURISTA API - v1.4.9")]),_:1}),r(" / "),t(o,{to:"/api/modules.html"},{default:a(()=>[r("Modules")]),_:1}),r(" / "),t(o,{to:"/api/modules/purista_core.html"},{default:a(()=>[r("@purista/core")]),_:1}),r(" / HandledError")]),u,e("p",null,[t(o,{to:"/api/modules/purista_core.html"},{default:a(()=>[r("@purista/core")]),_:1}),r(".HandledError")]),_,e("ul",null,[e("li",null,[t(o,{to:"/api/classes/purista_core.HandledError.html#constructor"},{default:a(()=>[r("constructor")]),_:1})])]),p,e("ul",null,[e("li",null,[t(o,{to:"/api/classes/purista_core.HandledError.html#data"},{default:a(()=>[r("data")]),_:1})]),e("li",null,[t(o,{to:"/api/classes/purista_core.HandledError.html#errorcode"},{default:a(()=>[r("errorCode")]),_:1})]),e("li",null,[t(o,{to:"/api/classes/purista_core.HandledError.html#traceid"},{default:a(()=>[r("traceId")]),_:1})])]),f,e("ul",null,[e("li",null,[t(o,{to:"/api/classes/purista_core.HandledError.html#geterrorresponse"},{default:a(()=>[r("getErrorResponse")]),_:1})]),e("li",null,[t(o,{to:"/api/classes/purista_core.HandledError.html#tostring"},{default:a(()=>[r("toString")]),_:1})]),e("li",null,[t(o,{to:"/api/classes/purista_core.HandledError.html#fromerror"},{default:a(()=>[r("fromError")]),_:1})]),e("li",null,[t(o,{to:"/api/classes/purista_core.HandledError.html#frommessage"},{default:a(()=>[r("fromMessage")]),_:1})])]),g,e("table",null,[m,e("tbody",null,[e("tr",null,[b,e("td",x,[t(o,{to:"/api/enums/purista_core.StatusCode.html"},{default:a(()=>[E]),_:1})])]),y,H,k])]),C,R,w,e("p",null,[e("a",I,[r("packages/core/src/core/Error/HandledError.impl.ts:10"),t(s)])]),S,e("p",null,[e("a",L,[r("packages/core/src/core/Error/HandledError.impl.ts:10"),t(s)])]),D,P,e("p",null,[r("• "),N,r(": "),t(o,{to:"/api/enums/purista_core.StatusCode.html"},{default:a(()=>[v]),_:1})]),M,e("p",null,[e("a",T,[r("packages/core/src/core/Error/HandledError.impl.ts:10"),t(s)])]),B,V,j,A,e("p",null,[e("a",O,[r("packages/core/src/core/Error/HandledError.impl.ts:10"),t(s)])]),q,F,e("p",null,[r("▸ "),U,r("("),W,r("): "),X,r("<"),t(o,{to:"/api/modules/purista_core.html#errorresponsepayload"},{default:a(()=>[Y]),_:1}),r(">")]),Z,e("p",null,[$,r("<"),t(o,{to:"/api/modules/purista_core.html#errorresponsepayload"},{default:a(()=>[z]),_:1}),r(">")]),G,J,e("p",null,[e("a",K,[r("packages/core/src/core/Error/HandledError.impl.ts:45"),t(s)])]),Q,e("p",null,[e("a",ee,[r("packages/core/src/core/Error/HandledError.impl.ts:60"),t(s)])]),re,te,e("p",null,[r("▸ "),oe,r(),ae,r("("),se,r(", "),ne,r(", "),de,r(", "),le,r("): "),t(o,{to:"/api/classes/purista_core.HandledError.html"},{default:a(()=>[ie]),_:1})]),ce,he,e("table",null,[ue,e("tbody",null,[_e,e("tr",null,[pe,e("td",fe,[t(o,{to:"/api/enums/purista_core.StatusCode.html"},{default:a(()=>[ge]),_:1})]),me]),be,xe])]),Ee,e("p",null,[t(o,{to:"/api/classes/purista_core.HandledError.html"},{default:a(()=>[ye]),_:1})]),He,ke,e("p",null,[e("a",Ce,[r("packages/core/src/core/Error/HandledError.impl.ts:34"),t(s)])]),Re,we,e("p",null,[r("▸ "),Ie,r(),Se,r("("),Le,r("): "),t(o,{to:"/api/classes/purista_core.HandledError.html"},{default:a(()=>[De]),_:1})]),Pe,Ne,e("table",null,[ve,e("tbody",null,[e("tr",null,[Me,e("td",Te,[Be,r("<"),t(o,{to:"/api/modules/purista_core.html#commanderrorresponse"},{default:a(()=>[Ve]),_:1}),r(">")]),je])])]),Ae,e("p",null,[t(o,{to:"/api/classes/purista_core.HandledError.html"},{default:a(()=>[Oe]),_:1})]),qe,Fe,e("p",null,[e("a",Ue,[r("packages/core/src/core/Error/HandledError.impl.ts:21"),t(s)])])])}const $e=l(h,[["render",We],["__file","purista_core.HandledError.html.vue"]]);export{$e as default};