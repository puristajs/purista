ATTACH TABLE _ UUID 'cbc4c5e5-b2b9-4169-a88c-92cbdde23acd'
(
    `tenant` String,
    `collector_id` String,
    `exporter_id` String,
    `timestamp` DateTime,
    `data` String
)
ENGINE = Distributed('cluster', 'signoz_logs', 'usage', cityHash64(rand()))
