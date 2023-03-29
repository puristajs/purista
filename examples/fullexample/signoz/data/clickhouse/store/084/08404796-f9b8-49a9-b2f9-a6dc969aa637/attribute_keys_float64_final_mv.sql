ATTACH MATERIALIZED VIEW _ UUID '55d99834-c752-41e5-bdf3-40db2d6232e7' TO signoz_logs.logs_attribute_keys
(
    `name` String,
    `datatype` String
) AS
SELECT DISTINCT
    arrayJoin(attributes_float64_key) AS name,
    'Float64' AS datatype
FROM signoz_logs.logs
ORDER BY name ASC
