# Fresh packed consumer

The verifier discovers this fixture by its package.json, copies it into a fresh scratch directory, and installs exact locally packed Core and Harness tarballs offline. Run `npm run typecheck`, `npm test`, and `npm run build` separately. The test executes a real Harness agent using its deterministic test provider; no credentials are needed.
