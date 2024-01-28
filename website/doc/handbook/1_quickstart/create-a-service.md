---
title: Create a Service
description: Create the first PURISTA service
order: 103000
image: /graphic/add_service.png
---

# Create the first service

![Add service with cli](/graphic/add_service.png)

A service is a logical group of functions and subscriptions. This is where the domain driven aspect comes in.
In our example, we will use the classic example - Users.

At the end, we want to have two domains - *User* and *Email*.

We will need to have this functionality:

- sign up a new user
- get a user by email
- send a welcome email to user

## Set up a new service

First, we need to create a new service.
You can simply add a new service by using the CLI tool.

```bash
purista add service
```

The CLI will guide you through all steps, and will create all files for your.
In the first step, you will asked for the name of our new service.
We will start with _User_.

```bash
? What is the name (or domain) of your new service (something like: user or account)
```

::: tip

Service names should be short and in best case a single word - like user or email.
They should reflect a single entity or domain name.
You can enter the name in natural way. The CLI tool will take care of casing and whitespaces.
For example, if you have a domain _bank account_, you can simply type in _bank account_.  The CLI tool will convert it to something like _bankAccount_
:::

After you have confirm your input by pressing the enter key, you will be asked for a short description of the service.

```bash
? What is the matter of service "user"
```

Here, you should enter some short, general description, which will be used for some human-facing documentation.
So, please provide here something like: _manages data related to users_.

In the last step, you will be asked for the version of your service.  It defaults to _1_, which you can simply confirm by pressing the enter key.
If you need to create a new version of an existing service, you can enter any integer number larger than _1_.

```bash
Version number of this service (1)
```

Now, all files should be generated.

## Start the service
