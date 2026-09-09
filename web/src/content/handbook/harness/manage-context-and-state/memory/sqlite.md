---
title: Use SQLite memory
description: Use the SQLite memory adapter for single-host persistent application memory.
order: 622
---

Install the adapter, provide a writable path, and bind it with
`definition.getInstance({ memory })`. SQLite is suitable for one trusted host;
use a shared engine for multiple workers. Vector search may require the pinned
native SQLite extension described by the adapter package. Test restart,
concurrent access, migrations, retention, and authorization.
