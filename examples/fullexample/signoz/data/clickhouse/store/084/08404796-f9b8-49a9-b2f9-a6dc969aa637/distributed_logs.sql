ATTACH TABLE _ UUID 'b20cde5d-e187-4416-ab46-c26b8008f9e3'
(
    `timestamp` UInt64 CODEC(DoubleDelta, LZ4),
    `observed_timestamp` UInt64 CODEC(DoubleDelta, LZ4),
    `id` String CODEC(ZSTD(1)),
    `trace_id` String CODEC(ZSTD(1)),
    `span_id` String CODEC(ZSTD(1)),
    `trace_flags` UInt32,
    `severity_text` LowCardinality(String) CODEC(ZSTD(1)),
    `severity_number` UInt8,
    `body` String CODEC(ZSTD(2)),
    `resources_string_key` Array(String) CODEC(ZSTD(1)),
    `resources_string_value` Array(String) CODEC(ZSTD(1)),
    `attributes_string_key` Array(String) CODEC(ZSTD(1)),
    `attributes_string_value` Array(String) CODEC(ZSTD(1)),
    `attributes_int64_key` Array(String) CODEC(ZSTD(1)),
    `attributes_int64_value` Array(Int64) CODEC(ZSTD(1)),
    `attributes_float64_key` Array(String) CODEC(ZSTD(1)),
    `attributes_float64_value` Array(Float64) CODEC(ZSTD(1))
)
ENGINE = Distributed('cluster', 'signoz_logs', 'logs', cityHash64(id))
