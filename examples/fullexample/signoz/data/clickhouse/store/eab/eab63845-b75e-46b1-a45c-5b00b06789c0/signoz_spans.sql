ATTACH TABLE _ UUID '556cd2e6-237c-40cf-8a89-035f35680722'
(
    `timestamp` DateTime64(9) CODEC(DoubleDelta, LZ4),
    `traceID` FixedString(32) CODEC(ZSTD(1)),
    `model` String CODEC(ZSTD(9))
)
ENGINE = MergeTree
PARTITION BY toDate(timestamp)
ORDER BY traceID
TTL toDateTime(timestamp) + toIntervalSecond(604800)
SETTINGS index_granularity = 1024, ttl_only_drop_parts = 1
