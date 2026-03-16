import{_ as n,c as a,o as t,a9 as i}from"./chunks/framework.Bqk8xQPS.js";const d=JSON.parse('{"title":"Overview","description":"Architecture, core components and patterns of @purista/ai.","frontmatter":{"title":"Overview","description":"Architecture, core components and patterns of @purista/ai.","order":203700},"headers":[],"relativePath":"handbook/2_building_business-logic/agent/index.md","filePath":"handbook/2_building_business-logic/agent/index.md","lastUpdated":1773313291000}'),e={name:"handbook/2_building_business-logic/agent/index.md"};function l(r,s,p,o,h,g){return t(),a("div",null,[...s[0]||(s[0]=[i(`<h1 id="ai-agents" tabindex="-1">AI Agents <a class="header-anchor" href="#ai-agents" aria-label="Permalink to “AI Agents”">​</a></h1><p><code>@purista/ai</code> integrates agents as first-class citizens into the PURISTA ecosystem. They share the same EventBridge, observability, and security models as your services, allowing for a unified architecture.</p><h2 id="system-map" tabindex="-1">System Map <a class="header-anchor" href="#system-map" aria-label="Permalink to “System Map”">​</a></h2><p>The following map illustrates how the <strong>Builder</strong> defines the agent, how the <strong>Runtime</strong> executes it, and how it interacts with <strong>Stores</strong> and the <strong>Ecosystem</strong>.</p><div class="language-mermaid"><button title="Copy Code" class="copy"></button><span class="lang">mermaid</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">flowchart TB</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    %% Style Definitions</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    classDef builder fill:#f59e0b,color:#fff,stroke:#d97706</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    classDef runtime fill:#4f46e5,color:#fff,stroke:#3730a3</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    classDef bridge fill:#10b981,color:#fff,stroke:#059669</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    classDef storage fill:#3b82f6,color:#fff,stroke:#2563eb</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    classDef transport fill:#64748b,color:#fff,stroke:#475569</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    subgraph Design [&quot;1. Design Time&quot;]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        B[AgentBuilder]:::builder</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    end</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    subgraph Transport [&quot;2. Transport &amp; Flow Control&quot;]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        EB((EventBridge)):::bridge</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        QB[QueueBridge]:::bridge</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        WP[Worker Pool]:::transport</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    end</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    subgraph Runtime [&quot;3. The Agent Instance&quot;]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        direction TB</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        AI[Agent Runtime]:::runtime</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        AH[Handler Logic]:::runtime</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    end</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    subgraph Deps [&quot;4. Injected Dependencies&quot;]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        direction LR</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        P[AiSdkProvider]:::storage</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        CS[Conversation Store]:::storage</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        KA[Knowledge Adapter]:::storage</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    end</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    subgraph Ecosystem [&quot;5. PURISTA Ecosystem&quot;]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        direction LR</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        CMD[Commands]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        SUB[Subscriptions]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        STR[Streams]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    end</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    %% Connection Logic</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    B -- &quot;.getInstance()&quot; --&gt; AI</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    </span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    CMD &amp; SUB &amp; STR -- &quot;invoke&quot; --&gt; EB</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    CMD &amp; SUB -- &quot;enqueue&quot; --&gt; QB</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    </span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    EB &amp; QB --&gt; WP</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    WP --&gt; AI</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    </span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    AI &lt;--&gt; AH</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    </span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    AH -- &quot;Models&quot; --&gt; P</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    AH -- &quot;Memory&quot; --&gt; CS</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    AH -- &quot;RAG&quot; --&gt; KA</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    </span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    AH -- &quot;Tool Calls&quot; --&gt; EB</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    AH -- &quot;Emit Events&quot; --&gt; EB</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    </span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    EB -- &quot;execute&quot; --&gt; CMD</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    EB -- &quot;trigger&quot; --&gt; SUB</span></span></code></pre></div><h2 id="conceptual-mapping" tabindex="-1">Conceptual Mapping <a class="header-anchor" href="#conceptual-mapping" aria-label="Permalink to “Conceptual Mapping”">​</a></h2><ul><li><strong>AgentBuilder</strong>: Your <strong>Blueprint</strong>. It defines &quot;what&quot; an agent is.</li><li><strong>AgentInstance</strong>: Your <strong>Worker</strong>. The runtime object that handles requests.</li><li><strong>Worker Pools</strong>: Your <strong>Brakes</strong>. They prevent resource exhaustion and rate limit hits.</li><li><strong>Memory &amp; RAG</strong>: Your <strong>Context</strong>. Conversation Stores handle short-term history; Knowledge Adapters handle long-term domain data.</li></ul><hr><h2 id="pattern-cheat-sheet" tabindex="-1">Pattern Cheat-Sheet <a class="header-anchor" href="#pattern-cheat-sheet" aria-label="Permalink to “Pattern Cheat-Sheet”">​</a></h2><table tabindex="0"><thead><tr><th style="text-align:left;">Feature</th><th style="text-align:left;">Primary Purpose</th><th style="text-align:left;">Best For...</th></tr></thead><tbody><tr><td style="text-align:left;"><strong>Streaming (SSE)</strong></td><td style="text-align:left;">Instant Feedback</td><td style="text-align:left;">User-facing chat interfaces.</td></tr><tr><td style="text-align:left;"><strong>Async Queues</strong></td><td style="text-align:left;">Resilience</td><td style="text-align:left;">Background analysis of large documents.</td></tr><tr><td style="text-align:left;"><strong>Event-Driven</strong></td><td style="text-align:left;">Decoupling</td><td style="text-align:left;">Automated auditing, triage, or classification.</td></tr><tr><td style="text-align:left;"><strong>A2A (Agent-to-Agent)</strong></td><td style="text-align:left;">Specialization</td><td style="text-align:left;">Complex workflows where one agent delegates to another.</td></tr></tbody></table><hr><h2 id="learning-path" tabindex="-1">Learning path <a class="header-anchor" href="#learning-path" aria-label="Permalink to “Learning path”">​</a></h2><ol><li><strong><a href="./getting-started.html">Quick Start</a></strong> — CLI scaffolding and your first &quot;Hello World&quot; agent.</li><li><strong><a href="./agent-builder.html">Builder</a></strong> — Defining tools, memory, and capabilities.</li><li><strong><a href="./handler-context.html">Context</a></strong> — Exploring the <code>context</code> toolbox.</li><li><strong><a href="./runtime.html">Runtime</a></strong> — Managing instances and concurrency.</li><li><strong><a href="./invocation.html">Invocation</a></strong> — Calling agents from commands or scripts.</li><li><strong><a href="./frontend.html">Web &amp; SDK</a></strong> — Connecting your agent to a modern UI.</li><li><strong><a href="./memory-and-knowledge.html">Memory &amp; Knowledge</a></strong> — Managing history and RAG.</li><li><strong><a href="./testing.html">Testing</a></strong> — Ensuring reliability with deterministic tests.</li></ol><p>For deep dives into Custom Stores, MCP/A2A, or protocol internals, see the <strong><a href="./../advanced/">Advanced Section</a></strong>.</p>`,14)])])}const k=n(e,[["render",l]]);export{d as __pageData,k as default};
