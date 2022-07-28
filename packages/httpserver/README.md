# @purista/httpserver

Package with http server based on [fastify](https://www.fastify.io).

**Visit [purista.dev](https://purista.dev)**

## set principalId

```typescript
.addHook('preHandler', (req, reply, done) => {
  req.principalId = 'Bob Dylan'
  done()
})
```
