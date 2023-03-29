ATTACH TABLE _ UUID 'a83a8845-093c-4501-9f53-8faeb6fea496'
(
    `version` Int64,
    `dirty` UInt8,
    `sequence` UInt64
)
ENGINE = MergeTree
ORDER BY sequence
SETTINGS index_granularity = 8192
