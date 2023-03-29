ATTACH MATERIALIZED VIEW _ UUID '57728094-bb31-4459-a3ad-3def309000c7' TO signoz_traces.top_level_operations
(
    `name` LowCardinality(String),
    `serviceName` LowCardinality(String)
) AS
SELECT DISTINCT
    name,
    serviceName
FROM signoz_traces.signoz_index_v2
WHERE parentSpanID = ''
