ATTACH MATERIALIZED VIEW _ UUID '33ba9b78-6282-45de-9ed5-14e3e1e21f50' TO signoz_traces.usage_explorer
(
    `timestamp` DateTime,
    `service_name` LowCardinality(String),
    `count` UInt64
) AS
SELECT
    toStartOfHour(timestamp) AS timestamp,
    serviceName AS service_name,
    count() AS count
FROM signoz_traces.signoz_index_v2
GROUP BY
    timestamp,
    serviceName
