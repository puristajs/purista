# Sandbox Driver Selection Guide

This guide helps you choose the right virtualization backend for your `@purista/sandbox` implementation.

## Comparison Table

| Driver | Best For | OS Support | License | Performance |
| :--- | :--- | :--- | :--- | :--- |
| **Docker** | General Development | Mac, Linux, Windows | Proprietary (Desktop) | High |
| **Lima** | Open-Source Mac VM | Mac (Apple Silicon) | Apache 2.0 | Native |
| **Podman** | Security-First Containers | Mac, Linux | Apache 2.0 | High |
| **Tart** | OCI macOS/Linux VMs | Mac (Apple Silicon) | Proprietary (Free/Paid) | Native |
| **Firecracker**| Production Isolation | Linux Bare-Metal | Apache 2.0 | Highest |

---

## 1. DockerSandboxDriver
The default choice for most users. Compatible with Docker Desktop, OrbStack, and Colima.
- **Pros**: Easy setup, huge ecosystem, consistent behavior.
- **Cons**: Docker Desktop requires a paid license for large organizations.

## 2. LimaSandboxDriver (Recommended for Mac)
A 100% open-source alternative for Apple Silicon that uses the native Apple Virtualization Framework (`vz`).
- **Pros**: No licensing fees, native performance, very lightweight.
- **Cons**: Requires `limactl` to be installed on the host.

## 3. PodmanSandboxDriver
Excellent for environments where security and rootless operation are priorities.
- **Pros**: Daemonless, rootless by default, open source.
- **Cons**: Slight differences in networking and volume handling compared to Docker.

## 4. FirecrackerSandboxDriver
The industry standard for secure, multi-tenant function execution (used by AWS Lambda).
- **Pros**: Strong hardware-level isolation, sub-second boot times.
- **Cons**: Requires Linux KVM support; more complex networking configuration (TAP devices).
