---
title: Secrets and sensitive data
description: Keep credentials and sensitive payloads out of source, messages, logs, traces, and metrics.
order: 1013
---

Use workload identity or the deployment platform's approved secret delivery for
fixed technical credentials needed at startup. Use a dedicated secret-store
adapter for sensitive values managed while the application runs. The core
secret-store base class treats returned values as sensitive; preserve that
policy in your resources, error handling, and observability configuration.

## Resolve only where the credential is used

Keep a secret reference in configuration and resolve its runtime-managed value
through the secret store when the resource needs it. Fixed startup credentials
can instead be supplied to that resource at the composition root. Neither form
belongs in generated configuration, command payloads, or service contracts.

```ts title="src/service/email/v1/command/sendReceipt/sendReceiptCommandBuilder.ts"
const secrets = await context.secrets.getSecret('emailProviderAuthToken')
const token = secrets.emailProviderAuthToken

if (!token) {
  throw new Error('email provider credential is unavailable')
}

await context.resources.emailClient.send({
  authorization: `Bearer ${token}`,
  to: payload.recipient,
  template: 'receipt',
})
```

Never include `token`, an authorization header, or the full provider response
in a thrown error, log entry, span attribute, metric label, event, or queue
payload. A local `DefaultSecretStore` is useful for a developer machine and
tests; it is in-memory and not production secret management. See [the local
default](/handbook/framework/configure-applications/secret-stores/default/) and
choose a production [secret-store adapter](/handbook/framework/configure-applications/secret-stores/)
before deployment.

| Do | Do not |
| --- | --- |
| Resolve runtime-managed secrets through the secret store at the resource/handler boundary | Put tokens in a command/event payload |
| Supply fixed technical credentials through deployment configuration or workload identity | Expose raw bootstrap credentials as general handler configuration |
| Use TLS and backing-store encryption for sensitive persisted data | Rely on a topic/queue name to protect contents |
| Record low-cardinality operational facts | Add emails, tenant IDs, raw payloads, or authorization headers to telemetry |
| Rotate through the backing secret system | Commit a fallback credential for local convenience |

## Protect data after it leaves the handler

Use TLS for every transport and backing store, encrypt persisted sensitive data
where required, and minimize data placed on a broker. For AMQP, the default
payload encrypter is pass-through. Add application-level payload protection or
keep sensitive data out of broker messages. Encryption does not replace
authorization: recipients and operators that can decrypt the message still need
least-privilege permissions.

Plan rotation as an operational path: update the value in the backing secret
system, refresh or restart the resource according to the adapter's behavior,
and verify a request with the new credential. Do not add a checked-in fallback
to make an unavailable secret silently work.

Next: [chapter overview](/handbook/framework/secure-and-operate/security/).
