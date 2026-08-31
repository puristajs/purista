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

Open `http://127.0.0.1:3010/` to use the small React login screen. It asks
which synthetic tutorial person you want to use, then calls the local login
route. The server creates an opaque, HttpOnly cookie named
`example_bank_session`. Generated PURISTA API routes use the server-side
session record to obtain the principal and tenant; a browser request cannot
choose them through an API header or payload.

For command-line requests, create the same local fixture session and save its
cookie in a local file. The documented local people have these business
permissions:

- `alice` owns `account-a` and may read it.
- `bob` has a read/export mandate for `account-a`, but cannot record postings.
- `carol` owns `account-c`.
- `dana` is assigned to record already-posted synthetic transactions for
  `account-a`.

```sh
curl --fail -c .tutorial-cookie -X POST http://127.0.0.1:3010/auth/login \
  -H 'content-type: application/json' \
  --data '{"actor":"alice"}'
```

Then send the saved cookie with a protected API request:

```sh
curl --fail -b .tutorial-cookie \
  http://127.0.0.1:3010/api/v1/accounts/account-a/transactions
```

This is a local learning fixture, not a production identity provider. It does
not verify passwords, external tokens, tenant membership, CSRF controls, or
production session storage. The business guards still make the separate
decision about whether the signed-in person may read an account or record a
transaction.

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
