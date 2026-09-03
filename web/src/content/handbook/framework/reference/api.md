---
title: API reference
description: Use generated API documentation for current public signatures and this handbook for architecture and operational guidance.
order: 1250
---

The generated API reference is the canonical source for exported TypeScript signatures, option types, and package-level symbols. Consult it when a guide shows a deliberately small snippet and you need the full callable contract.

- Start with the [API reference](/handbook/api/).
- Check the exact package version installed by the application before copying an option from another version.
- For optional adapters, open that package's generated API entry after choosing it in [package availability](/handbook/framework/reference/packages-and-feature-availability/).
- If the API and a prose guide disagree, verify the installed public types and report the documentation drift rather than guessing.

Generated signatures describe code shape; they do not replace the external provider's security, retention, pricing, or availability documentation. Use the adapter guide to identify that ownership boundary.
