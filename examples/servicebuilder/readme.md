# Service builder example

A service builder will help to create a service and provides the possibility to extract information and definitions for auto creating configurations.  
This will be usefull if you like to migrate your project to some specific architecture, deployment or cloud provider.

With help of service builder, a service can get a schema validated configuration quickly. It also simplifies how functions and subscriptions are added to the service.

This example is using the `@purista/amqpbridge` package.

## Steps

1. Create a new `ServiceBuilder` instance - see [src/service/user/UserServiceBuilder.ts](src/service/user/UserServiceBuilder.ts)
2. (optional) Add a own service class if you really need it - see [src/service/user/UserServiceCustomClass.ts](src/service/user/UserServiceCustomClass.ts)
3. Create your functions and subscriptions with `.getFunctionBuilder` and `.getSubscriptionBuilder` methods from `ServiceBuilder` instance
4. Add your function and subscription definitions to your service with help of service builder - see [src/service/user/index.ts](src/service/user/index.ts)
