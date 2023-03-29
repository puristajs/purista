ATTACH TABLE _ UUID '1954ab74-38cf-41be-a58a-a48815788779'
(
    `name` String,
    `datatype` String
)
ENGINE = Distributed('cluster', 'signoz_logs', 'logs_attribute_keys', cityHash64(datatype))
