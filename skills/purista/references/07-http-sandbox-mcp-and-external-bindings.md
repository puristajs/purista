# HTTP, Sandbox, MCP, and External Bindings

Use this reference when the design crosses transport or execution boundaries.

## Transport rule
HTTP, MCP, and external bindings expose builder-declared capabilities. They do not replace service definitions.

## Sandbox rule
Sandbox execution is runtime infrastructure for isolated tool execution. It should be declared and wired explicitly, not treated as ambient shell access.

## External binding rule
Use provider-neutral binding surfaces where the runtime already offers them, especially in agent code.

## Anti-patterns
- coupling service design to one HTTP route tree
- teaching sandbox usage without the runtime adapter and scope rules
- placing external API or MCP coupling directly into application core when it belongs behind a resource or binding
