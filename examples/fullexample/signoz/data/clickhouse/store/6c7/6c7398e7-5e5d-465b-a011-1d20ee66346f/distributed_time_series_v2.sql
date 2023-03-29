ATTACH TABLE _ UUID 'd242f20c-b34f-4d62-95a0-decf7d791dd3'
(
    `metric_name` LowCardinality(String),
    `fingerprint` UInt64 CODEC(DoubleDelta, LZ4),
    `timestamp_ms` Int64 CODEC(DoubleDelta, LZ4),
    `labels` String CODEC(ZSTD(5))
)
ENGINE = Distributed('cluster', 'signoz_metrics', 'time_series_v2', cityHash64(metric_name, fingerprint))
