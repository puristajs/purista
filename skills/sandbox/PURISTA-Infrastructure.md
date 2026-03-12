# SKILL: PURISTA-Infrastructure

## 1. Intent
Configure and optimize the PURISTA messaging layer (Event Bridge, Queues, Streams) for high availability and reliability.

## 2. Decision Matrix: Event Bridges
| Environment | Bridge | Reason |
| :--- | :--- | :--- |
| **Local / Test** | `DefaultEventBridge` | Zero infra required, in-memory performance. |
| **Production** | `NatsBridge` | Native support for Streams (JetStream) and Queues. |
| **Legacy / Shared** | `RedisBridge` | Easy scaling, high familiarity. |

## 3. Implementation Pattern: Durable Messaging
To ensure no messages are lost during service downtime:
1.  **Use NatsBridge** with JetStream enabled.
2.  **Declare Subscriptions** as durable using the bridge-specific configuration extensions.
3.  **Implement Reconcilers**: Always include a subscription that listens for `ServiceStarted` to synchronize external infrastructure state.

## 4. Troubleshooting Messaging Issues
- **Command Timeouts**: Check if the receiver service is running and connected to the same Event Bridge subject prefix.
- **Duplicate Execution**: Ensure `Queue Groups` are correctly configured in the bridge.
- **Message Lost**: Verify if the bridge supports persistence and if the subscription was declared as durable.

## 5. Security & Isolation
- **Tenant Isolation**: Always pass the `tenantId` in the message context for multi-tenant applications.
- **Subject Prefixes**: Use strict namespacing (e.g., `org.project.service`) to avoid message collision in shared brokers.
