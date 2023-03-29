ATTACH TABLE _ UUID '26809612-e5e5-43fb-8380-67c797e927f8'
(
    `tenant` String,
    `collector_id` String,
    `exporter_id` String,
    `timestamp` DateTime,
    `data` String
)
ENGINE = Distributed('cluster', 'signoz_metrics', 'usage', cityHash64(rand()))
