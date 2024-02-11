import{_ as e,c as a,o as r,V as t}from"./chunks/framework.ITQiifkM.js";const p=JSON.parse('{"title":"Class: DefaultLogger","description":"","frontmatter":{},"headers":[],"relativePath":"api/classes/purista_core.DefaultLogger.md","filePath":"api/classes/purista_core.DefaultLogger.md","lastUpdated":1706444636000}'),o={name:"api/classes/purista_core.DefaultLogger.md"},l=t('<p><a href="./../README.html">PURISTA API</a> / <a href="./../modules.html">Modules</a> / <a href="./../modules/purista_core.html">@purista/core</a> / DefaultLogger</p><h1 id="class-defaultlogger" tabindex="-1">Class: DefaultLogger <a class="header-anchor" href="#class-defaultlogger" aria-label="Permalink to &quot;Class: DefaultLogger&quot;">​</a></h1><p><a href="./../modules/purista_core.html">@purista/core</a>.DefaultLogger</p><h2 id="hierarchy" tabindex="-1">Hierarchy <a class="header-anchor" href="#hierarchy" aria-label="Permalink to &quot;Hierarchy&quot;">​</a></h2><ul><li><p><a href="./purista_core.Logger.html"><code>Logger</code></a></p><p>↳ <strong><code>DefaultLogger</code></strong></p></li></ul><h2 id="implements" tabindex="-1">Implements <a class="header-anchor" href="#implements" aria-label="Permalink to &quot;Implements&quot;">​</a></h2><ul><li><a href="./../interfaces/purista_core.ILogger.html"><code>ILogger</code></a></li></ul><h2 id="table-of-contents" tabindex="-1">Table of contents <a class="header-anchor" href="#table-of-contents" aria-label="Permalink to &quot;Table of contents&quot;">​</a></h2><h3 id="constructors" tabindex="-1">Constructors <a class="header-anchor" href="#constructors" aria-label="Permalink to &quot;Constructors&quot;">​</a></h3><ul><li><a href="./purista_core.DefaultLogger.html#constructor">constructor</a></li></ul><h3 id="properties" tabindex="-1">Properties <a class="header-anchor" href="#properties" aria-label="Permalink to &quot;Properties&quot;">​</a></h3><ul><li><a href="./purista_core.DefaultLogger.html#log">log</a></li></ul><h3 id="methods" tabindex="-1">Methods <a class="header-anchor" href="#methods" aria-label="Permalink to &quot;Methods&quot;">​</a></h3><ul><li><a href="./purista_core.DefaultLogger.html#debug">debug</a></li><li><a href="./purista_core.DefaultLogger.html#error">error</a></li><li><a href="./purista_core.DefaultLogger.html#fatal">fatal</a></li><li><a href="./purista_core.DefaultLogger.html#getchildlogger">getChildLogger</a></li><li><a href="./purista_core.DefaultLogger.html#info">info</a></li><li><a href="./purista_core.DefaultLogger.html#trace">trace</a></li><li><a href="./purista_core.DefaultLogger.html#warn">warn</a></li></ul><h2 id="constructors-1" tabindex="-1">Constructors <a class="header-anchor" href="#constructors-1" aria-label="Permalink to &quot;Constructors&quot;">​</a></h2><h3 id="constructor" tabindex="-1">constructor <a class="header-anchor" href="#constructor" aria-label="Permalink to &quot;constructor&quot;">​</a></h3><p>• <strong>new DefaultLogger</strong>(<code>log</code>): <a href="./purista_core.DefaultLogger.html"><code>DefaultLogger</code></a></p><h4 id="parameters" tabindex="-1">Parameters <a class="header-anchor" href="#parameters" aria-label="Permalink to &quot;Parameters&quot;">​</a></h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th></tr></thead><tbody><tr><td style="text-align:left;"><code>log</code></td><td style="text-align:left;"><code>Logger</code></td></tr></tbody></table><h4 id="returns" tabindex="-1">Returns <a class="header-anchor" href="#returns" aria-label="Permalink to &quot;Returns&quot;">​</a></h4><p><a href="./purista_core.DefaultLogger.html"><code>DefaultLogger</code></a></p><h4 id="overrides" tabindex="-1">Overrides <a class="header-anchor" href="#overrides" aria-label="Permalink to &quot;Overrides&quot;">​</a></h4><p><a href="./purista_core.Logger.html">Logger</a>.<a href="./purista_core.Logger.html#constructor">constructor</a></p><h4 id="defined-in" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in" aria-label="Permalink to &quot;Defined in&quot;">​</a></h4><p><a href="https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultLogger/DefaultLogger.impl.ts#L7" target="_blank" rel="noreferrer">DefaultLogger/DefaultLogger.impl.ts:7</a></p><h2 id="properties-1" tabindex="-1">Properties <a class="header-anchor" href="#properties-1" aria-label="Permalink to &quot;Properties&quot;">​</a></h2><h3 id="log" tabindex="-1">log <a class="header-anchor" href="#log" aria-label="Permalink to &quot;log&quot;">​</a></h3><p>• <code>Private</code> <strong>log</strong>: <code>Logger</code></p><h4 id="defined-in-1" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-1" aria-label="Permalink to &quot;Defined in&quot;">​</a></h4><p><a href="https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultLogger/DefaultLogger.impl.ts#L7" target="_blank" rel="noreferrer">DefaultLogger/DefaultLogger.impl.ts:7</a></p><h2 id="methods-1" tabindex="-1">Methods <a class="header-anchor" href="#methods-1" aria-label="Permalink to &quot;Methods&quot;">​</a></h2><h3 id="debug" tabindex="-1">debug <a class="header-anchor" href="#debug" aria-label="Permalink to &quot;debug&quot;">​</a></h3><p>▸ <strong>debug</strong>(<code>...args</code>): <code>void</code></p><h4 id="parameters-1" tabindex="-1">Parameters <a class="header-anchor" href="#parameters-1" aria-label="Permalink to &quot;Parameters&quot;">​</a></h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th></tr></thead><tbody><tr><td style="text-align:left;"><code>...args</code></td><td style="text-align:left;"><a href="./../modules/purista_core.html#logfnparamtype"><code>LogFnParamType</code></a></td></tr></tbody></table><h4 id="returns-1" tabindex="-1">Returns <a class="header-anchor" href="#returns-1" aria-label="Permalink to &quot;Returns&quot;">​</a></h4><p><code>void</code></p><h4 id="implementation-of" tabindex="-1">Implementation of <a class="header-anchor" href="#implementation-of" aria-label="Permalink to &quot;Implementation of&quot;">​</a></h4><p><a href="./../interfaces/purista_core.ILogger.html">ILogger</a>.<a href="./../interfaces/purista_core.ILogger.html#debug">debug</a></p><h4 id="overrides-1" tabindex="-1">Overrides <a class="header-anchor" href="#overrides-1" aria-label="Permalink to &quot;Overrides&quot;">​</a></h4><p><a href="./purista_core.Logger.html">Logger</a>.<a href="./purista_core.Logger.html#debug">debug</a></p><h4 id="defined-in-2" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-2" aria-label="Permalink to &quot;Defined in&quot;">​</a></h4><p><a href="https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultLogger/DefaultLogger.impl.ts#L43" target="_blank" rel="noreferrer">DefaultLogger/DefaultLogger.impl.ts:43</a></p><hr><h3 id="error" tabindex="-1">error <a class="header-anchor" href="#error" aria-label="Permalink to &quot;error&quot;">​</a></h3><p>▸ <strong>error</strong>(<code>...args</code>): <code>void</code></p><h4 id="parameters-2" tabindex="-1">Parameters <a class="header-anchor" href="#parameters-2" aria-label="Permalink to &quot;Parameters&quot;">​</a></h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th></tr></thead><tbody><tr><td style="text-align:left;"><code>...args</code></td><td style="text-align:left;"><a href="./../modules/purista_core.html#logfnparamtype"><code>LogFnParamType</code></a></td></tr></tbody></table><h4 id="returns-2" tabindex="-1">Returns <a class="header-anchor" href="#returns-2" aria-label="Permalink to &quot;Returns&quot;">​</a></h4><p><code>void</code></p><h4 id="implementation-of-1" tabindex="-1">Implementation of <a class="header-anchor" href="#implementation-of-1" aria-label="Permalink to &quot;Implementation of&quot;">​</a></h4><p><a href="./../interfaces/purista_core.ILogger.html">ILogger</a>.<a href="./../interfaces/purista_core.ILogger.html#error">error</a></p><h4 id="overrides-2" tabindex="-1">Overrides <a class="header-anchor" href="#overrides-2" aria-label="Permalink to &quot;Overrides&quot;">​</a></h4><p><a href="./purista_core.Logger.html">Logger</a>.<a href="./purista_core.Logger.html#error">error</a></p><h4 id="defined-in-3" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-3" aria-label="Permalink to &quot;Defined in&quot;">​</a></h4><p><a href="https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultLogger/DefaultLogger.impl.ts#L19" target="_blank" rel="noreferrer">DefaultLogger/DefaultLogger.impl.ts:19</a></p><hr><h3 id="fatal" tabindex="-1">fatal <a class="header-anchor" href="#fatal" aria-label="Permalink to &quot;fatal&quot;">​</a></h3><p>▸ <strong>fatal</strong>(<code>...args</code>): <code>void</code></p><h4 id="parameters-3" tabindex="-1">Parameters <a class="header-anchor" href="#parameters-3" aria-label="Permalink to &quot;Parameters&quot;">​</a></h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th></tr></thead><tbody><tr><td style="text-align:left;"><code>...args</code></td><td style="text-align:left;"><a href="./../modules/purista_core.html#logfnparamtype"><code>LogFnParamType</code></a></td></tr></tbody></table><h4 id="returns-3" tabindex="-1">Returns <a class="header-anchor" href="#returns-3" aria-label="Permalink to &quot;Returns&quot;">​</a></h4><p><code>void</code></p><h4 id="implementation-of-2" tabindex="-1">Implementation of <a class="header-anchor" href="#implementation-of-2" aria-label="Permalink to &quot;Implementation of&quot;">​</a></h4><p><a href="./../interfaces/purista_core.ILogger.html">ILogger</a>.<a href="./../interfaces/purista_core.ILogger.html#fatal">fatal</a></p><h4 id="overrides-3" tabindex="-1">Overrides <a class="header-anchor" href="#overrides-3" aria-label="Permalink to &quot;Overrides&quot;">​</a></h4><p><a href="./purista_core.Logger.html">Logger</a>.<a href="./purista_core.Logger.html#fatal">fatal</a></p><h4 id="defined-in-4" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-4" aria-label="Permalink to &quot;Defined in&quot;">​</a></h4><p><a href="https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultLogger/DefaultLogger.impl.ts#L11" target="_blank" rel="noreferrer">DefaultLogger/DefaultLogger.impl.ts:11</a></p><hr><h3 id="getchildlogger" tabindex="-1">getChildLogger <a class="header-anchor" href="#getchildlogger" aria-label="Permalink to &quot;getChildLogger&quot;">​</a></h3><p>▸ <strong>getChildLogger</strong>(<code>options</code>): <a href="./purista_core.Logger.html"><code>Logger</code></a></p><h4 id="parameters-4" tabindex="-1">Parameters <a class="header-anchor" href="#parameters-4" aria-label="Permalink to &quot;Parameters&quot;">​</a></h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th></tr></thead><tbody><tr><td style="text-align:left;"><code>options</code></td><td style="text-align:left;"><a href="./../modules/purista_core.html#loggeroptions"><code>LoggerOptions</code></a></td></tr></tbody></table><h4 id="returns-4" tabindex="-1">Returns <a class="header-anchor" href="#returns-4" aria-label="Permalink to &quot;Returns&quot;">​</a></h4><p><a href="./purista_core.Logger.html"><code>Logger</code></a></p><h4 id="overrides-4" tabindex="-1">Overrides <a class="header-anchor" href="#overrides-4" aria-label="Permalink to &quot;Overrides&quot;">​</a></h4><p><a href="./purista_core.Logger.html">Logger</a>.<a href="./purista_core.Logger.html#getchildlogger">getChildLogger</a></p><h4 id="defined-in-5" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-5" aria-label="Permalink to &quot;Defined in&quot;">​</a></h4><p><a href="https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultLogger/DefaultLogger.impl.ts#L59" target="_blank" rel="noreferrer">DefaultLogger/DefaultLogger.impl.ts:59</a></p><hr><h3 id="info" tabindex="-1">info <a class="header-anchor" href="#info" aria-label="Permalink to &quot;info&quot;">​</a></h3><p>▸ <strong>info</strong>(<code>...args</code>): <code>void</code></p><h4 id="parameters-5" tabindex="-1">Parameters <a class="header-anchor" href="#parameters-5" aria-label="Permalink to &quot;Parameters&quot;">​</a></h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th></tr></thead><tbody><tr><td style="text-align:left;"><code>...args</code></td><td style="text-align:left;"><a href="./../modules/purista_core.html#logfnparamtype"><code>LogFnParamType</code></a></td></tr></tbody></table><h4 id="returns-5" tabindex="-1">Returns <a class="header-anchor" href="#returns-5" aria-label="Permalink to &quot;Returns&quot;">​</a></h4><p><code>void</code></p><h4 id="implementation-of-3" tabindex="-1">Implementation of <a class="header-anchor" href="#implementation-of-3" aria-label="Permalink to &quot;Implementation of&quot;">​</a></h4><p><a href="./../interfaces/purista_core.ILogger.html">ILogger</a>.<a href="./../interfaces/purista_core.ILogger.html#info">info</a></p><h4 id="overrides-5" tabindex="-1">Overrides <a class="header-anchor" href="#overrides-5" aria-label="Permalink to &quot;Overrides&quot;">​</a></h4><p><a href="./purista_core.Logger.html">Logger</a>.<a href="./purista_core.Logger.html#info">info</a></p><h4 id="defined-in-6" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-6" aria-label="Permalink to &quot;Defined in&quot;">​</a></h4><p><a href="https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultLogger/DefaultLogger.impl.ts#L35" target="_blank" rel="noreferrer">DefaultLogger/DefaultLogger.impl.ts:35</a></p><hr><h3 id="trace" tabindex="-1">trace <a class="header-anchor" href="#trace" aria-label="Permalink to &quot;trace&quot;">​</a></h3><p>▸ <strong>trace</strong>(<code>...args</code>): <code>void</code></p><h4 id="parameters-6" tabindex="-1">Parameters <a class="header-anchor" href="#parameters-6" aria-label="Permalink to &quot;Parameters&quot;">​</a></h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th></tr></thead><tbody><tr><td style="text-align:left;"><code>...args</code></td><td style="text-align:left;"><a href="./../modules/purista_core.html#logfnparamtype"><code>LogFnParamType</code></a></td></tr></tbody></table><h4 id="returns-6" tabindex="-1">Returns <a class="header-anchor" href="#returns-6" aria-label="Permalink to &quot;Returns&quot;">​</a></h4><p><code>void</code></p><h4 id="implementation-of-4" tabindex="-1">Implementation of <a class="header-anchor" href="#implementation-of-4" aria-label="Permalink to &quot;Implementation of&quot;">​</a></h4><p><a href="./../interfaces/purista_core.ILogger.html">ILogger</a>.<a href="./../interfaces/purista_core.ILogger.html#trace">trace</a></p><h4 id="overrides-6" tabindex="-1">Overrides <a class="header-anchor" href="#overrides-6" aria-label="Permalink to &quot;Overrides&quot;">​</a></h4><p><a href="./purista_core.Logger.html">Logger</a>.<a href="./purista_core.Logger.html#trace">trace</a></p><h4 id="defined-in-7" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-7" aria-label="Permalink to &quot;Defined in&quot;">​</a></h4><p><a href="https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultLogger/DefaultLogger.impl.ts#L51" target="_blank" rel="noreferrer">DefaultLogger/DefaultLogger.impl.ts:51</a></p><hr><h3 id="warn" tabindex="-1">warn <a class="header-anchor" href="#warn" aria-label="Permalink to &quot;warn&quot;">​</a></h3><p>▸ <strong>warn</strong>(<code>...args</code>): <code>void</code></p><h4 id="parameters-7" tabindex="-1">Parameters <a class="header-anchor" href="#parameters-7" aria-label="Permalink to &quot;Parameters&quot;">​</a></h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th></tr></thead><tbody><tr><td style="text-align:left;"><code>...args</code></td><td style="text-align:left;"><a href="./../modules/purista_core.html#logfnparamtype"><code>LogFnParamType</code></a></td></tr></tbody></table><h4 id="returns-7" tabindex="-1">Returns <a class="header-anchor" href="#returns-7" aria-label="Permalink to &quot;Returns&quot;">​</a></h4><p><code>void</code></p><h4 id="implementation-of-5" tabindex="-1">Implementation of <a class="header-anchor" href="#implementation-of-5" aria-label="Permalink to &quot;Implementation of&quot;">​</a></h4><p><a href="./../interfaces/purista_core.ILogger.html">ILogger</a>.<a href="./../interfaces/purista_core.ILogger.html#warn">warn</a></p><h4 id="overrides-7" tabindex="-1">Overrides <a class="header-anchor" href="#overrides-7" aria-label="Permalink to &quot;Overrides&quot;">​</a></h4><p><a href="./purista_core.Logger.html">Logger</a>.<a href="./purista_core.Logger.html#warn">warn</a></p><h4 id="defined-in-8" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-8" aria-label="Permalink to &quot;Defined in&quot;">​</a></h4><p><a href="https://github.com/sebastianwessel/purista/blob/master/packages/core/src/DefaultLogger/DefaultLogger.impl.ts#L27" target="_blank" rel="noreferrer">DefaultLogger/DefaultLogger.impl.ts:27</a></p>',119),i=[l];function s(h,n,d,c,g,u){return r(),a("div",null,i)}const m=e(o,[["render",s]]);export{p as __pageData,m as default};