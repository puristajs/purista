---
title: Infisical
description: Store secrets in Infisical — open-source secrets platform with a developer-friendly UI and self-hosting option.
order: 302250
---

# Infisical

`@purista/infisical-secret-store` connects to [Infisical](https://infisical.com/) — an open-source secrets management platform with a polished developer UI, GitHub sync, environment-scoped secrets, and both cloud and self-hosted deployment options.

## Capabilities

| Feature | Support |
|---|---|
| Read (`getSecret`) | ✅ |
| Write (`setSecret`) | ✅ (opt-in) |
| Delete (`removeSecret`) | ✅ (opt-in) |
| Environment-scoped secrets | ✅ |
| Self-hosted option | ✅ |
| Infisical Cloud | ✅ |
| Secret versioning | ✅ |
| GitHub / CI sync | ✅ (Infisical-native) |

## Install

```bash
npm install @purista/infisical-secret-store
```

## Setup

```typescript
import { InfisicalSecretStore } from '@purista/infisical-secret-store'

const secretStore = new InfisicalSecretStore({
  bearerToken: process.env.INFISICAL_TOKEN ?? '',
  // Point to Infisical Cloud or your self-hosted instance:
  baseUrl: process.env.INFISICAL_URL ?? 'https://app.infisical.com',
  enableSet: true,
  enableRemove: true,
})

const myService = await myV1Service.getInstance(eventBridge, { secretStore })
```

Obtain a service token from the Infisical project settings. Tokens are scoped to a project and environment.

## Usage inside a handler

```typescript
.setCommandFunction(async function (context, payload) {
  const { sendgridApiKey } = await context.secrets.getSecret('sendgridApiKey')
  // use sendgridApiKey to send email
})
```

## Self-hosting with Docker Compose

Infisical provides an official Docker Compose setup for local or on-premise deployment. The `docker-compose.yml` in the `@purista/infisical-secret-store` package reads connection config from a root `.env` file for convenience:

```bash
# .env
INFISICAL_URL=http://localhost:8080
INFISICAL_TOKEN=your-service-token  # mapped to bearerToken in the store constructor
```

## Operational tips

- Create one service token per PURISTA service with the minimum required environment scope
- Use Infisical's secret override feature to manage per-environment values (dev/staging/prod) without duplicating secrets
- Infisical supports syncing secrets to GitHub Actions, Vercel, Netlify, and other CI/CD platforms — useful for bridging application secrets and pipeline secrets
- Self-hosted Infisical runs with PostgreSQL and Redis; enable backups for both

## Related

- [Secret Store overview](../stores.md)
- [Default Secret Store](./default_secret_store.md)
- [HashiCorp Vault](./vault_secret_store.md)
- [AWS Secrets Manager](./aws_secret_store.md)
