ATTACH TABLE _ UUID 'c135fc56-a1d8-48f2-ae01-b70304f88616'
(
    `name` String,
    `datatype` String
)
ENGINE = ReplacingMergeTree
ORDER BY (name, datatype)
SETTINGS index_granularity = 8192
