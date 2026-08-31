# Writing, Examples, and Presentation

## Contents

- [Voice and structure](#voice-and-structure)
- [Real-world examples](#real-world-examples)
- [Code snippets](#code-snippets)
- [Types and builder examples](#types-and-builder-examples)
- [Decision guidance](#decision-guidance)
- [Formatting choices](#formatting-choices)
- [Diagrams](#diagrams)
- [Accessibility and scanning](#accessibility-and-scanning)
- [Editing pass](#editing-pass)

## Voice and structure

- Open with the reader's outcome or decision in plain language.
- Introduce PURISTA terminology only after giving the familiar concept.
- Use short paragraphs with one claim each.
- Prefer concrete nouns and active verbs. Name the service, queue, adapter, config key, or failure.
- Explain why directly next to the action or decision it affects.
- State framework behavior and application consequences directly. Do not turn
  authoring discussions, code-review feedback, prompt instructions, or
  implementation-debug reasoning into public handbook prose.
- Avoid throat-clearing, repeated summaries, marketing superlatives, and phrases such as “simply,” “just,” or “obviously.”
- Keep warnings specific: condition, consequence, evidence, and safe action.
- End with a focused next step, not a generic list of everything related.

Do not tell readers that a page or chapter is a story. Let the sequence create the flow.

## Real-world examples

Choose a small domain scenario that naturally demonstrates the concept:

- invoice generation for durable queues;
- customer onboarding for commands and events;
- inventory reservation for idempotency and consistency;
- policy/claims review for guarded AI and human approval;
- tenant-scoped configuration for stores and security;
- document analysis for streams and progress reporting.

State the finish line and expected evidence before the code. Use safe synthetic values. Keep one domain per page unless comparison is the page's job.

For a multi-page capability, prefer one continuing scenario. The overview names
the business operation; the first task makes it work; later tasks show only the
dependency, event, queue, transform, exposure, or test delta. Keep filenames,
schemas, IDs, response shapes, and error semantics aligned across those pages.
Switch scenarios only when the original domain cannot demonstrate the next
capability honestly or concisely.

Examples should explain:

- what the application owns;
- what PURISTA owns;
- what an adapter/provider owns;
- which values the user edits;
- what result proves success;
- what changes in production.

## Code snippets

- Show the smallest slice that teaches the current step. Prefer several focused snippets over one long file.
- Use a fenced-block language that matches the content: `ts`/`tsx` for TypeScript, `json` for JSON, `yaml` for YAML, `toml` for TOML, `dotenv` for environment files, `sql` for SQL, `bash` for shell commands, `text` for output, and `mermaid` only for diagrams. Do not label prose or pseudo-code as TypeScript.
- Give every fenced block a meaningful `title`. For source and configuration, use the real or generated application path, such as <code>title="src/service/orders/v1/command/createOrder.ts"</code>, <code>title="package.json"</code>, or <code>title=".env"</code>. For a command or output that is not a file, name the reader action or evidence, such as <code>title="Install the Hono server"</code> or <code>title="Expected response"</code>.
- Never use generic or invented file labels such as `snippet.ts`, `example.sh`, `config.yaml`, `script.ts`, or `output.txt`. If the fragment belongs in no file, title the operation rather than manufacturing a filename.
- Prefer the site-supported form <code>```ts title="src/.../file.ts"</code>. Keep the title exact when the snippet is copied from a maintained example; otherwise describe it as an illustrative fragment in the surrounding sentence.
- Include only imports needed to understand the snippet.
- Use current public builders/helpers and generated CLI shape by default. Label lower-level escape hatches as advanced.
- Keep names consistent across the page and diagram.
- Add inline comments only for non-obvious intent, ownership, safety, or a critical default. Do not narrate syntax.
- Show omitted surrounding code explicitly when omission could confuse compilation or wiring.
- Follow setup code with an invocation and expected output/state.
- Split a snippet when it introduces more than one new concept or requires scrolling to compare related lines.
- Link to a maintained full example instead of expanding the page into an application dump.
- Verify snippets against implementation, tests, generated output, or a compile/run check. Never reconstruct public API shapes from memory.
- Present maintained examples as consumer applications. Their public run path
  installs declared dependencies and uses package-local `typecheck`, `test`,
  `build`, and `start` scripts; it must not require readers to build PURISTA or
  Harness dependency workspaces first. Keep monorepo-maintainer bootstrap
  commands out of end-user instructions.
- When the supported Node engine provides native environment-file loading,
  prefer a package script such as `node --env-file-if-exists=.env dist/index.js`
  over a `dotenv` dependency or hand-written parser. Commit a safe
  `.env.example`, never `.env`, and keep deterministic tests independent of
  credentials and network access.
- Do not copy a redundant opt-out field into every example when the verified
  runtime default already denies the capability. State the default once near
  the decision, and show explicit configuration only when it changes behavior.
- A snippet that declares `implements SomePublicInterface` must implement every
  required member and be usable at the shown wiring boundary. For a partial
  adapter teaching only shared configuration, use an explicitly abstract base
  or a standalone typed capability/configuration object; never present it as a
  concrete bridge that a service can receive.

Use fictitious identifiers such as `invoice-123` or `tenant-demo`, but do not log or propagate them as recommended telemetry attributes if they represent sensitive identity in the real system.

## Types and builder examples

- Keep configuration inline when the fluent builder already owns its schema and
  type propagation. This keeps the definition focused and lets the builder
  infer its contract from the chain.
- For a genuinely reusable named definition or configuration object, use the
  narrowest public semantic type and prefer `as const satisfies Type` to
  `as Type`. `satisfies` catches unsupported keys while retaining literal
  values for later inference.
- Import a standalone type from the package the application is meant to depend
  on. Do not teach a direct import from a package that happens to be transitive.
- A type assertion is acceptable only at a proven boundary that cannot be
  expressed safely (for example, a controlled generic test fixture). Explain
  the boundary and keep the assertion local; it is not a substitute for a
  configuration contract.
- After a fluent builder snippet, explain each non-obvious call in the order it
  appears. Include its purpose, required and optional inputs, defaults or
  modes that alter behavior, runtime effect, and the most relevant failure or
  trade-off. A concise table is usually clearer than repeating the chain in
  prose.
- Link the task guide to stable generated API member anchors for exact
  signatures. Do not link an unstable reflection ID, an unrelated class, or a
  generic “methods” section when a member-level link exists.

For public schemas that are exported into service definitions or OpenAPI:

- describe the business meaning of the object and non-obvious fields, not the
  validation syntax already visible in the schema;
- verify that the current schema converter preserves the chosen metadata API;
- add only a few schema-valid, synthetic examples when they improve client
  understanding;
- keep operation summaries, transport behavior, and HTTP-specific prose in the
  exposure metadata rather than overloading field descriptions; and
- never use a production identifier, tenant, credential, personal value, or
  secret as an example.

## Decision guidance

Give advice at the point of choice.

| Choice | Use when | Avoid when | Main tradeoff |
|---|---|---|---|

Name the criterion that changes the recommendation: delivery guarantee, latency, ordering, durability, consistency, operational dependency, team ownership, provider lock-in, cost, security boundary, or deployment topology.

Use do/don't guidance for tempting near-misses:

| Do | Don't | Why |
|---|---|---|

Do not present pros and cons that are generic to every technology. Keep only decision-relevant consequences.

## Formatting choices

| Content | Preferred form |
|---|---|
| ordered actions | numbered list |
| independent checks or properties | bullet list |
| option or adapter comparison | table |
| exact code/config/command | fenced code block with language |
| request/response or expected output | focused code block |
| architecture or ownership | Mermaid flowchart or small schematic |
| interaction over time | Mermaid sequence diagram |
| lifecycle or failure transitions | Mermaid state diagram |
| decision branches | compact decision tree or table |
| critical condition | concise callout near the affected step |

Nest lists only when the parent-child relationship matters. If a nested list becomes a miniature article, split it into sections or pages.

## Diagrams

Every diagram must answer a question that prose alone would answer less clearly.

- Keep one dominant idea per diagram.
- Split a dense lifecycle into two or three focused diagrams at semantic
  handoffs rather than shrinking labels or grouping ordered callbacks into an
  opaque node. Keep one exact ordered table when readers also need sequence
  lookup.
- Label edges with commands, events, data, or decisions rather than generic arrows.
- Show ownership and trust boundaries when they affect the design.
- Keep Mermaid node text short and use surrounding prose for detail.
- Match names used in code and tables.
- Explain the takeaway immediately before or after the diagram.
- Avoid decorative diagrams, unlabeled flows, and diagrams that repeat a list without adding relationships.

## Accessibility and scanning

- Keep heading levels sequential and headings descriptive.
- Give meaningful alt text to informative images; use empty alt text for purely decorative images.
- Do not rely on color alone for status or meaning.
- Keep table cells concise and make wide comparisons usable on small screens; split tables when necessary.
- Ensure code blocks wrap or scroll without hiding essential context.
- Avoid Mermaid labels that become unreadable in dark mode or mobile rendering.
- Use link text that names the destination or action; avoid repeated “learn more.”
- Put the key decision or expected result before long supporting detail.

## Editing pass

For each section, ask:

1. Does this change the reader's understanding, action, or decision?
2. Is it in the earliest place where it becomes useful?
3. Is it already explained canonically elsewhere?
4. Can a table, example, diagram, or link replace repetitive prose?
5. Can any sentence be shorter without losing a condition or guarantee?
6. Does every code block have the correct language and a meaningful path/action/result title?
7. Does every code block prove the page's outcome?
8. Are safety and failure claims precise rather than reassuring?

Remove content that fails the first question.
