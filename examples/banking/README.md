# Example Bank

This is the runnable source for the PURISTA banking tutorial series. It uses
synthetic accounts and transactions. It does not implement payment settlement,
real banking compliance, or a production identity provider.

## Run the first checkpoint

From the `purista` repository root:

```sh
npm run dev -w @purista/banking-tutorials
```

The application listens on `http://127.0.0.1:3010`. The generated PURISTA HTTP
API is mounted under `/api/v1`.

The local-only `x-example-actor` header selects a synthetic authenticated actor:

- `alice` owns `account-a` and may read it.
- `bob` has a read/export mandate for `account-a`, but cannot record postings.
- `carol` owns `account-c`.
- `dana` is assigned to record already-posted synthetic transactions for
  `account-a`.

For example, retrieve Alice's account history:

```sh
curl -H 'x-example-actor: alice' \
  http://127.0.0.1:3010/api/v1/accounts/account-a/transactions
```

The local header is an intentionally visible fixture. It is not an
authentication mechanism. The authentication and business-permission tutorial
replaces it with a server-validated local session while retaining the same
business guard rules.

## Verify the checkpoint

```sh
npm run typecheck -w @purista/banking-tutorials
npm run test -w @purista/banking-tutorials
```

The HTTP integration tests prove the business decision and transform lifecycle:
a valid mandate can read only its account; a valid logged-in bookkeeper cannot
post; an authorized operations actor can import a legacy transaction where
`"125.40"` becomes `12540` minor units.

## Reset

The default profile uses deterministic in-memory fixtures. Stop and restart the
application to reset data, or run:

```sh
npm run reset -w @purista/banking-tutorials
```

Later tutorial checkpoints add their own dependency profiles and isolated reset
behavior. Do not use the in-memory profile to claim persistence, durable queues,
or sandbox isolation.
