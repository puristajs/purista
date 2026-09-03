# Sandbox analysis tutorial source

This project exposes a protected PURISTA command that invokes a native Harness
agent with three explicit sandbox tools: `write`, `bash`, and `read`.

```bash
npm install
npm run build
npm test
npm run lint
```

Build the local sandbox image with `docker compose build`, resolve its immutable
`sha256:...` image id with `docker image inspect`, and assign that id to
`PURISTA_DOCKER_SANDBOX_IMAGE`. Unit tests use a private temporary local sandbox
with a `python3` command allowlist and need no Docker daemon or API key.
