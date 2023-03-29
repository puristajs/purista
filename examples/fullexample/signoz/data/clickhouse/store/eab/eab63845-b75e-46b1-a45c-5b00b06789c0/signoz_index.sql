ATTACH TABLE _ UUID 'c5ad6a2e-60b0-4eef-a592-c6492d9ada96'
(
    `timestamp` DateTime64(9) CODEC(Delta(8), ZSTD(1)),
    `traceID` String CODEC(ZSTD(1)),
    `spanID` String CODEC(ZSTD(1)),
    `parentSpanID` String CODEC(ZSTD(1)),
    `serviceName` LowCardinality(String) CODEC(ZSTD(1)),
    `name` LowCardinality(String) CODEC(ZSTD(1)),
    `kind` Int32 CODEC(ZSTD(1)),
    `durationNano` UInt64 CODEC(ZSTD(1)),
    `tags` Array(String) CODEC(ZSTD(1)),
    `tagsKeys` Array(String) CODEC(ZSTD(1)),
    `tagsValues` Array(String) CODEC(ZSTD(1)),
    `statusCode` Int64 CODEC(ZSTD(1)),
    `references` String CODEC(ZSTD(1)),
    `externalHttpMethod` Nullable(String) CODEC(ZSTD(1)),
    `externalHttpUrl` Nullable(String) CODEC(ZSTD(1)),
    `component` Nullable(String) CODEC(ZSTD(1)),
    `dbSystem` Nullable(String) CODEC(ZSTD(1)),
    `dbName` Nullable(String) CODEC(ZSTD(1)),
    `dbOperation` Nullable(String) CODEC(ZSTD(1)),
    `peerService` Nullable(String) CODEC(ZSTD(1)),
    `events` Array(String),
    `httpMethod` LowCardinality(String) CODEC(ZSTD(1)),
    `httpUrl` LowCardinality(String) CODEC(ZSTD(1)),
    `httpCode` LowCardinality(String) CODEC(ZSTD(1)),
    `httpRoute` LowCardinality(String) CODEC(ZSTD(1)),
    `httpHost` LowCardinality(String) CODEC(ZSTD(1)),
    `msgSystem` LowCardinality(String) CODEC(ZSTD(1)),
    `msgOperation` LowCardinality(String) CODEC(ZSTD(1)),
    `hasError` Int32,
    `tagMap` Map(LowCardinality(String), String),
    INDEX idx_traceID traceID TYPE bloom_filter GRANULARITY 4,
    INDEX idx_service serviceName TYPE bloom_filter GRANULARITY 4,
    INDEX idx_name name TYPE bloom_filter GRANULARITY 4,
    INDEX idx_kind kind TYPE minmax GRANULARITY 4,
    INDEX idx_tagsKeys tagsKeys TYPE bloom_filter(0.01) GRANULARITY 64,
    INDEX idx_tagsValues tagsValues TYPE bloom_filter(0.01) GRANULARITY 64,
    INDEX idx_duration durationNano TYPE minmax GRANULARITY 1
)
ENGINE = MergeTree
PARTITION BY toDate(timestamp)
ORDER BY (serviceName, -toUnixTimestamp(timestamp))
SETTINGS index_granularity = 8192
