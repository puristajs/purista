---
order: 200020
title: Schemas & Validation
description: Schemas and validation in PURISTA
image: /graphic/builder.png
---

# Schemas and Validation in PURISTA

PURISTA is highly using schemas.  
Schemas are used for validations, typescript type generation and other generations like OpenApi definitions.

PURISTA itself supports a wide range of schema libraries - thanks to [Typeschema.com](https://typeschema.com/#coverage).  
But, it is recommended to use [Zod](https://zod.dev/) as schema library, as there is a large eco-system around, which enables us to provide features like OpenApi schema generation.

__Only Zod schema will have first class support in PURISTA!__

We also provide a helper `extendApi`for Zod schema, to enable some cool features.

As an example:

```typescript
import { extendApi } from '@purista/core'

const mySchema = extendApi(z.object({
  example: extendApi(z.string(), {title: 'An example property', example: 'example value' } ),
}), { title: 'Some description', example: { value: 'example' } })
```

This schema will not only contain the raw validation and type information. It also contains descriptions and example values. We are using these values, to enrich the OpenApi documentation and other automated documentations.  
Also, any new developer will have some nice explanation and examples in the source code.