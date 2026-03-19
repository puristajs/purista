# Secure Git and GitHub Authentication

The `@purista/sandbox` provider implements a security-first approach to handling Git credentials for AI agents and users.

## How it Works

When you provide a `gitConfig` with a token, the following happens inside the sandbox:

### 1. GitHub CLI Authentication
We use the official GitHub CLI (`gh`) as the primary identity provider.
- **Secure Piping**: The token is piped directly into `gh auth login --with-token` via `stdin`. This ensures the token never appears in the container's process list or shell history.
- **No Trace**: The token is stored in the container's secure memory by the `gh` tool, not in cleartext environment variables.

### 2. Git Credential Helper
Instead of storing the token in `.gitconfig` (which is highly insecure), we configure Git to use the GitHub CLI as its credential helper:
```bash
git config --global credential.helper "!gh auth git-credential"
```
This means whenever Git needs to clone or push, it asks the `gh` tool for the current token. The token is never written to disk in a plain-text configuration file.

### 3. Commit Attribution
The driver automatically configures `user.name` and `user.email` globally within the running instance, ensuring all commits are correctly attributed to the user/agent without baking them into the shared Docker image.

## Usage Example

```typescript
const sandbox = await eventBridge.invoke({
  serviceName: 'Sandbox',
  serviceTarget: 'createSandbox',
  payload: {
    projectId: 'my-project',
    gitConfig: {
      username: 'agent-bot',
      email: 'bot@example.com',
      token: process.env.GITHUB_TOKEN // Securely passed from your vault
    }
  },
  tenantId: 'my-org',
  principalId: 'user-123'
})
```
