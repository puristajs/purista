# Sandbox Driver Selection Guide

This guide helps you choose the right virtualization backend for your `@purista/sandbox` implementation.

## Comparison Table

| Driver | Best For | OS Support | License | Performance |
| :--- | :--- | :--- | :--- | :--- |
| **Docker** | General Development | Mac, Linux, Windows | Proprietary (Desktop) | High |
| **Podman** | Security-First Containers | Mac, Linux | Apache 2.0 | High |
| **Lima** | Experimental open-source Mac VM | Mac (Apple Silicon) | Apache 2.0 | Native |
| **Tart** | Experimental Apple virtualization | Mac (Apple Silicon) | Proprietary (Free/Paid) | Native |
| **Firecracker**| Experimental Linux microVM | Linux Bare-Metal | Apache 2.0 | Highest |

---

## 1. DockerSandboxDriver
The default choice for most users. Compatible with Docker Desktop, OrbStack, and Colima.
- **Pros**: Easy setup, huge ecosystem, consistent behavior.
- **Cons**: Docker Desktop requires a paid license for large organizations.

## 2. LimaSandboxDriver (Experimental)
A 100% open-source alternative for Apple Silicon that uses the native Apple Virtualization Framework (`vz`).
- **Pros**: No licensing fees, native performance, very lightweight.
- **Cons**: Requires `limactl` to be installed on the host; restart reconciliation is disabled because owner metadata cannot be recovered safely.

## 3. PodmanSandboxDriver
Excellent for environments where security and rootless operation are priorities.
- **Pros**: Daemonless, rootless by default, open source.
- **Cons**: Slight differences in networking and volume handling compared to Docker.

## 4. TartSandboxDriver (Experimental)
Uses Apple virtualization with Tart images.
- **Pros**: Native Apple virtualization workflow.
- **Cons**: Restart reconciliation is disabled because owner metadata cannot be recovered safely.

## 5. FirecrackerSandboxDriver (Experimental)
Provides a starting point for Linux microVM isolation.
- **Pros**: Strong isolation model.
- **Cons**: Requires Linux KVM support; command execution and file-transfer handling are still incomplete.
