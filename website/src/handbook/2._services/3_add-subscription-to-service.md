---
order: 30
title: Add a subscription to a service
shortTitle: Add a subscription
description: Add a subscription to an existing service
tag:
  - typescript
  - nodejs
  - javascript
  - backend
  - framework
  - cloud
  - microservice
  - lambda
  - Installation
  - Setup
  - Guide
---

Now, our service should not only be able to create new users. New users should get a welcome or confirmation email.

You could pack the send email logic into our existing function, but this might not the best way.  
Why?  
Because you start mixing up different things, increase the complexity of one simple, single function, and it increases the test complexity, while decreasing the stability and maintenance.

It's better to have a subscription, which listens for all new created users and email them.  
This allows you:

- to implement retry mechanism on sending an email more easily
- lowers the amount of mocking & stubbing within single unit tests
- reduces the request response time for the user, as there is no need to wait for the email to be sent
- keeps your "creation" code clean and easy by separating the "email send" code
- decouple things and remove/avoid dependencies
- separate user creation and sending an email in deployment later on (allows different scaling if needed)

Back to our example.  

Create a new subfolder `src/service/user/subscriptions/sendWelcomeEmail` and create files `index.ts`.
