# Sandbox analysis tutorial source

This project exposes a protected PURISTA command that invokes a native Harness
agent with three explicit sandbox tools: `write`, `bash`, and `read`.

```bash
npm install
npm run build
npm test
npm run lint
npm run demo
```

Build the local sandbox image with `docker compose build`, resolve its immutable
`sha256:...` image id with `docker image inspect`, and assign that id to
`PURISTA_DOCKER_SANDBOX_IMAGE`. Unit tests and the default demo use a private
temporary local sandbox with a `python3` command allowlist and need no Docker
daemon or API key. This proves the tool loop and permissions, not process
isolation. Run `npm run test:docker` with the image id set to verify the actual
Docker boundary.
