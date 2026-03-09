---
title: LLM Context Files
order: 90
---

# LLM Context Files

PURISTA ships published `llms` context files to provide compact, machine-readable guidance for coding agents.

## Where to find them

- Public root context: [`/llms/llms.txt`](/llms/llms.txt)
- Public root deep context: [`/llms/llms-full.txt`](/llms/llms-full.txt)
- Public sandbox context: [`/llms/sandbox-service.txt`](/llms/sandbox-service.txt)
- Public sandbox deep context: [`/llms/sandbox-service-full.txt`](/llms/sandbox-service-full.txt)
- Repository source: [`/llms.txt`](https://github.com/puristajs/purista/blob/master/llms.txt)

## When to use which file

- Use `llms.txt` for fast routing and short context windows.
- Use `llms-full.txt` only for deep implementation sessions where extra detail is required.

## Skills

Sandbox-related curated skills are in:

- [`/skills/sandbox-service/`](https://github.com/puristajs/purista/blob/master/skills/sandbox-service/META-SKILL.md)

These files are optimized for agent execution workflows (architecture, service implementation, infra, and testing).

## Recommended practice

When building or updating AI agents in PURISTA:

1. Start with `/llms/llms.txt`.
2. Add `/llms/sandbox-service.txt` for sandbox work.
3. Load only the required skill file(s) for the current task.
