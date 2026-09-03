# Classify a support message with a mounted Harness agent

This focused Example Bank checkpoint shows the complete source introduced by
the tutorial chapter. `Support` owns one native `@purista/harness` definition.
The definition is mounted once on the PURISTA service. A normal protected
command invokes the published agent through its versioned EventBridge address.

Install and verify it like a normal published-package consumer:

```sh
npm install
npm run lint
npm run build
npm test
```

The tests use `FakeModelProvider` and need no API key. An application that starts
this service supplies a real provider, for example `openai({ apiKey })`, through
the service's `ai.models.primary` runtime binding. Provider credentials never
belong in the portable Harness definition.
