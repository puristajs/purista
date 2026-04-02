# HTTP, Sandbox, MCP, and External Bindings

Use this reference when the design crosses transport or execution boundaries.

## Transport rule
HTTP, MCP, and external bindings expose builder-declared capabilities. They do not replace service definitions.

## HTTP runtime rule
Use the Hono-based HTTP server surface as the active PURISTA HTTP runtime. Legacy `@purista/httpserver` guidance should not be used for new implementation or architecture work.

## Sandbox rule
Sandbox execution is runtime infrastructure for isolated tool execution. It should be declared and wired explicitly, not treated as ambient shell access.

## External binding rule
Use provider-neutral binding surfaces where the runtime already offers them, especially in agent code.

## Anti-patterns
- coupling service design to one HTTP route tree
- teaching sandbox usage without the runtime adapter and scope rules
- placing external API or MCP coupling directly into application core when it belongs behind a resource or binding
- relying on removed or deprecated runtime packages when the active platform surface has already moved on
