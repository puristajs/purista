---
title: LLM Context Files
order: 90
---

# LLM Context Files

PURISTA now ships `llms.txt` files to provide compact, machine-readable guidance for coding agents.

## Where to find them

- Repository root: [`/llms.txt`](https://github.com/puristajs/purista/blob/master/llms.txt)
- Sandbox package: [`/packages/sandbox-service/llms.txt`](https://github.com/puristajs/purista/blob/master/packages/sandbox-service/llms.txt)
- Extended context (sandbox): `packages/sandbox-service/llms-full.txt`

## When to use which file

- Use `llms.txt` for fast routing and short context windows.
- Use `llms-full.txt` only for deep implementation sessions where extra detail is required.

## Skills

The sandbox package also includes curated skill docs under:

- `packages/sandbox-service/skills/`

These files are optimized for agent execution workflows (architecture, service implementation, infra, and testing).

## Recommended practice

When building or updating AI agents in PURISTA:

1. Start with root `llms.txt`.
2. Add package-specific `llms.txt` for the target package.
3. Load only the required skill file(s) for the current task.
