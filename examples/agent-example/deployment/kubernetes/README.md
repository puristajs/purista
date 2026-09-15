# Kubernetes production reference

This directory intentionally contains no Secret and no cluster-scoped
`VolumeSnapshotClass`. Before applying it:

1. replace the application and sandbox image placeholders with reviewed image
   digests;
2. set storage and snapshot class names for the cluster CSI driver;
3. create `purista-agent-example-secrets` with `DATABASE_URL`,
   `OPENAI_API_KEY`, and `PURISTA_SANDBOX_IMAGE`;
4. narrow application egress to the exact Kubernetes API, PostgreSQL, DNS, and
   model-provider destinations;
5. verify the namespace quota, retention, encryption, backup, and orphan
   cleanup policy with the platform owner.

```sh
kubectl apply -k examples/agent-example/deployment/kubernetes
kubectl -n purista-agent-example rollout status deployment/purista-agent-example
```

Both application replicas use PostgreSQL and the stable `support-v1` runtime
id. Each process constructs one shared Harness for all Support service agents
and workflows. Sandbox Pods, PVCs, control records, and snapshots are confined
to `purista-sandboxes`; the created sandbox service account has no Kubernetes
API permissions of its own.

