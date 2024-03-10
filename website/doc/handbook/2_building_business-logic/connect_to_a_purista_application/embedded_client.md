---
title: Embedded client
description: Export the service defintions to share them and to use them for building connectors or visualizations
order: 210030
---

# Create an embedded client

The embedded client is an abstraction of a client.  
If you start building an application, it might be a good starting point to build it as monolith in a single repository, to keep the overhead low and to be able to deliver features quickly.  
But at some point you might want to split the monoloth into different, independent parts.  
Here, an embedded client acts as placeholder, which can be swapped out by a real client for distributed systems.

A good example, where this is the preferred way: [GraphQL server](../exposing_endpoints/graphql_mutation_and_query.md)
