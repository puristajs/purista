---
order: 200020
title: Schemas & Validation
description: Schemas and validation in PURISTA
image: /graphic/builder.png
---

# Schemas and Validation in PURISTA

PURISTA heavily utilizes schemas for various purposes. Schemas play a crucial role in validation, TypeScript type generation, and the creation of other structures such as OpenAPI definitions.

While PURISTA offers support for a wide range of schema libraries, particularly thanks to [Typeschema.com](https://typeschema.com/#coverage), it is strongly recommended to utilize [Zod](https://zod.dev/) as the primary schema library. This recommendation is due to the extensive ecosystem surrounding Zod, which enables the implementation of advanced features like OpenAPI schema generation.

It's important to note that only Zod schemas will receive first-class support within PURISTA.

Additionally, we provide a helper function called `extendApi` for Zod schemas, which enables the implementation of various advanced features.

For example:

```typescript
import { extendApi } from '@purista/core'

const mySchema = extendApi(z.object({
  example: extendApi(z.string(), {title: 'An example property', example: 'example value' } ),
}), { title: 'Some description', example: { value: 'example' } })
```

This schema not only includes raw validation and type information but also encompasses descriptions and example values. We leverage these values to enhance the OpenAPI documentation and other automated documentation processes. Moreover, new developers will find helpful explanations and examples directly within the source code.

## Other libraries

If you have the need to use other schema and validation libraries, you will need to install some additional dependencies.  
Please have a look at the official documentation of [TypeSchema.com](https://typeschema.com/#coverage) to find the adapter package.

In addition to the TypeSchema adapter, you might need additional packages as well, to convert the validation schema into [JSON Schema](https://json-schema.org).

Internally, PURISTA is using OpenAPI 3.1/JSON Schema to share interfaces between services.  
As an example, the HTTP server is using the input schema definitions of services, provided in as OpenAPI 3.1/JSON schema.

As an example, to use [Yup](https://yup.dev) schema, you will need to add:

- `yup` itself
- `@typeschema/yup`
- `@sodaru/yup-to-json-schema`