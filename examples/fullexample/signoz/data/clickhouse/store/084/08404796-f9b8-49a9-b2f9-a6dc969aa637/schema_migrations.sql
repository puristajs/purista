ATTACH TABLE _ UUID '7c66ad4d-0cfd-4ea7-ae0d-1d6ecc7a1902'
(
    `version` Int64,
    `dirty` UInt8,
    `sequence` UInt64
)
ENGINE = MergeTree
ORDER BY sequence
SETTINGS index_granularity = 8192
