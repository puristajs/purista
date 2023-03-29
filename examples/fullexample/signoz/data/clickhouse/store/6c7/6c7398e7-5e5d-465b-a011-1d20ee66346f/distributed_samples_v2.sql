ATTACH TABLE _ UUID '0c386de1-c325-47f6-ac94-5e6e968e8632'
(
    `metric_name` LowCardinality(String),
    `fingerprint` UInt64 CODEC(DoubleDelta, LZ4),
    `timestamp_ms` Int64 CODEC(DoubleDelta, LZ4),
    `value` Float64 CODEC(Gorilla, LZ4)
)
ENGINE = Distributed('cluster', 'signoz_metrics', 'samples_v2', cityHash64(metric_name, fingerprint))
