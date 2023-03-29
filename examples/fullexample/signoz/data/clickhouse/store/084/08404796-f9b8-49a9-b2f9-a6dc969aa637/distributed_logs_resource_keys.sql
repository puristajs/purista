ATTACH TABLE _ UUID '116b44ff-3535-454d-912b-e58ccff0382f'
(
    `name` String,
    `datatype` String
)
ENGINE = Distributed('cluster', 'signoz_logs', 'logs_resource_keys', cityHash64(datatype))
