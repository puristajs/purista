ATTACH TABLE _ UUID 'c99bb566-e73a-46bb-a07b-6d891820b2c7'
(
    `tenant` String,
    `collector_id` String,
    `exporter_id` String,
    `timestamp` DateTime,
    `data` String
)
ENGINE = Distributed('cluster', 'signoz_traces', 'usage', cityHash64(rand()))
