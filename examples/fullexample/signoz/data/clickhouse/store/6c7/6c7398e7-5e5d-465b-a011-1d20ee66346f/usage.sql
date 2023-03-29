ATTACH TABLE _ UUID 'ca690320-43d6-4a62-858e-8b381259bd12'
(
    `tenant` String,
    `collector_id` String,
    `exporter_id` String,
    `timestamp` DateTime,
    `data` String
)
ENGINE = MergeTree
ORDER BY (tenant, collector_id, exporter_id, timestamp)
TTL timestamp + toIntervalDay(3)
SETTINGS index_granularity = 8192
