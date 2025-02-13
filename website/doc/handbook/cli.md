---
title: Installation & CLI
description: Use the PURISTA CLI to setup your project, create services, commands and subscriptions.
order: 30
---

# CLI

The easiest and fastest way to start with PURISTA is the usage of the PURISTA CLI tool.  

<div style="overflow:hidden;margin-left:auto;margin-right:auto;border-radius:10px;width:100%;max-width:800px;position:relative"><div style="width:100%;padding-bottom:75%"></div><iframe width="800" height="600" title="A quick intro how to start using the typescript framework PURISTA." src="https://snappify.com/embed/9309a984-a36b-4302-9335-990254c9d313?responsive" allow="clipboard-write" allowfullscreen="" style="background:#eee;position:absolute;left:0;top:0;width:100%" frameborder="0"></iframe></div>

You can use the CLI tool to create a new PURISTA project or to add PURISTA to an existing project.  
Open your terminal and go to your project folder where you like to install PURISTA.

In the project folder, simply execute:

::: code-group

```bash [npm]
npm create purista@latest
```

```bash [bun]
bun create purista@latest
```

```bash [yarn]
yarn create purista@latest
```

```bash [pnpm]
pnpm create purista@latest
```

:::

It might take a short time to download the needed data to its temporary folder and start the CLI tool.  
The CLI tool will guide you through all the necessary steps.  
If you are installing in an existing project, no files will be overwritten, and it might be, that you need to do some manual steps.

__It is highly recommended to choose global CLI install during setup__.

You can also manually install the PURISTA CLI via:

::: code-group

```bash [npm]
npm install -g @purista/cli
```

```bash [bun]
bun add --global @purista/cli
```

```bash [yarn]
yarn global add @purista/cli
```

```bash [pnpm]
pnpm add -g @purista/cli
```

:::

If you have installed the CLI globally, you can add service, commands and subscriptions to your project.  
In your project root simply run:

```bash
purista add [service|command|subscription] [name]
```
