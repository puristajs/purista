---
order: 10
title: Quickstart with CLI
shortTitle: Quickstart with CLI
description: Install and setup a PURISTA typescript framework project.
image: https://purista.dev/graphic/advertise_large.png
---

The easiest and fastest way to start with PURISTA is the usage of the PURISTA CLI tool.  

You can use the CLI tool to create a new PURISTA project or to add PURISTA to an existing project.  
Open your terminal and go to your project folder where you like to install PURISTA.

In the project folder, simply execute:

::: code-tabs#shell

@tab:active npm

```bash
npx @purista/cli init
```

@tab bun

```bash
bunx @purista/cli init
```

:::

It might take a short time for `npx` to download the needed data to its temporary folder and start the CLI tool.  
The CLI tool will guide you through all the necessary steps.  
If you are installing in an existing project, no files will be overwritten, and it might be, that you need to do some manual steps.

## 1. Confirm installation

Confirm that you like to install PURISTA in the current folder.
Confirm by pressing enter or `y` key.

```bash
? Initialize PURISTA in current folder Yes
```

## 2. Global vs local

Decide how you like to install the CLI tool for further usage.

If you install PURISTA CLI globally or as local project develop-dependency.  
Global installation is recommended, as you are able to simply execute the CLI tool with `purista` command.  

You can choose your preferred option by using the arrow-up/down keys, and confirm by pressing the enter key.

```bash
? Install PURISTA cli globally? (Use arrow keys)
❯ install as global npm module 
  as local module in this project only 
```

## 3. Choose dev-tools

Decide if you like to use linter & prettier for better code style and jest & sinon as test tools.

It is recommended to use such tools as they dramatically improve developers' lives and, especially if you do not work on your own on a project, the code will stay consistent.  
Because of this, code style and testing are pre-selected.  

You can navigate with the arrow-up/down keys and (de-)select by pressing the space key. To confirm your selection, press the enter key.

```bash
? Do you like to install eslint and prettier for better code formatting? (Press <space> to select, <a> to toggle all, <i> 
to invert selection, and <enter> to proceed)
❯◉ code style: eslint and prettier
 ◉ testing: jest and sinon
```

## 4. Choose event bridge

Select the messaging system - event bridge - you like to use.

You can navigate to the preferred one with the arrow-up/down keys and confirm selection by pressing the enter key.

```bash
? Which messaging system should be used (Use arrow keys)
❯ local internal default eventbridge 
  AMQP eventbridge (RabbitMQ)
```

## 5. Optional http server

Decide if you like to install the PURISTA http-server package or not.

It is recommended to install this package, as because of this feature, you should be able to execute commands and trigger subscriptions very easily.

You can confirm the installation by pressing the enter or `y` key or decline by pressing the `n` key

```bash
? Should the @purista/httpserver package be installed, to automatically provide a REST api server? (Y/n)
```

## 6. Http server static plugin

Decide if you like to install the http static plugin (only if http server installation is previously selected).

This package can be used to serve some static files from a folder. This might be very helpful during development and testing.  
In production, you might choose some other option like CDN.

You can confirm the installation by pressing the enter or `y` key or decline by pressing the `n` key

```bash
? Should the http service be able to provide static files - files and assets like images & css? (Y/n)
```

## 7. Nip on your coffee

Now the installation process starts and npm will download depending on modules and needed files will be created.

If everything is working as expected, you will see a success message.

```bash
🎉 SUCCESS - PURISTA project ready 🎉
Enjoy building awesome applications with PURISTA 🚀
Now it is time to add your first service!

➡️  purista add service

✔  -> 📖 Learn more about PURISTA at https://purista.dev
```

## 8. Try out

If you've installed the recommended PURISTA http-server, you can directly try out your installation.

```bash
npm start
```

And then open [http://localhost:9090/api](http://localhost:9090/api) or if you also have installed the static plugin, simply [http://localhost:9090](http://localhost:9090)

You can now read a bit more about recommended folder structure, which is also used by the CLI at [Recommended structure](2_recommended_project_structure.md).

## 9. Add Logic

Now, it is time for you, to add some business logic.  

Start with [creating a new Service](../2._start-building/2.1_service/1_create-new-service.md).
