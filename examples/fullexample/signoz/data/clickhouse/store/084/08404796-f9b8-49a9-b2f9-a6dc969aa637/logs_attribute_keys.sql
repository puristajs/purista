ATTACH TABLE _ UUID '69af05f4-5cf8-4947-8623-ffe2776dd805'
(
    `name` String,
    `datatype` String
)
ENGINE = ReplacingMergeTree
ORDER BY (name, datatype)
SETTINGS index_granularity = 8192
