---
order: 10
title: Create a new service
shortTitle: Create new Service
description: Create your first typescript service in PURISTA with a function and a subscription implementation in simple typescript/javascript.
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

A service is a logical group of functions and subscriptions. This where the domain driven aspect comes in.  
In our example, we will use the classic example - Users.

We want to have the domain *User* and the following functionality:

- sign up a new user
- send a welcome email to user

## Set up a new service

First, we need to create a new service.  
All we need to do is to create a new class which extends the `Service` class.

Create a folder `src/service/user` and inside this folder create a file `UserServiceBuilder.ts` with following content:

```typescript
import { ServiceBuilder, ServiceInfoType } from '@purista/core'

export const userServiceInfo: ServiceInfoType = {
  serviceName: 'User',
  serviceVersion: '1',
  serviceDescription: 'service which handles all user related information',
}

export const UserServiceBuilder = new ServiceBuilder(userServiceInfo)
```

Create a file `UserService.ts` in `src/service/user` with following content:

```typescript
import { UserServiceBuilder } from './UserServiceBuilder'

export const UserService = UserServiceBuilder
```

Add a file `index.ts` in `src/service/user` and export our user service.

```typescript
export * from './UserService.ts'
```

Now we are ready to use our Service *User* in our `src/index.ts`.  
Extend the file as shown below:

```typescript
  // add imports
  import { UserService, userServiceInfo} from './service/user'


  // at the end of function main below await httpServerService.start()

  // create the user service instance
  const userService = UserService.getInstance(eventBridge)

  // start the user service
  await userService.start()
```

Our domain service *User* is now created, initialized and started.
It has no functionality yet, so let's add some logic.

