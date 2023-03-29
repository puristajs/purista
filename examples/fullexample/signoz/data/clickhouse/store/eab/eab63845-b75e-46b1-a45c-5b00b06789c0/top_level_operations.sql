ATTACH TABLE _ UUID '66a03add-9ff5-414f-a849-daeb0ec01502'
(
    `name` LowCardinality(String) CODEC(ZSTD(1)),
    `serviceName` LowCardinality(String) CODEC(ZSTD(1))
)
ENGINE = ReplacingMergeTree
ORDER BY (serviceName, name)
SETTINGS index_granularity = 8192
