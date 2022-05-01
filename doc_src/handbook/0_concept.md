---
# This control sidebar index
index: 0
# This is the icon of the page
icon: brain fas
# This is the title of the article
title: Concept
# A page can have multiple tags
tag:
  - Installation
  - Setup
  - Guide
# this page is sticky in article list
sticky: true
# this page will appear in article channel in home page
star: true
---

# Concept

The concept behind PURISTA is quite simple and a message based approach.  
There are message senders and receivers. Messages are exchanged via an eventbridge.  

The logic resists in Service. They are the DDD part.  
A service is a logical group of commands and subscriptions which are relating to a single domain.  

Commands are active triggered by someone and the caller expects some kind of result. This is similar to a functions in any programming language. It means the caller knows about the existence of the called service & command and he knows at least the input and output format and maybe something about possible error responses.
How the called command function is implemented or how it is working is unknown and not related for the caller.

Subscriptions are a passive part like event listeners. A subscription is triggered as soon as a messages matches the subscription criteria. The producer of this message does not have knowledge about this subscription.

Commands and subscription can call other commands from same or other service by sending command messages. This means, there is a clean, structured and unified internal interface, which is also observable and traceable with error handling out of the box.

This allows real complex setups and scenarios.

Example:

```mermaid
flowchart RL
    browser[Browser] -->|/api/v1/user/sign-up| httpService(HTTPS-Service)
    httpService-- user payload -->eventBridge(Eventbridge)
    eventBridge-- user payload -->signUp
    subgraph UserService
        signUp
        verifyEmail(verifyEmail)
    end
    signUp-- user id -->eventBridge
    eventBridge -- user id --> httpService
    httpService -- user id --> browser
    eventBridge -.-> verifyEmail
    signUp --> database
    database -- user id --> signUp
    verifyEmail -- set token -->database
    verifyEmail --> eventBridge
    eventBridge --> sendMail
    subgraph EmailService
        sendMail
    end

    eventBridge -.-> countEmails
    subgraph Audit
        countEmails(countEmails)
    end
    countEmails --> database
    database[(Database)]
```

- the browser calls the endpoint `/api/v1/user-sign-up`
- the webserver will send a command request `signUp` to service `User`
- the command `signUp` is responding to webserver with the id of this new created user
- the webserver will respond to the browsers request
- the service `User` has a subscription `verifyEmail` which is listening to all successfull calls to `signUp` command
- the subscription `verifyEmail` in service `User` is creating a verification token which is stored in users domain, creates the email subject and body and is sending a command `sendEmail` to the service `Email`
- the `sendEmail` command in service `Email` connects to the mail provider and sends the email
- in service `Audit` we have also some subscription `countEmails` which is listening to all invocation responses of command `sendMail` from service `Email` which is counting success and failure.
...and so on

Each of this steps is only one single and simple function, which is easy to implement, to understand and to test.
Each of this steps has input-output-validation in place.
Each step has it's own error handling and responses are divided into success and error response.
Each step is decoupled from the others.

In our example:
If creating the new user is failing, none of the other steps is started and the browser receives a propper error response.
If sending of verification email is failing, it does not effect the user creation and it is traced by the `Audit` service.

If you might want to extend this, to send two-factor-pin via sms, you simply need to add a new service `SMS` with a command `sendSms`.
Add a subscription `send2FA` in service `User`, which is listening to successfull user creations like the `verifyEmail` subscription does.  
Invoke `sendSms` in service `SMS` from subscription `send2FA` in service `User`.

We might need a new version of user sign up, because now, the input payload has a required field `phoneNumber` for our 2FA.
But we do not want to break any existing and working thing.

We simply copy the whole service `User` to a new service `User2`.  
For service `User2` we bump version to `2.0.0`.

All api endpoints for `User2` are now directly available as `api/v2/` and our new Service is also reachable by all other services.  
Now we can safely make our changes in `User2` and mark `api/v1/` as deprecated.  
As soon as we finished our changes, tested them and so on, we can completely switch to the new version and remove the old one.

