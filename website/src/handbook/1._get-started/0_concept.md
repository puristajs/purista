---
order: 1
title: Concept of PURISTA
shortTitle: Concept
description: A general description of the concept of the typescript based nodejs backend PURISTA.
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

## PURISTA

- [Focus on business logic](#focus-on-business-logic)
- [Move fast forward](#move-fast-forward)
- [Decuple from infrastructure](#decuple-from-infrastructure)
- [Minimize vendor lock](#minimize-vendor-lock)
- [Stateless implementation](#stateless-implementation)
- [Separation of concerns](#separation-of-concerns)
- [Predictable behavior](#predictable-behavior)
- [Maintenance](#maintenance)
- [Low learning curve](#low-learning-curve)
- [KISS - keep it stupid simple](#kiss)
- [Security](#security)

## Focus on business logic

These 4 words are describing the intention and motivation behind PURISTA.

Focus on business logic, solve the client's issue, provide features for them and just deliver!  
It might need to change the mindset a bit.  
The question is not, how to implement some feature. The question is, what exactly does the client need and how can the clients issue be solved.

Just go through your own code and check what is your daily business?

You get some kind of input, you validate it, you compute something, request some data, maybe persist some data, and you return some result or you call/trigger some other function.  
You will have to handle errors, retries, logging, tracing, alerting and all that stuff.  
Than you have all that stuff you need to care, only because of _"We have [...] as infrastructure"_.

How much setup, configuration, abstraction, layers do you really need, and how much code do you produce for even simple stuff?  
How much of you code is really business logic?

Also, the customer does not care, if you product is running in the cloud, if it is deployed as lambda or k8 cluster.

So, why do you care about that, during implementation of business logic?

## Move fast forward

Move fast forward - what does it mean here?

It means, that in many projects, a lot of time and money is burned, only to handle the project itself. And at the end, the whole project is failing, because the whole focus is on _(handling)_ the project itself, but not on the product you build.

**BUT YOU MUST FOCUS ON THE BUSINESS PRODUCT**

If you look at projects, a common timeline looks like this:

### 1. The baby steps

Start with a small team/single developer providing a prove of concept (POC), prototype or kind of mock.  
Maybe, some early adapters as customers.

**This is fast!**  
No worries about anything - simply fast deliver features.  
Implement functionality and write code!
But, very often kind of dirty code, quick-solutions, "works for now"...  
Here, the first technical deps and legency code is created!  

### 2. The thing is growing

The whole project grows - more people, more ideas, more wishes, more needs.  
There are more programmers, devops people, scrum masters, consultants and so on.  
The first fundamental question around business, infrastructure, architecture, legal come up.

**The fruit basket in the office**  
At this point, you have more people, but you need also a lot of time and resources to handle them.  
The amount of meetings is growing and a lot of time is spend around questions like:

- Which pattern to use to implement stuff
- How to split work across multiple developers and teams
- who is responsible for what
- what do we need from legal perspective
- timelines and waterfall
- third party provider and other dependencies
- blocker, bugs, issues
- deployment
- infrastructure
- monitoring & alerting

### 3. Transformation to real product

Transforming the code from the baby steps into a real, stable, production ready product is very often a challenge. This step goes hand in hand with the growing step.  

**The evolution hits hard**  
The evolution of transforming the former poc or prototype into a real product, means that you need to handle all the technical deps and legency code. There will be a lot of refactoring, rewriting and internal project work.  
This covers the whole range from proper input validation, up to make it ready for deployment on the final infrastructure.  
On the other hand, a lot of small & medium features needs to come in and a bunch of bugs must be fixed, to have a real product.

### 4. Run and enhance the product

For running and enhancing a product, the project team size mostly shrink and a lot of people are leaving the project.  
This also means a knowledge drain.

**Make money**  
In this phase, the decision will be made, if you earn money or if you only have wasted a lot of time, ressources and money.  
Do you get enough customers? Can you hold the customers? Are your customers happy? Do they love your product?  
All these questions depending on the one holy question: **_"Do we have a real product, which solves user issues?"_**.

### 5. Maintain the product

At this point, most developers from previous steps are no longer part of the project or have moved to different responsibilities. This means a lot of knowledge is gone.  
The overall capacity of people is low, and for newcomers it is very often a hard, challenging learning curve, to figure out how all of this works. And why. And why not. And what impacts are on the other end of your setup, if someone changes something somewhere.

If you don't want to have a "never touch the monster" at this point, you must take care of it in the previous phases!

**The island is waiting**  
Here, there must be a regular, stress free, daily business which simply makes profit.

### Why PURISTA solves issues

PURISTA helps to improve all these phases of a project.  

In step _"1. Baby steps"_, prototypes and poc's can be implemented in same speed. But it reduces the "dirty parts".  
You will know, that what you are implementing is ready to get deployed on many different infrastructures, it has proper error handling, validation and all that stuff. You project and code is structured in a way, that it can be handled by multiple developers and teams.

In fact, you might build a prototype or poc with limited features on a limited infrastructure. But you already implement stuff in a way, as you would have a real product on a super fancy infrastructure. This means much, much less trouble later on.

The issues in step _"2. The thing is growing"_ can't be fully solved by a framework, as they are mostly "human" issues. But PURISTA can help here on many basic questions.

As the code is already separated into different domains and responsibilities, you only need to decide who is working on what and who is responsible for which part.  
Also programmers can go on, to implement features and fixing bugs, while the devops magicans can prepare and provide a super fancy infrastructure. **Independently!**  
Monitoring, tracing and so on, is provided by the framework and ready for third party solutions.  
Also discussions around patterns and implementation details, will be reduced to a bare minimum, as there are already global unified patterns with focus on simple, testable and maintainable code.

The phase _"3. Transformation to real product"_ is more or less gone on a technical level, as you started from beginning with building a product. There, the only needs comes from business side - which features do we need and which bugs do we need to solve. And this is totally fine and wanted. Your focus is client facing and not around _"how to get it running"_.

For step _"4. Running and enhancing"_ a stable product, which is build in a modular and predictable way, isn't that hard. As you do not need to know, how other functionality is implemented, you can simply extend your product with more commands and subscriptions and build even more complex business logic.

Also the clear structure, defined interfaces, predictability and the human readable code with auto documentation, lowers the barrier for newcomers and unexperienced developers.

This helps, also to avoid trouble in step _"5. Maintain the product"_.

## Decuple from infrastructure

One of the key features of PURISTA is the separation of business logic from infrastructure and/or architectural decisions.  
It's done by the concept of having services with functions and subscriptions which are communicating over some (blackbox) event bridge.

How they are orchestrated, deployed and where they are running does not matter.

You can decide, if you want to deploy your logic as a single monolith or in some microservice style or as serverless functions, or if you like a mix of multiple styles.  
There is no need to decide if you like to use your own server or some cloud provider.  

It also allows integrating other services and providers, without touching the core of your application. Simply add them to the event bus.  
This is also a great option for larger projects, with multiple teams. Each team can work independently.

## Minimize vendor lock

One of the big topics is vendor lock.  
It is a huge topic. PURISTA does not try to solve the overall issue here. But it provides methods and helpers to tackle the topic.  
The main focus is, to be able, to start the implementation, and at some point, to move to a more complex infrastructure and specific vendor.

In theory, you are able to move your whole business logic to any other provider. But, this is theory, and highly depends on your current implementation.  
Databases are a great example for this.  
If you use some ORM, which is able to support different database solutions, than the chances are high, that the effort to switch the cloud vendor is pretty low.  
On the other hand, if a cloud vendor database solution is directly used, it will need refactoring inside your business logic.  

To help developers building software, which avoids vendor locks as much as possible, PURISTA provides some unified interfaces. As an example: PURISTA provides interfaces for config stores, state stores and secret stores.  
This provides a way, to only refactor/switch the current implementation at one place, while keeping the business logic untouched.

## Stateless implementation

One of the main ideas in PURISTA is, to have stateless implementations. This allows much more flexibility when it comes to questions around infrastructure and scaling.  
Stateless implementation in PURISTA, does not mean to have a business logic without states. The concept here is, to persist business states in solutions like key-value databases, redis and similar. The business state should not be persisted or hold by the software instances itself.  
If instances are decoupled from business states, they can be scaled in a much more flexible way. Also, the business implementation becomes decoupled from deployment/architectural decisions - monolithic vs microservice vs functional.

## Separation of concerns

Depending on your experiences, this might be hard or easy going. Separation of concerns is more a kind of mindset, than a fixed pattern or style.

As an example:  

You got a task "Implement user onboarding", and there is something like "allow only valid emails, store the user in database and send a welcome mail".  
From a feature or business perspective, this is one single step "user onboarding".  
Many developers will automatically get a POST http endpoint in mind - something like:

```typescript
async (request,response)=>{
  if(!request.body.email.match(emailRegex)){
    return response.send(400,'Invalid email')
  }

  const confirmKey = crypto.randomUUID()

  const db = await getDbClient()
  let user:User|undefined
  try {
    user = await db.insert('insert into user values (....)', { ...request.body, confirmKey })
    
  } catch (error) {
    console.log(error)
    if(error instanceof ConstraintViolation) {
      return response.send(400,'User already exists')
    }
    //...further error handling
  }
  
  try {
    const provider = getEmailProvider()
    const emailText = `Welcome ${user.userFirstName} ${user.userLastName}!
    
    Please confirm your membership: http://example.com/confirm/${user.userId}?key=${confirmKey}
    `

    await provider.sendEmail(user.email,'Welcome')
  }catch(err) {
    console.log(err)
  }

  response.send(200,{ id: user.id }) 

}

```

At this point, developers would now instantly start with abstractions, as they want to improve readability, be able to unit test and so on.

So, you would probably see some `isUserEmailValid` abstraction function (100% for sure 😂), some wrappers around the database stuff, and some abstractions around sending the email. This might solve the developers issues, and produces a lot of nice bloat code. 

**BUT it does not solve the business issue**!  

In fact, the issues and complexity are only hidden behind more code. At the end, you can write abstractions as much as you want, but at some point you need to do the "real" logic.  
Don't get it wrong! Simply keep the balance. Abstractions and wrappers are ok and valid. But they are also a warning signal. Ask yourself always, why do you need it at some point. Can you avoid it with better design choices? Does it improve things from a business perspective? Or, do I need the code snippets, to handle own code?

In this example, one of the bussiness issues is: "how to retry sending of the email, if the users is persisted".  

Try to solve issues by design! Not by more error handling or additional code logic.  
Also, when the user onboarding becomes more complex (like creation of resources for new user), this function will become very quickly the little "nobody wants to touch me" monster.

With separation of concerns in mind, this will turn into 3 main parts.

1. Input validation is one single step, and it does not matter what happens with the validated input afterwards.  
2. Storing something in a database, and maybe handling database connection or issues, is the next part. It does not matter what happens "around" this persistence part. Simply take something and put it into database. That's it.  
3. Sending an email is our third step. In this step, only the email is sent. It does not matter when, how the user is created or persisted. And you can retry the email part as you like.

The same functionality with PURISTA would result in two services.  
One service for domain user and one service for domain email.  
The user service is only responsible for handling users.  
The email service is only responsible for handling emails.

The command would like like this:

```typescript
export const signUpCommandBuilder = userServiceBuilder
  .getCommandBuilder('signUp', 'sign up a new user and store the users data')
  .setSuccessEventName(ServiceEvent.NewUserRegistered)
  .addPayloadSchema(userV1SignUpInputPayloadSchema)
  .addParameterSchema(userV1SignUpInputParameterSchema)
  .addOutputSchema(userV1SignUpOutputPayloadSchema)
  .exposeAsHttpEndpoint('POST', '/user')
  .setCommandFunction(async function (_context, payload, _parameter) {
    const db = await getDbClient()
    const confirmKey = crypto.randomUUID()

    const emailExists = await db.get('select id from user where email (...)', payload.email)
    if(emailExists) {
      throw HandledError(StatusCode.BadRequest, 'user already exist')
    }

    const user = await db.insert('insert into user values (....)', { ...payload, confirmKey })

    return {
      userId: user.id,
      email: user.email,
      userFirstName: user.firstName,
      userLastName: user.lastName,
      confirmKey,
    }
  })
```

The subscription would look like this:

```typescript
export const sendWelcomeEmailSubscriptionBuilder = emailServiceBuilder
  .getSubscriptionBuilder('sendWelcomeEmail', 'send a welcome email to new onboarded users')
  .subscribeToEvent(ServiceEvent.NewUserRegistered)
  .addPayloadSchema(emailV1SendWelcomeEmailInputPayloadSchema)
  .addOutputSchema(ServiceEvent.WelcomeNewUserEmailSent, emailV1SendWelcomeEmailOutputSchema)
  .setSubscriptionFunction(async function (_context, payload, _parameter) {
    const provider = this.getEmailProvider()

    const emailText = `Welcome ${payload.userFirstName} ${payload.userLastName}!
    
    Please confirm your membership: http://example.com/confirm/${payload.userId}?key=${payload.confirmKey}
    `

    await provider.sendEmail(payload.email,emailText)

    return {
      userId: payload.userId,
    }
  })
```

You might say: "Hold on! It looks like more code and more complex!".

The answer is yes and no.

There are now some more files and maybe some more lines of code if you only count line numbers.

But, we have also a lot more functionality.

1. the business related code itself is reduced and improved
2. the command and the subscription have both propper input and output validation
3. error handling is mostly done automatically and error responses have a propper schema
4. the different things are separated and decoupled (changes in email domain do not impact in user domain)
5. retry of sending the email will be provided by the underlaying event bridge
6. simple to test - see [chapter: Testing](../5._testing/0_testing.md)

## KISS

Keep things as simple as possible and do not overcomplicate everything.  
Do not try to do some fancy stuff only _"Because I can"_.  
Do not try to write typescript in the style of other languages like JAVA. If you want to write Java code - it's fine - but then please use Java.

Do not lose yourself in patterns and abstractions and stuff like this.  
Object/class style fits best for your current needs? Use it!
Functional programming style makes more sense at some other point? Use it!
An abstraction at a specific code snipped makes sense? Do it!
Some layer might not be necessary or overkill? Remove it!

You got all the knowledge! Use it! Mix it up! Your code - your rules!  
Do not write hundreds of code lines, only because of "that is the correct way to follow the XXX pattern" or "it is the way you have to use the framework".

Don't write 100 lines if you can do it in 5 (only if you don't get payed per line, of course).

## Low learning curve

Using PURISTA should be easy and joyfull.  
Even with beginner level knowledge it should be possible to build cool, stable and production ready stuff.  
There are lots of "If you want or if you need, you can...".  
There are some "It is recommended, to ...".
But there are only a few "You must...".

Also, there is a wild mix of adaptions from known things like microservices, domain driven development, functional programming, event patterns, messaging systems. So, anybody with some fundamental experiences, will get the "ah, I know this, it's like..." effect.  
No rocket science at all - but hopefully it rocks your next project 🚀.

## Predictable behavior

Predictable behavior is one of the fundamentals of PURISTA.

As an example, let's mention the integrated input/output validation here.  
In normal scenarios, every input and result output of a function is validated against a schema at runtime.  
It provides also proper types out of the box during development.

This means you already know there will be no technical incorrect input at any point, no unwanted output which might leak some data, and you exactly know the error handling on invalid data.  
You can now focus on validating data only on business level.

Also, any thrown error will be automatically caught, logged and transformed into a defined error(-response) shape.

Especially javascript/typescript is often blamed for its error handling, but this also some opportunity.  
It is js/typescript - let it throw! PURISTA will handle the worst case for you!  
You don't need to implement error handling for any possible error which might occur.  
Handle only the errors you need to handle at business level!

There is simply no need, to have always some wrapped result, where you need to check, if it is a success or failure. And if it is a failure, what kind of failure and how to handle it and how to bubble up the error.

The usage of some unified exchange bus allows to highly configure what "happens when...". It allows building setups which are able to redo things, recover states, execute "when available" and so on.

## Maintenance

Maintenance is very important to any project and highly impact costs and speed of future enhancements.  

PURISTA tries to lower the effort and costs for maintaining by splitting high complex scenarios into small, simple pieces in combination with defined interfaces and the ability to version services.

This offers opportunities, like having different versions in parallel, instead of dangerous "close eyes, press switch button and fingers crossed".

But more important:

Smaller pieces are easier to understand, easier to change, easier to test, and you avoid the cascading "if I touch this, I need to touch everything".

**Last but not least!**  
By separating things into small pieces and different domains, you are able to have split work, responsibility across multiple developers & teams!

## Security

To build secure and stable software is essential for success.

Using PURISTA does not mean you end up with a 100% bulletproof solution without any effort. But it reduces or prevents a lot of possible issues by design.  
Having a solid input/output validation on any single step, means an increase of overhead and also longer execution time. But it is worth to have it in place.  
You prevent the system by design, to allow technical invalid input (implausible), you verify the technical correctness (plausible) on each step, and you prevent your system to leak data accidentally.  
It also simplifies any audit, as you can go through each step of your system, and you can prove "I verify that... and on error it will... it will not allow to...".

So, PURISTA does not even try to avoid security issues like low encryptions, multi-vector-high profile hacker attacks or similar. But it builds a solid basement for your software. Based on validation, unified interfaces, error handling, predictable behavior and strict separation.  
A stable, solid and robust software, which only exposes needed information, means higher barrier for attackers and lower the risks for bugs.

## Main idea

The concept behind PURISTA is quite simple and a message based approach.  
There are message senders and receivers.  
Messages are exchanged via an event bridge which is connected to some kind of message broker.  

The logic resists in Service. They are the DDD part.  
A service is a logical group of commands and subscriptions which are relating to a single domain.  

Commands are active triggered by someone, and the caller expects some kind of result. This is similar to functions in any programming language. It means the caller knows about the existence of the called service & command, and he knows at least the input and output format and maybe something about possible error responses.
How the called command function is implemented or how it is working is unknown and not related to the caller. Also the caller does not know which instance is handling the requests.

Subscriptions are a passive part, like event listeners. A subscription is triggered as soon as a message matches the subscription criteria. The producer of this message does not have knowledge about this subscription.

Commands and subscription can call other commands from same or other service by sending command messages. This means, there is a clean, structured and unified internal interface, which is also observable and traceable with error handling out of the box.

This allows real complex setups and scenarios.

## Example

We will use a simple example for better understanding.

![example](/graphic/user_email_example.svg)

- the browser calls the endpoint `/api/v1/sign-up`
- the web server will send a command request `userSignUp` to the event bridge which is received by a instance of service `User`
- the command `userSignUp` is responding to web server with the ID of this new created user via the event bridge
- the response of command `userSignUp` is marked with the event name `newUserRegistered`
- the web server will receive the response command `userSignUp` and sends the response back to the browsers
- the service `Email` has a subscription `sendWelcomeEmail` which is listening to all successful calls to `newUserRegistered` command
- the subscription `sendWelcomeEmail` in service `Email` connects to the mail provider and sends the email

Each of these steps is only one single and simple function, which is easy to implement, to understand and to test.
Each of these steps has input-output-validation in place.
Each step has its own error handling and responses are divided into success and error response.
Each step is decoupled from the others.

The different services can be implemented by different developers, which are able to work independently on their feature.