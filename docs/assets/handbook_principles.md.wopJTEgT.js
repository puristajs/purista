import{_ as e,c as i,o as a,V as t}from"./chunks/framework.ITQiifkM.js";const g=JSON.parse('{"title":"Principles","description":"PURISTA typescript backend framework concept","frontmatter":{"title":"Principles","description":"PURISTA typescript backend framework concept","order":20},"headers":[],"relativePath":"handbook/principles.md","filePath":"handbook/principles.md","lastUpdated":1708207057000}'),n={name:"handbook/principles.md"},o=t('<h1 id="principles-of-purista" tabindex="-1">Principles of PURISTA <a class="header-anchor" href="#principles-of-purista" aria-label="Permalink to &quot;Principles of PURISTA&quot;">​</a></h1><p>Here is a list of principles and goals of the PURISTA TypeScript framework.</p><h2 id="focus-on-business-logic" tabindex="-1">Focus on business logic <a class="header-anchor" href="#focus-on-business-logic" aria-label="Permalink to &quot;Focus on business logic&quot;">​</a></h2><p>In the realm of PURISTA, one principle reigns supreme: <strong>Focus on business logic</strong>. Our unwavering commitment is to swiftly deliver tangible business value with unwavering reliability and unparalleled flexibility.</p><h2 id="isolation-separation" tabindex="-1">Isolation &amp; separation <a class="header-anchor" href="#isolation-separation" aria-label="Permalink to &quot;Isolation &amp; separation&quot;">​</a></h2><p>In the realm of PURISTA, our ethos revolves around a set of fundamental principles, ensuring the robust implementation of business logic:</p><ol><li><p><strong>Isolation and Separation</strong>: Business logic implementation adheres strictly to the principles of isolation and separation. The &quot;outside world&quot; is viewed as a black box with well-defined interfaces.</p></li><li><p><strong>Service Specificity</strong>: Each service is dedicated to a single entity, maintaining clarity and focus within its domain.</p></li><li><p><strong>Isolated Commands and Subscriptions</strong>: Commands and subscriptions operate in isolation, interacting with the external environment solely through known interfaces. This ensures a clear separation of concerns and minimizes dependencies.</p></li><li><p><strong>Runtime Validation</strong>: Every input and output exchanged with a command or subscription undergoes rigorous validation during runtime, enhancing system reliability and security.</p></li><li><p><strong>Separation of Concerns</strong>: Following the principle of separation of concerns, each component within PURISTA is designed with a clear and distinct purpose, fostering maintainability and scalability.</p></li></ol><p>In essence, PURISTA embodies a steadfast commitment to excellence, ensuring the rapid delivery of business value while upholding the highest standards of reliability and flexibility.</p><h2 id="stateless" tabindex="-1">Stateless <a class="header-anchor" href="#stateless" aria-label="Permalink to &quot;Stateless&quot;">​</a></h2><p>Business logic implementation should remain stateless. By ensuring that implementations remain stateless, scaling and managing distributed systems becomes much easier.</p><p>PURISTA offers mechanisms to manage business states without the need for stateful implementations.</p><h2 id="configuration" tabindex="-1">Configuration <a class="header-anchor" href="#configuration" aria-label="Permalink to &quot;Configuration&quot;">​</a></h2><p>PURISTA follows the pattern to have always default values for config and settings. These defaults can be overwritten.</p><h2 id="handling-of-data" tabindex="-1">Handling of data <a class="header-anchor" href="#handling-of-data" aria-label="Permalink to &quot;Handling of data&quot;">​</a></h2><p>PURISTA empowers developers to construct applications that prioritize important principles such as data protection and the minimization of data usage. With PURISTA, developers can ensure that their applications are not only functional and efficient but also adhere to fundamental principles of privacy and data minimization.</p><h2 id="tracing-logging" tabindex="-1">Tracing &amp; Logging <a class="header-anchor" href="#tracing-logging" aria-label="Permalink to &quot;Tracing &amp; Logging&quot;">​</a></h2><p>In PURISTA, we prioritize key features like tracing, logging, and error handling. These important aspects are built into the framework automatically, making them easy to use from the start.</p><p>Moreover, PURISTA offers plenty of helpful tools and functions. These make tasks simpler and more straightforward for developers. With PURISTA, you&#39;ll find everything you need to streamline your work and boost productivity.</p><h2 id="performance-via-scaling" tabindex="-1">Performance via scaling <a class="header-anchor" href="#performance-via-scaling" aria-label="Permalink to &quot;Performance via scaling&quot;">​</a></h2><p>In PURISTA, we understand the importance of performance. However, certain features like using messages for communication, checking data during runtime, and handling errors come with trade-offs in performance. Despite this, we prioritize these features over things like maximizing raw speed for processing HTTP requests.</p><p>Building software with PURISTA offers great flexibility in scaling. This means applications made with PURISTA can handle large amounts of work in various ways. Because of this flexibility, applications built with PURISTA can deliver excellent overall performance. They also offer high reliability when things go wrong and interesting options for recovering from errors.</p><h2 id="decouple-logic-from-infrastructure-and-architecture" tabindex="-1">Decouple Logic from Infrastructure and Architecture <a class="header-anchor" href="#decouple-logic-from-infrastructure-and-architecture" aria-label="Permalink to &quot;Decouple Logic from Infrastructure and Architecture&quot;">​</a></h2><p>PURISTA offers a solution that lets you develop your business logic independently of the infrastructure or major architectural decisions. This means you can focus on building your logic without worrying about how it will fit into your infrastructure setup or future architectural changes.</p><p>By decoupling your logic from infrastructure, PURISTA minimizes the risk of vendor lock-in and makes it much easier to migrate to different service providers in the future. This flexibility ensures that your business logic remains agile and adaptable to evolving needs and technologies.</p>',24),r=[o];function s(l,c,p,d,u,h){return a(),i("div",null,r)}const m=e(n,[["render",s]]);export{g as __pageData,m as default};